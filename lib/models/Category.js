import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

export const Category = models.Category || model("Category", CategorySchema);
