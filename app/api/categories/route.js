import { connectToDB } from "@/lib/mongoose";
import { Category } from "@/lib/models/Category";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();
    const { name } = await req.json();
    const categoryDoc = await Category.create({ name });
    return NextResponse.json(categoryDoc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const categories = await Category.find();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  await connectToDB();
  await Category.deleteOne({ _id });
  return NextResponse.json(true);
}

