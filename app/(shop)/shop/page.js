import ShopView from "@/components/ShopView";
import { ReadyToWearHero } from "@/components/PageHeroes";

export const metadata = {
  title: "Prêt à porter femme à Abidjan",
  description: "Robes, tops, pantalons et ensembles : découvrez le prêt à porter femme d'Esther Bella Shop, livré à Abidjan.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopView mode="ready" hero={<ReadyToWearHero />} />;
}
