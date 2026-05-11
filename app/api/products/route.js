export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { NextResponse } from "next/server";

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
    const data = await req.json();
    const { stock, ...payload } = data;
    const productDoc = await Product.create({
      ...payload,
      available: payload.available !== undefined ? Boolean(payload.available) : true,
    });
    return NextResponse.json(productDoc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDB();
    const { _id, stock, ...data } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "ID manquant pour la mise à jour" }, { status: 400 });
    }

    await Product.updateOne({ _id }, {
      ...data,
      ...(data.available !== undefined ? { available: Boolean(data.available) } : {}),
    });
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectToDB();
    const { _id, available } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await Product.updateOne({ _id }, { available: Boolean(available) });
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
