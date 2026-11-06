export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Order } from "@/lib/models/Order";
import { parsePeriod } from "@/lib/period";
import { orderNumber } from "@/lib/shop";
import { NextResponse } from "next/server";

// Le préfixe ' empêche Excel d'exécuter une valeur saisie par une cliente comme une formule
const cell = (value) => {
  const text = String(value ?? "");
  return `"${(/^[=+\-@]/.test(text) ? `'${text}` : text).replace(/"/g, '""')}"`;
};

export async function GET(req) {
  const period = parsePeriod(new URL(req.url).searchParams);
  if (!period) return NextResponse.json({ error: "Période invalide" }, { status: 400 });

  await connectToDB();
  const orders = await Order.find({ createdAt: { $gte: period.from, $lte: period.to } }).sort({ createdAt: -1 }).lean();

  const rows = [
    ["Numéro", "Date", "Cliente", "Téléphone", "Lieu", "Adresse", "Articles", "Livraison", "Total", "Paiement", "Statut"],
    ...orders.map((o) => [
      orderNumber(o._id),
      new Date(o.createdAt).toISOString().slice(0, 16).replace("T", " "),
      o.name,
      o.phone,
      o.city,
      o.address,
      (o.cartProducts || []).map((i) => `${i.title} (${i.selectedSize || "Unique"})`).join(" | "),
      o.shippingPending ? "À confirmer" : o.shippingCost,
      o.total,
      o.paymentMethod,
      o.status,
    ]),
  ];

  // Point-virgule et BOM : ouverture directe dans Excel en français
  const csv = "﻿" + rows.map((row) => row.map(cell).join(";")).join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="commandes-${period.from.toISOString().slice(0, 10)}.csv"`,
    },
  });
}
