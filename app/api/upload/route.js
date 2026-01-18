import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req) {
  // 0. DIAGNOSTIC DE SÉCURITÉ (Pour déboguer l'erreur Vercel)
  // Cela vérifie si les clés existent AVANT d'essayer de se connecter
  if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
    console.error("❌ ERREUR CRITIQUE : Les variables d'environnement AWS sont vides !");
    console.log("État S3_ACCESS_KEY :", process.env.S3_ACCESS_KEY ? "✅ Présente" : "❌ MANQUANTE (Vérifiez l'orthographe sur Vercel)");
    console.log("État S3_SECRET_KEY :", process.env.S3_SECRET_KEY ? "✅ Présente" : "❌ MANQUANTE");
    console.log("État S3_REGION :", process.env.S3_REGION);
    console.log("État S3_BUCKET_NAME :", process.env.S3_BUCKET_NAME);
    
    return NextResponse.json({ message: "Erreur configuration serveur : Clés AWS manquantes" }, { status: 500 });
  }

  // Configuration du client S3 (Initialisé ici pour être sûr d'avoir les clés)
  const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });

  try {
    // 1. Récupérer le fichier envoyé
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ message: "Aucun fichier reçu" }, { status: 400 });
    }

    // 2. Convertir le fichier en Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Créer un nom unique (Timestamp + Nom nettoyé)
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

    // 4. Paramètres d'envoi S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      // ACL: 'public-read', // À décommenter seulement si nécessaire selon votre config bucket
    };

    // 5. Envoyer vers AWS
    await s3Client.send(new PutObjectCommand(uploadParams));

    // 6. Construire l'URL
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${filename}`;

    console.log("✅ Upload S3 réussi :", url);
    return NextResponse.json({ url });

  } catch (error) {
    console.error("❌ Erreur lors de l'envoi S3:", error);
    // On renvoie l'erreur exacte pour mieux comprendre
    return NextResponse.json({ message: "Échec de l'upload", details: error.message }, { status: 500 });
  }
}