export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { DeliveryZone } from "@/lib/models/DeliveryZone";
import { notifyNewOrder } from "@/lib/ntfy";
import { CUSTOM_SIZE, PAYMENT_METHODS, isConfection, orderNumber } from "@/lib/shop";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const clean = (value, max = 300) => String(value ?? "").trim().slice(0, max);
const refuse = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();
    const name = clean(data.name, 120);
    const phone = clean(data.phone, 30);
    const address = clean(data.address);
    const items = Array.isArray(data.items) ? data.items.slice(0, 50) : [];

    // --- 1. COORDONNÉES ---
    if (!name || !address || !items.length) {
      return refuse("Certaines informations obligatoires sont manquantes.");
    }
    if (phone.replace(/\D/g, "").length < 8) {
      return refuse("Le numéro de téléphone semble incomplet.");
    }

    // --- 2. LIVRAISON : le tarif vient toujours de la base ---
    let city, shippingCost = 0, shippingPending = false;
    if (data.zoneId === "other") {
      city = clean(data.customCity, 120);
      shippingPending = true;
      if (!city) return refuse("Merci d'indiquer votre lieu de livraison.");
    } else {
      const zone = mongoose.Types.ObjectId.isValid(data.zoneId)
        ? await DeliveryZone.findOne({ _id: data.zoneId, active: true })
        : null;
      if (!zone) return refuse("Ce lieu de livraison n'est plus proposé. Merci d'en choisir un autre.");
      city = zone.name;
      shippingCost = zone.price;
    }

    // --- 3. ARTICLES : prix et disponibilité viennent toujours de la base ---
    if (items.some((item) => !mongoose.Types.ObjectId.isValid(item?._id))) {
      return refuse("Un article du panier est invalide.");
    }
    const found = await Product.find({ _id: { $in: items.map((item) => item._id) } }).lean();
    const products = new Map(found.map((p) => [String(p._id), p]));

    const cartProducts = [];
    for (const item of items) {
      const product = products.get(String(item._id));
      if (!product) return refuse("Une pièce de votre panier n'existe plus dans notre catalogue.");
      if (product.available === false) {
        return NextResponse.json(
          { error: `« ${product.title} » n'est plus disponible.`, outOfStock: true },
          { status: 409 }
        );
      }

      const selectedSize = clean(item.selectedSize, 40);
      const allowedSizes = [...(product.sizes || []), ...(isConfection(product) ? [CUSTOM_SIZE] : [])];
      if (allowedSizes.length && !allowedSizes.includes(selectedSize)) {
        return refuse(`Merci de choisir une taille pour « ${product.title} ».`);
      }

      cartProducts.push({
        _id: String(product._id),
        title: product.title,
        price: product.price,
        images: product.images?.slice(0, 1) || [],
        selectedSize: selectedSize || "Unique",
        kind: product.kind || "stock",
        leadTime: product.leadTime || "",
        notes: clean(item.notes, 1000),
      });
    }

    const subtotal = cartProducts.reduce((sum, item) => sum + item.price, 0);

    // --- 4. RÉSERVATION DU STOCK : atomique, deux clientes ne peuvent pas prendre la dernière pièce ---
    const wanted = new Map();
    for (const item of cartProducts) {
      if (typeof products.get(item._id).quantity === "number") wanted.set(item._id, (wanted.get(item._id) || 0) + 1);
    }
    const stockReserved = [];
    const releaseStock = () => Promise.all(stockReserved.map(({ _id, count }) => Product.updateOne({ _id }, { $inc: { quantity: count } })));
    for (const [_id, count] of wanted) {
      const { modifiedCount } = await Product.updateOne({ _id, quantity: { $gte: count } }, { $inc: { quantity: -count } });
      if (!modifiedCount) {
        await releaseStock();
        const title = products.get(_id).title;
        return NextResponse.json({ error: `Stock insuffisant pour « ${title} ».`, outOfStock: true }, { status: 409 });
      }
      stockReserved.push({ _id, count });
    }

    // --- 5. CRÉATION DE LA COMMANDE ---
    const orderDoc = await Order.create({
      name,
      phone,
      city,
      address,
      cartProducts,
      subtotal,
      shippingCost,
      shippingPending,
      total: subtotal + shippingCost,
      paymentMethod: PAYMENT_METHODS.includes(data.paymentMethod) ? data.paymentMethod : PAYMENT_METHODS[0],
      paid: false,
      status: 'En attente',
      stockReserved,
    }).catch(async (error) => {
      await releaseStock();
      throw error;
    });
    await Product.updateMany({ _id: { $in: [...wanted.keys()] }, quantity: 0 }, { available: false });

    // --- 6. NOTIFICATION ADMIN (attendue : Vercel coupe la fonction après la réponse) ---
    await notifyNewOrder(orderDoc, new URL(req.url).origin);

    return NextResponse.json({
      id: orderDoc._id,
      orderNumber: orderNumber(orderDoc._id),
      subtotal,
      shippingCost,
      shippingPending,
      total: orderDoc.total,
      city,
      paymentMethod: orderDoc.paymentMethod,
    });

  } catch (error) {
    console.error("ERREUR CRITIQUE API CHECKOUT :", error.message);
    return refuse("Le serveur n'a pas pu traiter la commande. Merci de réessayer.", 500);
  }
}
