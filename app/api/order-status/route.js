export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { LoginAttempt } from "@/lib/models/LoginAttempt";
import { Order } from "@/lib/models/Order";
import { attemptKey, recordFailure } from "@/lib/rateLimit";
import { orderNumber } from "@/lib/shop";
import { NextResponse } from "next/server";

const MAX_FAILURES = 10;
const lastDigits = (phone) => String(phone || "").replace(/\D/g, "").slice(-8);

const NOT_FOUND = "Aucune commande ne correspond à ce numéro et à ce téléphone.";

// Il faut le numéro ET le téléphone : le numéro seul ne révèle rien, et les essais sont limités
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const hex = String(body.orderNumber || "").trim().replace(/^EB-?/i, "").toLowerCase();
    const phone = lastDigits(body.phone);

    if (!/^[a-f0-9]{6}$/.test(hex) || phone.length < 8) {
      return NextResponse.json({ error: "Vérifiez le numéro de commande (EB-XXXXXX) et le téléphone." }, { status: 400 });
    }

    await connectToDB();
    const key = attemptKey(req, "order-status");
    const attempt = await LoginAttempt.findOne({ key, expireAt: { $gt: new Date() } }).lean();
    if (attempt && attempt.count >= MAX_FAILURES) {
      return NextResponse.json({ error: "Trop d'essais. Réessayez dans 15 minutes." }, { status: 429 });
    }

    const candidates = await Order.find({
      $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: `${hex}$` } },
    }).select("phone status city total shippingPending createdAt cartProducts").lean();
    const order = candidates.find((o) => lastDigits(o.phone) === phone);

    if (!order) {
      await recordFailure(key);
      return NextResponse.json({ error: NOT_FOUND }, { status: 404 });
    }

    return NextResponse.json({
      orderNumber: orderNumber(order._id),
      status: order.status || "En attente",
      city: order.city,
      total: order.total,
      shippingPending: Boolean(order.shippingPending),
      createdAt: order.createdAt,
      items: (order.cartProducts || []).map(({ title, selectedSize, images }) => ({ title, selectedSize, image: images?.[0] || null })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Erreur suivi de commande :", error.message);
    return NextResponse.json({ error: "Service indisponible. Réessayez." }, { status: 500 });
  }
}
