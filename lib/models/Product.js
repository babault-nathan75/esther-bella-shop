import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ type: String }], // Tableau d'URLs
  category: { type: mongoose.Types.ObjectId, ref: "Category" }, // Lien vers la catégorie
  properties: { type: Object },
  stock: { type: Number, default: 10 },
}, {
  timestamps: true, // Ajoute createdAt et updatedAt
});

export const Product = models.Product || model("Product", ProductSchema);