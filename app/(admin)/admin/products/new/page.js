import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="-ml-2 inline-flex min-h-11 items-center gap-1 px-2 text-sm font-medium text-muted hover:text-ink">
        <ChevronLeft size={18} /> Tenues
      </Link>
      <h1 className="mb-6 mt-1 font-serif text-3xl font-bold">Nouvelle tenue</h1>
      <ProductForm />
    </div>
  );
}
