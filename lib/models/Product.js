import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: { type: Object },
  sizes: [{ type: String }],
  available: { type: Boolean, default: true },
  quantity: { type: Number, default: null, min: 0 },
  // Coché par l'admin : la tenue figure sur la page « En stock », pas dans le prêt à porter
  inStock: { type: Boolean, default: false },
  // Un seul à la fois, mis en avant sur l'accueil
  featured: { type: Boolean, default: false },
  // Place choisie par l'admin dans la vitrine de l'accueil
  heroSlot: { type: String, enum: ["left", "center", "right", null], default: null },
  // Affiche à griffures, renseignée par l'admin
  poster: {
    enabled: { type: Boolean, default: false },
    collection: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    colorName: { type: String, default: "" },
    clawColor: { type: String, default: "#7ec8e3" },
    backgroundColor: { type: String, default: "#ffffff" },
  },
  kind: { type: String, enum: ["stock", "confection"], default: "stock" },
  leadTime: { type: String, default: "" },
  // Date du dernier arrivage : posée à la création et à chaque retour en stock
  arrivalAt: { type: Date },
}, {
  timestamps: true,
});

export const Product = models.Product || model("Product", ProductSchema);
