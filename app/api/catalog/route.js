export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getCatalog } from "@/lib/catalog";
import { NextResponse } from "next/server";

// Interrogé régulièrement par le navigateur : réponse minuscule si rien n'a changé
export async function GET(req) {
  try {
    const known = new URL(req.url).searchParams.get("v");
    const catalog = await getCatalog();
    const body = known === catalog.version ? { version: catalog.version, unchanged: true } : catalog;
    return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Erreur API catalogue :", error.message);
    return NextResponse.json({ error: "Catalogue indisponible" }, { status: 500 });
  }
}
