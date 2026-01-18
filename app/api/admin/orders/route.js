export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Order } from "@/lib/models/Order";
import { NextResponse } from "next/server";

// Récupérer toutes les commandes
export async function GET() {
  await connectToDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

// Mettre à jour le statut d'une commande
export async function PUT(req) {
  await connectToDB();
  const { id, status } = await req.json();
  const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
  return NextResponse.json(updatedOrder);
}