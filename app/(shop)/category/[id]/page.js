export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Category } from "@/lib/models/Category";
import ShopView from "@/components/ShopView";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

async function findCategory(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectToDB();
  return Category.findById(id).lean();
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const category = await findCategory(id);
  if (!category) return { title: "Rubrique introuvable", robots: { index: false } };
  return {
    title: `${category.name} femme`,
    description: category.description || `${category.name} : découvrez notre sélection chez Esther Bella Shop.`,
    alternates: { canonical: `/category/${id}` },
  };
}

export default async function CategoryPage({ params }) {
  const { id } = await params;
  const category = await findCategory(id);
  if (!category) return notFound();

  return <ShopView title={category.name} intro={category.description} categoryId={id} />;
}
