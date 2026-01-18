import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configuration du client S3 (Cloud)
const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    // 1. Récupérer le fichier envoyé
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ message: "Aucun fichier reçu" }, { status: 400 });
    }

    // 2. Convertir le fichier en Buffer pour l'envoi réseau
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Créer un nom unique et propre
    // On remplace les espaces par des tirets pour éviter les bugs d'URL
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

    // 4. Préparer l'envoi vers AWS S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename, // Le nom du fichier dans le cloud
      Body: buffer,
      ContentType: file.type, // Important pour que le navigateur sache si c'est une image ou une vidéo
      // ACL: 'public-read', // Décommente si ton bucket n'est pas configuré en public par défaut
    };

    // 5. Envoyer la commande au Cloud
    await s3Client.send(new PutObjectCommand(uploadParams));

    // 6. Construire l'URL publique de l'image/vidéo
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${filename}`;

    console.log("✅ Upload réussi :", url);
    return NextResponse.json({ url });

  } catch (error) {
    console.error("❌ Erreur upload S3:", error);
    return NextResponse.json({ message: "Erreur lors de l'upload vers le cloud" }, { status: 500 });
  }
}