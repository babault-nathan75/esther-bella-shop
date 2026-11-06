export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { connectToDB } from "@/lib/mongoose";
import { LoginAttempt } from "@/lib/models/LoginAttempt";
import { attemptKey, recordFailure } from "@/lib/rateLimit";

const MAX_FAILURES = 5;

const FAILURE_DELAY_MS = 600;
const SESSION_HOURS = 12;

// Comparaison à durée constante : le temps de réponse ne renseigne pas sur le secret
const sameSecret = (a, b) => timingSafeEqual(
  createHash("sha256").update(a).digest(),
  createHash("sha256").update(b).digest()
);

const isSameOrigin = (req) => {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
};

function blockedResponse(expireAt) {
  const seconds = Math.max(1, Math.ceil((new Date(expireAt).getTime() - Date.now()) / 1000));
  return NextResponse.json(
    { message: `Trop de tentatives. Réessayez dans ${Math.ceil(seconds / 60)} min.` },
    { status: 429, headers: { "Retry-After": String(seconds) } }
  );
}

export async function POST(req) {
  if (!isSameOrigin(req)) return NextResponse.json({ message: "Requête refusée" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const pseudo = String(body.pseudo || "").trim().slice(0, 100);
  const password = String(body.password || "").slice(0, 200);

  // Champ invisible : seul un robot le remplit
  if (body.website) return NextResponse.json({ message: "Identifiants incorrects" }, { status: 401 });

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

  const key = attemptKey(req, "login");
  try {
    await connectToDB();
    const attempt = await LoginAttempt.findOne({ key, expireAt: { $gt: new Date() } }).lean();
    // Vérifié avant le mot de passe : même le bon est refusé pendant le blocage
    if (attempt && attempt.count >= MAX_FAILURES) return blockedResponse(attempt.expireAt);
  } catch (error) {
    console.error("[admin/login] Limitation indisponible :", error.message);
    return NextResponse.json({ message: "Service indisponible. Réessayez." }, { status: 503 });
  }

  const pseudoMatch = sameSecret(pseudo.toLowerCase(), envPseudo.trim().toLowerCase());
  const passwordMatch = sameSecret(password, envPassword);

  if (pseudoMatch && passwordMatch) {
    await LoginAttempt.deleteOne({ key }).catch(() => {});

    const secret = new TextEncoder().encode(envSecret);
    const token = await new SignJWT({ pseudo: envPseudo, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${SESSION_HOURS}h`)
      .sign(secret);

    const response = NextResponse.json(
      { message: "Bienvenue 👑Queen Mooooo👑" },
      { status: 200 }
    );

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * SESSION_HOURS,
      path: "/",
    });

    return response;
  }

  await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
  const attempt = await recordFailure(key).catch((error) => {
    console.error("[admin/login] Échec non compté :", error.message);
    return null;
  });
  if (attempt && attempt.count >= MAX_FAILURES) return blockedResponse(attempt.expireAt);

  return NextResponse.json({ message: "Identifiants incorrects" }, { status: 401 });
}
