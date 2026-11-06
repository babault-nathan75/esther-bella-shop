export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { NextResponse } from "next/server";

// Seuls ces champs peuvent être écrits depuis le formulaire admin
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function toPoster(poster) {
  return {
    enabled: Boolean(poster.enabled),
    collection: String(poster.collection || "").trim().slice(0, 60),
    title: String(poster.title || "").trim().slice(0, 80),
    text: String(poster.text || "").trim().slice(0, 400),
    colorName: String(poster.colorName || "").trim().slice(0, 40),
    clawColor: HEX_COLOR.test(poster.clawColor) ? poster.clawColor : "#7ec8e3",
    backgroundColor: HEX_COLOR.test(poster.backgroundColor) ? poster.backgroundColor : "#ffffff",
  };
}

function toFields(data) {
  const fields = {};
  if (data.title !== undefined) fields.title = String(data.title).trim();
  if (data.description !== undefined) fields.description = String(data.description);
  if (data.price !== undefined) fields.price = Number(data.price);
  if (Array.isArray(data.images)) fields.images = data.images;
  if (Array.isArray(data.sizes)) fields.sizes = data.sizes;
  if (data.available !== undefined) fields.available = Boolean(data.available);
  if (data.quantity !== undefined) {
    fields.quantity = data.quantity === null || data.quantity === "" ? null : Math.max(0, Math.floor(Number(data.quantity)));
  }
  if (data.poster) fields.poster = toPoster(data.poster);
  if (data.inStock !== undefined) fields.inStock = Boolean(data.inStock);
  if (data.kind !== undefined) fields.kind = data.kind === "confection" ? "confection" : "stock";
  if (data.leadTime !== undefined) fields.leadTime = String(data.leadTime).trim();
  if (data.category !== undefined) fields.category = data.category || null;
  return fields;
}

function errorResponse(error) {
  if (error.code === 11000) {
    return NextResponse.json({ error: "Une pièce porte déjà ce nom. Merci d'en choisir un autre." }, { status: 409 });
  }
  return NextResponse.json({ error: error.message }, { status: 500 });
}

// Un retour en stock remet la pièce en tête des nouveaux arrivages
async function updateProduct(_id, fields) {
  const current = await Product.findById(_id).select("available quantity").lean();
  // La quantité commande la disponibilité
  if (fields.quantity === 0) fields.available = false;
  else if (fields.quantity > 0 && fields.quantity > (current?.quantity ?? 0)) fields.available = true;
  // Remise en vente manuelle sans quantité saisie : on ne bloque plus sur l'ancien 0
  else if (fields.available === true && fields.quantity === undefined && current?.quantity === 0) fields.quantity = null;
  if (fields.available === true && current?.available === false) {
    fields.arrivalAt = new Date();
  }
  await Product.updateOne({ _id }, fields, { runValidators: true });
}

export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const fields = toFields(await req.json());
    if (fields.quantity === 0) fields.available = false;
    const productDoc = await Product.create({ ...fields, arrivalAt: new Date() });
    return NextResponse.json(productDoc);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req) {
  try {
    await connectToDB();
    const { _id, ...data } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "ID manquant pour la mise à jour" }, { status: 400 });
    }

    await updateProduct(_id, toFields(data));
    return NextResponse.json(true);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req) {
  try {
    await connectToDB();
    const { _id, available, renew, featured, heroSlot } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // Repart pour 7 jours dans « Nouveautés »
    if (renew) {
      await Product.updateOne({ _id }, { arrivalAt: new Date() });
      return NextResponse.json(true);
    }

    if (heroSlot !== undefined) {
      const slot = ["left", "center", "right"].includes(heroSlot) ? heroSlot : null;
      if (slot) await Product.updateMany({ heroSlot: slot, _id: { $ne: _id } }, { heroSlot: null });
      await Product.updateOne({ _id }, { heroSlot: slot });
      return NextResponse.json(true);
    }

    if (featured !== undefined) {
      if (featured) await Product.updateMany({ featured: true, _id: { $ne: _id } }, { featured: false });
      await Product.updateOne({ _id }, { featured: Boolean(featured) });
      return NextResponse.json(true);
    }

    await updateProduct(_id, { available: Boolean(available) });
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID manquant pour la suppression" }, { status: 400 });
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json("deleted");
  } catch (error) {
    console.error("Erreur DELETE Product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
