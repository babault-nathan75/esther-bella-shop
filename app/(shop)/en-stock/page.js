import ShopView from "@/components/ShopView";
import { InStockHero } from "@/components/PageHeroes";

export const metadata = {
  title: "Tenues en stock à Abidjan, livrées rapidement",
  alternates: { canonical: "/en-stock" },
  description: "Les tenues disponibles tout de suite chez Esther Bella Shop, prêtes à être livrées à Abidjan.",
};

export default function InStockPage() {
  return <ShopView mode="instock" showStock hero={<InStockHero />} />;
}
