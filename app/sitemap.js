import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";

export default async function sitemap() {
  const baseUrl = "https://esther-bella-shop.vercel.app";

  // 1. On récupère tous les produits pour que Google les indexe un par un
  await connectToDB();
  const products = await Product.find({}, 'id updatedAt');
  
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product._id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 2. On ajoute les pages principales
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nouveautes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}