import { connectToDB } from "@/lib/mongoose";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();
    const { name, phone, city, address, cartProducts, total } = data;

    // --- 1. SÉCURITÉ : VÉRIFICATION DES DONNÉES ENTRANTES ---
    if (!name || !phone || !cartProducts || cartProducts.length === 0 || total === undefined) {
      return NextResponse.json(
        { error: "Certaines informations obligatoires sont manquantes pour valider la commande." }, 
        { status: 400 }
      );
    }

    // --- 2. VÉRIFICATION DU STOCK AVANT VALIDATION ---
    for (const item of cartProducts) {
      // SÉCURITÉ : Vérifier si l'ID est valide pour MongoDB avant de chercher
      if (!item._id || !mongoose.Types.ObjectId.isValid(item._id)) {
        return NextResponse.json(
          { error: `Identifiant de produit invalide : ${item.title || 'Inconnu'}` }, 
          { status: 400 }
        );
      }

      const dbProduct = await Product.findById(item._id);
      
      if (!dbProduct) {
        return NextResponse.json(
          { error: `La pièce "${item.title}" n'existe plus dans notre catalogue.` }, 
          { status: 400 }
        );
      }

      if (dbProduct.stock <= 0) {
        return NextResponse.json(
          { 
            error: `Indisponible : La pièce "${dbProduct.title}" vient d'être épuisée à l'instant.`,
            outOfStock: true 
          }, 
          { status: 400 }
        );
      }
    }

    // --- 3. NETTOYAGE ET CONVERSION DU TOTAL (ANTI-ERREUR 500) ---
    // On s'assure que 'total' est un nombre pur pour Mongoose
    let orderTotal = 0;
    if (typeof total === "string") {
      orderTotal = parseFloat(total.replace(/[^\d.]/g, ""));
    } else {
      orderTotal = Number(total);
    }

    // Vérification finale du total pour éviter d'enregistrer "NaN"
    if (isNaN(orderTotal)) {
      return NextResponse.json({ error: "Le montant total de la commande est invalide." }, { status: 400 });
    }

    // --- 4. CRÉATION DE LA COMMANDE ---
    // On crée l'objet de commande avec des types de données garantis
    const orderDoc = await Order.create({
      name: String(name),
      phone: String(phone),
      city: String(city),
      address: String(address),
      cartProducts: cartProducts, // Mongoose gérera la validation du sous-document
      total: orderTotal,
      paid: false,
      status: 'En attente',
    });

    // --- 5. MISE À JOUR DES STOCKS ---
    // On ne décrémente que si la commande a été créée avec succès ci-dessus
    for (const item of cartProducts) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -1 } 
      });
    }

    // --- 6. RÉPONSE DE SUCCÈS ---
    return NextResponse.json({ 
      id: orderDoc._id,
      message: "L'empire Esther Bella vous remercie pour votre confiance."
    });

  } catch (error) {
    // Log précis pour le développeur dans la console du terminal
    console.error("ERREUR CRITIQUE API CHECKOUT :", error.message);
    
    // Réponse propre pour le client (Axios)
    return NextResponse.json(
      { 
        error: "Le serveur n'a pas pu traiter la commande.", 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}