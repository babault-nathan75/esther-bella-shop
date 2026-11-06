import ShopView from "@/components/ShopView";
import { MadeToOrderHero } from "@/components/PageHeroes";

export const metadata = {
  title: "Tenues sur mesure et sur commande à Abidjan",
  alternates: { canonical: "/confection" },
  description: "Choisissez un modèle et faites-le confectionner à vos mesures à Abidjan.",
};

export default function ConfectionPage() {
  return <ShopView mode="confection" hero={<MadeToOrderHero />} />;
}
