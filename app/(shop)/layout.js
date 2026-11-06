export const dynamic = "force-dynamic";

import { Instagram, Facebook } from "lucide-react";
import { CartContextProvider } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";
import SiteChrome from "@/components/SiteChrome";
import SiteFooter from "@/components/SiteFooter";
import { getCatalog } from "@/lib/catalog";
import JsonLd from "@/components/JsonLd";
import { storeJsonLd, websiteJsonLd } from "@/lib/site";

// Lucide n'expose pas TikTok / Snapchat — SVG inline (Simple Icons, licence CC0)
const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.12z"/>
  </svg>
);

const SnapchatIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.654.305-4.857C7.394 1.077 10.739.807 11.732.807l.41-.014h.063z"/>
  </svg>
);

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/kimouchiayeesthermorille?igsh=MTY3b3hhamFjYjUxMQ%3D%3D&utm_source=qr", Icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/share/18NsnXTCpy/", Icon: Facebook },
  { label: "TikTok", href: "https://www.tiktok.com/@estherbella214?_r=1&_t=ZS-9BBVGWHkrbT", Icon: TikTokIcon },
  { label: "Snapchat", href: "https://www.snapchat.com/add/chiayeestherm24?share_id=KRt9xM1Gk5w&locale=fr-FR", Icon: SnapchatIcon },
];

async function loadCatalog() {
  try {
    return await getCatalog();
  } catch (error) {
    // Les pages restent affichées : le navigateur réessaiera de charger le catalogue
    console.error("Catalogue indisponible au rendu :", error.message);
    return { version: "", products: [], categories: [], zones: [] };
  }
}

export default async function ShopLayout({ children }) {
  const catalog = await loadCatalog();

  return (
    <div className="bg-white text-ink">
      <CatalogProvider initial={catalog}>
        <CartContextProvider>
          <JsonLd data={storeJsonLd(SOCIALS.map((s) => s.href))} />
          <JsonLd data={websiteJsonLd()} />
          <SiteChrome />

          <main className="min-h-[60vh]">{children}</main>

          <SiteFooter socials={SOCIALS.map(({ Icon, ...social }) => ({ ...social, icon: <Icon width={18} height={18} /> }))} />
        </CartContextProvider>
      </CatalogProvider>
    </div>
  );
}
