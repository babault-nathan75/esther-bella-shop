import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";

export async function POST(req) {
  try {
    // 1. Récupérer le fichier envoyé
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ message: "Aucun fichier reçu" }, { status: 400 });
    }

    // 2. Convertir le fichier en Buffer (données brutes)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Définir le dossier de destination (public/uploads)
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 4. Créer un nom unique pour éviter les doublons (timestamp + nom)
    const filename = Date.now() + "-" + file.name.replaceAll(" ", "_");
    const filePath = path.join(uploadDir, filename);

    // 5. Écrire le fichier sur le disque
    await writeFile(filePath, buffer);

    // 6. Renvoyer l'URL accessible
    return NextResponse.json({ url: `/uploads/${filename}` });

  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}