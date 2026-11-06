export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { PageView } from "@/lib/models/PageView";
import { NextResponse } from "next/server";

const BOTS = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp/i;
const NO_CONTENT = () => new NextResponse(null, { status: 204 });

function sourceOf(referrer, ownHost) {
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host === ownHost) return null;
    if (/facebook|fb\.|messenger/.test(host)) return "Facebook";
    if (/instagram/.test(host)) return "Instagram";
    if (/tiktok/.test(host)) return "TikTok";
    if (/snapchat/.test(host)) return "Snapchat";
    if (/whatsapp|wa\.me/.test(host)) return "WhatsApp";
    if (/google/.test(host)) return "Google";
    return host.slice(0, 60);
  } catch {
    return "Accès direct";
  }
}

export async function POST(req) {
  try {
    const userAgent = req.headers.get("user-agent") || "";
    // Ni les robots ni l'admin connectée ne gonflent les chiffres
    if (BOTS.test(userAgent) || req.cookies.get("admin_session")) return NO_CONTENT();

    const { visitorId, path, landing, referrer } = JSON.parse(await req.text());
    if (typeof visitorId !== "string" || !/^[\w-]{8,64}$/.test(visitorId)) return NO_CONTENT();
    if (typeof path !== "string" || !path.startsWith("/") || path.length > 200) return NO_CONTENT();

    await connectToDB();
    await PageView.create({
      visitorId,
      path,
      productId: path.match(/^\/product\/([a-f\d]{24})$/i)?.[1] || null,
      source: landing ? sourceOf(referrer, new URL(req.url).hostname) : null,
      device: /tablet|ipad/i.test(userAgent) ? "Tablette" : /mobi|android|iphone/i.test(userAgent) ? "Mobile" : "Ordinateur",
    });
  } catch (error) {
    console.error("Erreur mesure d'audience :", error.message);
  }
  return NO_CONTENT();
}
