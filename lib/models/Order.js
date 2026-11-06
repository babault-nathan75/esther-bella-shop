import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  cartProducts: { type: Object, required: true }, // Synchronisé avec l'API
  subtotal: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  shippingPending: { type: Boolean, default: false },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: "Espèces à la livraison" },
  stockReserved: { type: Array, default: [] },
  paid: { type: Boolean, default: false },
  status: { type: String, default: 'En attente' },
}, { timestamps: true });

export const Order = models.Order || model("Order", OrderSchema);
