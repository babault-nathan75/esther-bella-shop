export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { Order } from "@/lib/models/Order";
import { PageView } from "@/lib/models/PageView";
import { daysBetween, parsePeriod } from "@/lib/period";
import { NextResponse } from "next/server";

const LOW_STOCK = 2;
const PAGE_NAMES = {
  "/": "Accueil", "/shop": "Prêt à porter", "/nouveautes": "Nouveautés", "/confection": "Sur commande",
  "/cart": "Panier", "/checkout": "Commande", "/contact": "Contact", "/livraison-retours": "Livraison et retours",
  "/guide-tailles": "Guide des tailles", "/notre-histoire": "Notre histoire", "/ethique-qualite": "Éthique et qualité",
  "/points-vente": "Points de vente",
};
const inRange = (from, to) => ({ createdAt: { $gte: from, $lte: to } });
const CANCELLED = "Annulée";

function ranking(map, limit = 6) {
  return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, limit);
}

function tally(rows, keyOf, valueOf = () => 1) {
  const map = new Map();
  for (const row of rows) {
    const key = keyOf(row);
    if (key) map.set(key, (map.get(key) || 0) + valueOf(row));
  }
  return map;
}

function salesSummary(orders) {
  const valid = orders.filter((o) => o.status !== CANCELLED);
  const revenue = valid.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  return { orders: valid.length, revenue, avgBasket: valid.length ? Math.round(revenue / valid.length) : 0 };
}

async function audienceSummary(from, to) {
  const [visitors, views] = await Promise.all([
    PageView.distinct("visitorId", inRange(from, to)),
    PageView.countDocuments(inRange(from, to)),
  ]);
  return { visitors: visitors.length, views, visitorIds: visitors };
}

const conversion = (orders, visitors) => (visitors ? Math.round((orders / visitors) * 1000) / 10 : 0);

export async function GET(req) {
  await connectToDB();

  const period = parsePeriod(new URL(req.url).searchParams);
  if (!period) return NextResponse.json({ error: "Période invalide" }, { status: 400 });
  const { from, to, previousFrom, previousTo } = period;

  const [orders, previousOrders, audience, previousAudience, views, products, dailyAudience, online] = await Promise.all([
    Order.find(inRange(from, to)).sort({ createdAt: -1 }).lean(),
    Order.find(inRange(previousFrom, previousTo)).select("total status").lean(),
    audienceSummary(from, to),
    audienceSummary(previousFrom, previousTo),
    PageView.find(inRange(from, to)).select("path productId source device visitorId").lean(),
    Product.find().select("title available quantity kind inStock images").lean(),
    PageView.aggregate([
      { $match: inRange(from, to) },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, views: { $sum: 1 }, visitors: { $addToSet: "$visitorId" } } },
      { $project: { views: 1, visitors: { $size: "$visitors" } } },
    ]),
    PageView.distinct("visitorId", { createdAt: { $gte: new Date(Date.now() - 5 * 60000) } }),
  ]);

  // Visiteuses déjà venues avant la période
  const returning = audience.visitorIds.length
    ? (await PageView.distinct("visitorId", { visitorId: { $in: audience.visitorIds }, createdAt: { $lt: from } })).length
    : 0;

  const sales = salesSummary(orders);
  const previousSales = salesSummary(previousOrders);
  const validOrders = orders.filter((o) => o.status !== CANCELLED);

  // Courbes jour par jour, jours vides compris
  const audienceByDay = new Map(dailyAudience.map((d) => [d._id, d]));
  const dayKey = (o) => new Date(o.createdAt).toISOString().slice(0, 10);
  const ordersByDay = tally(validOrders, dayKey);
  const revenueByDay = tally(validOrders, dayKey, (o) => Number(o.total) || 0);
  const series = daysBetween(from, to).map((date) => ({
    date,
    visitors: audienceByDay.get(date)?.visitors || 0,
    views: audienceByDay.get(date)?.views || 0,
    orders: ordersByDay.get(date) || 0,
    revenue: revenueByDay.get(date) || 0,
  }));

  const categoryNames = new Map((await Category.find().select("name").lean()).map((c) => [String(c._id), c.name]));
  const pageName = (path) => {
    const categoryId = path.match(/^\/category\/(.+)$/)?.[1];
    return categoryId ? `Rubrique : ${categoryNames.get(categoryId) || "supprimée"}` : PAGE_NAMES[path] || path;
  };

  const titles = new Map(products.map((p) => [String(p._id), p.title]));
  const items = validOrders.flatMap((o) => o.cartProducts || []);
  const allPending = await Order.find({ status: { $in: ["En attente", null] } }).countDocuments();
  const shippingToSet = await Order.countDocuments({ shippingPending: true, status: { $ne: CANCELLED } });
  const inProgress = await Order.countDocuments({ status: { $in: ["Confirmée", "En préparation", "En livraison"] } });

  const firstOrderBefore = validOrders.length
    ? await Order.distinct("phone", { phone: { $in: validOrders.map((o) => o.phone) }, createdAt: { $lt: from } })
    : [];
  const customers = new Set(validOrders.map((o) => o.phone));

  return NextResponse.json({
    kpis: {
      visitors: audience.visitors,
      views: audience.views,
      ...sales,
      conversion: conversion(sales.orders, audience.visitors),
    },
    previous: {
      visitors: previousAudience.visitors,
      views: previousAudience.views,
      ...previousSales,
      conversion: conversion(previousSales.orders, previousAudience.visitors),
    },
    online: online.length,
    audienceSplit: { new: audience.visitors - returning, returning },
    customers: { total: customers.size, returning: firstOrderBefore.length },
    series,
    topPages: ranking(tally(views, (v) => v.productId ? null : pageName(v.path))),
    topViewed: ranking(tally(views, (v) => v.productId && titles.get(v.productId))),
    topSold: ranking(tally(items, (i) => i.title)),
    sources: ranking(tally(views, (v) => v.source)),
    devices: ranking(tally(views, (v) => v.device)),
    zones: ranking(tally(validOrders, (o) => o.city)),
    payments: ranking(tally(validOrders, (o) => o.paymentMethod)),
    statuses: ranking(tally(orders, (o) => o.status || "En attente"), 10),
    alerts: {
      pending: allPending,
      shippingToSet,
      inProgress,
      soldOut: products.filter((p) => p.available === false).length,
      lowStock: products
        .filter((p) => p.available !== false && typeof p.quantity === "number" && p.quantity <= LOW_STOCK)
        .map((p) => ({ _id: p._id, title: p.title, quantity: p.quantity })),
    },
    catalog: {
      total: products.length,
      stock: products.filter((p) => p.inStock === true && p.kind !== "confection" && p.available !== false).length,
      ready: products.filter((p) => p.inStock !== true && p.kind !== "confection").length,
      confection: products.filter((p) => p.kind === "confection").length,
    },
    recentOrders: orders.slice(0, 6).map(({ _id, name, city, total, status }) => ({ _id, name, city, total, status })),
  });
}
