import { connectToDB } from "@/lib/mongoose";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { SITE_URL } from "@/lib/site";

// Calculé à chaque lecture pour que Google découvre les nouvelles tenues sans redéploiement
export const dynamic = "force-dynamic";

const PAGES = [
  ["", 1.0, "daily"],
  ["/nouveautes", 0.9, "daily"],
  ["/shop", 0.9, "daily"],
  ["/en-stock", 0.9, "daily"],
  ["/confection", 0.9, "daily"],
  ["/livraison-retours", 0.5, "monthly"],
  ["/guide-tailles", 0.5, "monthly"],
  ["/contact", 0.5, "monthly"],
  ["/confirmation", 0.4, "monthly"],
  ["/notre-histoire", 0.4, "monthly"],
  ["/ethique-qualite", 0.3, "monthly"],
  ["/points-vente", 0.4, "monthly"],
];

export default async function sitemap() {
  await connectToDB();
  const [products, categories] = await Promise.all([
    Product.find({}, "updatedAt images").lean(),
    Category.find({}, "_id").lean(),
  ]);

  return [
    ...PAGES.map(([path, priority, changeFrequency]) => ({ url: `${SITE_URL}${path}`, lastModified: new Date(), changeFrequency, priority })),
    ...categories.map((category) => ({ url: `${SITE_URL}/category/${category._id}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 })),
    ...products.map((product) => ({
      url: `${SITE_URL}/product/${product._id}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      images: (product.images || []).filter((src) => /^https?:.*\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(src)).slice(0, 5),
    })),
  ];
}
