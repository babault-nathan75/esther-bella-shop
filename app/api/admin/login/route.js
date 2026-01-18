export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(req) {
  const { pseudo, password } = await req.json();

  // Comparaison avec les variables d'environnement (ADMIN_PSEUDO)
  if (
    pseudo === process.env.ADMIN_PSEUDO && 
    password === process.env.ADMIN_PASSWORD
  ) {
    // 1. Préparation de la clé secrète JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    // 2. Génération du Jeton JWT signé (Durée 24h)
    const token = await new SignJWT({ pseudo, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    // 3. Réponse avec ton message de bienvenue personnalisé
    const response = NextResponse.json(
      { message: "Bienvenue 👑Queen Mooooo👑" }, 
      { status: 200 }
    );
    
    // 4. On place le JWT dans un cookie HTTP-Only ultra-sécurisé
    response.cookies.set("admin_session", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 heures
      path: "/"
    });

    return response;
  }

  // Si les identifiants sont erronés
  return NextResponse.json({ message: "Identifiants incorrects" }, { status: 401 });
}