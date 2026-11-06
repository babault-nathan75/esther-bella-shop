import { Schema, model, models } from "mongoose";

// Une page vue. Ni IP ni donnée personnelle : visitorId est un identifiant aléatoire du navigateur.
const PageViewSchema = new Schema({
  visitorId: { type: String, required: true },
  path: { type: String, required: true },
  productId: { type: String, default: null },
  source: { type: String, default: null }, // renseigné à l'arrivée sur le site uniquement
  device: { type: String, default: "Ordinateur" },
  createdAt: { type: Date, default: Date.now, index: true },
});

export const PageView = models.PageView || model("PageView", PageViewSchema);
