export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const pseudo = String(body.pseudo || "").trim();
  const password = String(body.password || "");

  const envPseudo = process.env.ADMIN_PSEUDO;
  const envPassword = process.env.ADMIN_PASSWORD;
  const envSecret = process.env.JWT_SECRET;

  if (!envPseudo || !envPassword || !envSecret) {
    console.error("[admin/login] Variables d'environnement manquantes");
    return NextResponse.json(
      { message: "Configuration serveur incomplète" },
      { status: 500 }
    );
  }

  const pseudoMatch = pseudo.toLowerCase() === envPseudo.trim().toLowerCase();
  const passwordMatch = password === envPassword;

  if (pseudoMatch && passwordMatch) {
    const secret = new TextEncoder().encode(envSecret);
    const token = await new SignJWT({ pseudo: envPseudo, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.json(
      { message: "Bienvenue 👑Queen Mooooo👑" },
      { status: 200 }
    );

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ message: "Identifiants incorrects" }, { status: 401 });
}
