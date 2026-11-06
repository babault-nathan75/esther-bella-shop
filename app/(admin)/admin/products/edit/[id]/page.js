export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import ProductForm from "@/components/ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }) {
  await connectToDB();
  const { id } = await params;

  let productDoc;
  try {
    productDoc = await Product.findById(id);
  } catch (e) {
    return notFound();
  }

  if (!productDoc) return notFound();

  // On convertit l'objet Mongoose en objet simple pour le composant Client
  const productInfo = JSON.parse(JSON.stringify(productDoc));

  return (
    <div>
      <Link href="/admin/products" className="-ml-2 inline-flex min-h-11 items-center gap-1 px-2 text-sm font-medium text-muted hover:text-ink">
        <ChevronLeft size={18} /> Tenues
      </Link>
      <h1 className="mb-6 mt-1 font-serif text-3xl font-bold">Modifier la tenue</h1>
      <ProductForm {...productInfo} />
    </div>
  );
}
