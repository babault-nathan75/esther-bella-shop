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
    <div className="max-w-5xl mx-auto py-10 px-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-gray-400 hover:text-black transition-all">
        <ChevronLeft size={16} /> Retour à l'inventaire
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl font-black text-black uppercase tracking-tighter">
          Modifier la <span className="font-serif italic text-yellow-600 font-light lowercase">Création</span>
        </h1>
        <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-2">ID: {productInfo._id}</p>
      </header>

      <ProductForm {...productInfo} />
    </div>
  );
}