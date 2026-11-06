export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { ORDER_STATUSES } from "@/lib/shop";
import { NextResponse } from "next/server";

// Récupérer toutes les commandes
export async function GET() {
  await connectToDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

// Mettre à jour le statut ou fixer les frais d'une livraison hors zone
export async function PUT(req) {
  await connectToDB();
  const { id, status, shippingCost } = await req.json();

  const order = await Order.findById(id);
  if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  if (status !== undefined) {
    if (!ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }
    // Annuler rend le stock réservé ; réactiver le reprend, s'il en reste
    const wasCancelled = order.status === "Annulée";
    const reserved = order.stockReserved || [];
    if (status === "Annulée" && !wasCancelled) {
      await Promise.all(reserved.map(({ _id, count }) =>
        Product.updateOne({ _id }, { $inc: { quantity: count }, $set: { available: true } })));
    }
    if (wasCancelled && status !== "Annulée") {
      const done = [];
      for (const { _id, count } of reserved) {
        const { modifiedCount } = await Product.updateOne({ _id, quantity: { $gte: count } }, { $inc: { quantity: -count } });
        if (!modifiedCount) {
          await Promise.all(done.map((r) => Product.updateOne({ _id: r._id }, { $inc: { quantity: r.count } })));
          return NextResponse.json({ error: "Stock insuffisant pour réactiver cette commande." }, { status: 409 });
        }
        done.push({ _id, count });
      }
      await Product.updateMany({ _id: { $in: reserved.map((r) => r._id) }, quantity: 0 }, { available: false });
    }
    order.status = status;
  }

  if (shippingCost !== undefined) {
    const fee = Number(shippingCost);
    if (!Number.isFinite(fee) || fee < 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }
    order.total = order.total - (order.shippingCost || 0) + fee;
    order.shippingCost = fee;
    order.shippingPending = false;
  }

  await order.save();
  return NextResponse.json(order);
}
