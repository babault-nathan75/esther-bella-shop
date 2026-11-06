import { Schema, model, models } from "mongoose";

// Échecs de connexion par adresse (hachée). MongoDB efface la ligne à expireAt.
const LoginAttemptSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expireAt: { type: Date, required: true, index: { expires: 0 } },
});

export const LoginAttempt = models.LoginAttempt || model("LoginAttempt", LoginAttemptSchema);
