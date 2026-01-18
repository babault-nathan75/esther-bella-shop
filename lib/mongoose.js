import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    // Vérifier si le lien est présent
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI est manquant dans le fichier .env");
    }

    // Si déjà connecté, on garde la connexion
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }

    // Tentative de connexion
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté à MongoDB avec succès !");
    return conn;

  } catch (error) {
    console.error("❌ ERREUR DE CONNEXION MONGODB :", error.message);
    throw error; // On relance l'erreur pour que l'API le sache
  }
};