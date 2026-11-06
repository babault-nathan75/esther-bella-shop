import { createHash } from "crypto";
import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { DeliveryZone } from "@/lib/models/DeliveryZone";
import { sortForDisplay } from "@/lib/shop";

const ABIDJAN_COMMUNES = [
  "Abobo", "Adjamé", "Attécoubé", "Cocody", "Koumassi",
  "Marcory", "Plateau", "Port-Bouët", "Treichville", "Yopougon",
];
const DEFAULT_DELIVERY_PRICE = 1500;

// Crée les 10 communes au premier lancement. L'admin les gère ensuite.
export async function ensureDeliveryZones() {
  if (await DeliveryZone.exists({})) return;
  await DeliveryZone.insertMany(
    ABIDJAN_COMMUNES.map((name) => ({ name, price: DEFAULT_DELIVERY_PRICE })),
    { ordered: false }
  ).catch((error) => {
    // Deux premières visites simultanées : le doublon est sans conséquence
    if (error.code !== 11000) throw error;
  });
}

export async function getCatalog() {
  await connectToDB();
  await ensureDeliveryZones();

  const [products, categories, zones] = await Promise.all([
    Product.find().select("-properties -__v").lean(),
    Category.find().sort({ order: 1, _id: 1 }).select("-__v").lean(),
    DeliveryZone.find({ active: true }).sort({ name: 1 }).select("name price").lean(),
  ]);

  const data = JSON.parse(JSON.stringify({ products: sortForDisplay(products), categories, zones }));
  const version = createHash("sha1").update(JSON.stringify(data)).digest("hex").slice(0, 16);
  return { version, ...data };
}
