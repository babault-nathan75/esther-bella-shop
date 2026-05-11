import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: { type: Object },
  sizes: [{ type: String }],
  available: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const Product = models.Product || model("Product", ProductSchema);
