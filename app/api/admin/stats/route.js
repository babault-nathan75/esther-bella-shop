import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  
  const productCount = await Product.countDocuments();
  const orders = await Order.find().sort({ createdAt: -1 });

  // Calcul sécurisé du Chiffre d'Affaires
  const totalRevenue = orders.reduce((acc, order) => {
    const amount = Number(order.total) || 0; // Force la conversion en nombre
    return acc + amount;
  }, 0);

  const pendingOrders = orders.filter(o => o.status === 'En attente' || !o.status).length;

  return NextResponse.json({
    productCount,
    totalRevenue,
    pendingOrders,
    recentOrders: orders.slice(0, 5) // On prend les 5 plus récentes
  });
}