export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { ensureDeliveryZones } from "@/lib/catalog";
import { DeliveryZone } from "@/lib/models/DeliveryZone";
import { NextResponse } from "next/server";

function toFields({ name, price, active }) {
  const fields = {};
  if (name !== undefined) fields.name = String(name).trim();
  if (price !== undefined) fields.price = Number(price);
  if (active !== undefined) fields.active = Boolean(active);
  return fields;
}

function errorResponse(error) {
  if (error.code === 11000) {
    return NextResponse.json({ error: "Ce lieu de livraison existe déjà." }, { status: 409 });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return NextResponse.json({ error: "Merci d'indiquer un nom et un montant valides." }, { status: 400 });
  }
  return NextResponse.json({ error: error.message }, { status: 500 });
}

export async function GET() {
  try {
    await connectToDB();
    await ensureDeliveryZones();
    return NextResponse.json(await DeliveryZone.find().sort({ name: 1 }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    return NextResponse.json(await DeliveryZone.create(toFields(await req.json())));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req) {
  try {
    await connectToDB();
    const { _id, ...data } = await req.json();
    if (!_id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    await DeliveryZone.updateOne({ _id }, toFields(data), { runValidators: true });
    return NextResponse.json(true);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();
    await DeliveryZone.deleteOne({ _id: new URL(req.url).searchParams.get("_id") });
    return NextResponse.json(true);
  } catch (error) {
    return errorResponse(error);
  }
}
