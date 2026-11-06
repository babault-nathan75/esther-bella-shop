import { Schema, model, models } from "mongoose";

const DeliveryZoneSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const DeliveryZone = models.DeliveryZone || model("DeliveryZone", DeliveryZoneSchema);
