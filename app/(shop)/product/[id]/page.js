export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import ProductClient from "@/components/ProductClient";
import JsonLd from "@/components/JsonLd";
import { productJsonLd } from "@/lib/site";
import { formatPrice } from "@/lib/shop";
import Link from "next/link";
import mongoose from "mongoose";

async function findProduct(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectToDB();
  return Product.findById(id).lean();
}

// --- 1. GÉNÉRATION DYNAMIQUE DES MÉTADONNÉES SEO ---
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await findProduct(id);
  if (!product) return { title: "Pièce introuvable" };

  const description = product.description?.substring(0, 160) || `${product.title} à ${formatPrice(product.price)}, chez Esther Bella Shop à Abidjan. Commande en ligne et livraison à Abidjan.`;
  return {
    title: product.title,
    description,
    alternates: { canonical: `/product/${id}` },
    openGraph: {
      title: `${product.title} | Esther Bella Shop`,
      description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const productDoc = await findProduct(id);

  if (!productDoc) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-3xl font-bold">Cette pièce n&apos;est plus en ligne</h1>
        <p className="mt-2 text-muted">Découvrez les tenues disponibles en ce moment.</p>
        <Link href="/shop" className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-brand-dark">
          Voir le prêt à porter
        </Link>
      </div>
    );
  }

  const product = JSON.parse(JSON.stringify(productDoc));
  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <ProductClient product={product} />
    </>
  );
}
