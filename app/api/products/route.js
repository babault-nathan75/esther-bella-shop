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
    const productDoc = await Product.create({
      ...data,
      stock: Number(data.stock) || 0
    });
    return NextResponse.json(productDoc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDB();
    const { _id, ...data } = await req.json();
    
    if (!_id) {
      return NextResponse.json({ error: "ID manquant pour la mise à jour" }, { status: 400 });
    }

    await Product.updateOne({ _id }, {
      ...data,
      stock: Number(data.stock) || 0
    });
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();
    
    // CORRECTION : Extraction sécurisée de l'ID depuis l'URL
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