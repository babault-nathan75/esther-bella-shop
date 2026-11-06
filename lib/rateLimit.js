import { createHash } from "crypto";
import { LoginAttempt } from "@/lib/models/LoginAttempt";

const WINDOW_MS = 15 * 60 * 1000;

// Compteur en base : la mémoire d'une fonction Vercel n'est pas partagée entre les instances
export function attemptKey(req, scope) {
  const ip = req.headers.get("x-vercel-forwarded-for")
    || req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    || "inconnue";
  return createHash("sha256").update(`${scope}:${ip}`).digest("hex");
}

export async function recordFailure(key) {
  const now = new Date();
  // Une ligne échue mais pas encore effacée par MongoDB repart de zéro
  await LoginAttempt.deleteOne({ key, expireAt: { $lte: now } });
  try {
    return await LoginAttempt.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expireAt: new Date(now.getTime() + WINDOW_MS) } },
      { upsert: true, new: true }
    );
  } catch (error) {
    // Deux échecs simultanés créant la même ligne : on recompte sur celle qui existe
    if (error.code !== 11000) throw error;
    return LoginAttempt.findOneAndUpdate({ key }, { $inc: { count: 1 } }, { new: true });
  }
}
