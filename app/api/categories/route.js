export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { NextResponse } from "next/server";

function toFields({ name, description, image, order }) {
  const fields = {};
  if (name !== undefined) fields.name = String(name).trim();
  if (description !== undefined) fields.description = String(description).trim();
  if (image !== undefined) fields.image = String(image).trim();
  if (order !== undefined) fields.order = Number(order) || 0;
  return fields;
}

export async function POST(req) {
  try {
    await connectToDB();
    const fields = toFields(await req.json());
    if (!fields.name) {
      return NextResponse.json({ error: "Le nom de la rubrique est obligatoire." }, { status: 400 });
    }
    const last = await Category.findOne().sort({ order: -1 }).select("order").lean();
    const categoryDoc = await Category.create({ ...fields, order: (last?.order ?? -1) + 1 });
    return NextResponse.json(categoryDoc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const categories = await Category.find().sort({ order: 1, _id: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDB();
    const { _id, ...data } = await req.json();
    if (!_id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    await Category.updateOne({ _id }, toFields(data), { runValidators: true });
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    await connectToDB();
    await Category.deleteOne({ _id });
    // Les pièces restent en boutique, simplement sans rubrique
    await Product.updateMany({ category: _id }, { $set: { category: null } });
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
