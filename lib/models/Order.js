import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  cartProducts: { type: Object, required: true }, // Synchronisé avec l'API
  total: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  status: { type: String, default: 'En attente' },
}, { timestamps: true });

export const Order = models.Order || model("Order", OrderSchema);