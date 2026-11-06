// Règles métier partagées entre le serveur et le navigateur

export const NEW_ARRIVAL_DAYS = 7;
export const ORDER_STATUSES = ["En attente", "Confirmée", "En préparation", "En livraison", "Livrée", "Annulée"];
export const PAYMENT_METHODS = ["Espèces à la livraison", "Orange Money", "Wave", "MTN Money", "Moov Money"];
export const CUSTOM_SIZE = "Sur mesure";

export const formatPrice = (value) =>
  `${(Number(value) || 0).toLocaleString("fr-FR").replace(/ /g, " ")} FCFA`;

export const isVideo = (url) => Boolean(url) && /\.(mp4|webm|ogg|mov)$/i.test(url);

// null : quantité non renseignée
export const stockLeft = (product) =>
  product?.kind !== "confection" && product?.available !== false && typeof product?.quantity === "number" ? product.quantity : null;

export const isConfection = (product) => product?.kind === "confection";
export const isOrderable = (product) => product?.available !== false;
// Disponible à la vente hors sur commande (prêt à porter comme en stock)
export const isInStock = (product) => !isConfection(product) && isOrderable(product);
// Figure sur la page « En stock »
export const isStockListed = (product) => product?.inStock === true && isInStock(product);

// Un retour en stock compte comme un nouvel arrivage
export const arrivalTime = (product) =>
  new Date(product?.arrivalAt || product?.createdAt || 0).getTime();

export const isNewArrival = (product) =>
  isInStock(product) && Date.now() - arrivalTime(product) < NEW_ARRIVAL_DAYS * 86400000;

// Les pièces commandables passent toujours avant les pièces épuisées
export const sortForDisplay = (products) =>
  [...products].sort(
    (a, b) => Number(isOrderable(b)) - Number(isOrderable(a)) || arrivalTime(b) - arrivalTime(a)
  );

export const newestInStock = (products) =>
  products.filter(isInStock).sort((a, b) => arrivalTime(b) - arrivalTime(a));

const normalize = (text) =>
  String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const SYNONYMS = [
  ["robe", "dress"],
  ["top", "haut", "chemise", "blouse", "body", "tshirt", "t-shirt"],
  ["pantalon", "jean", "jeans", "legging"],
  ["jupe", "skirt"],
  ["ensemble", "complet", "tenue"],
  ["chaussure", "chaussures", "talon", "talons", "sandale", "sandales", "basket", "baskets"],
  ["sac", "pochette"],
  ["pagne", "wax"],
  ["mesure", "commande", "confection", "couture"],
].map((group) => group.map(normalize));

// Tolère une faute de frappe : une par mot court, deux par mot long
function isClose(a, b) {
  const allowed = a.length >= 7 ? 2 : a.length >= 4 ? 1 : 0;
  if (!allowed || Math.abs(a.length - b.length) > allowed) return false;
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    row = next;
  }
  return row[b.length] <= allowed;
}

function wordScore(word, tokens) {
  if (tokens.includes(word)) return 4;
  if (tokens.some((t) => t.startsWith(word))) return 3;
  if (tokens.some((t) => t.includes(word))) return 2;
  if (SYNONYMS.some((group) => group.includes(word) && group.some((syn) => tokens.includes(syn)))) return 2;
  return tokens.some((t) => isClose(word, t)) ? 1 : 0;
}

const tokenize = (text) => normalize(text).split(/[^a-z0-9]+/).filter(Boolean);

// Recherche sans accents ni casse, tolérante aux fautes et aux synonymes. Le nom compte plus que le reste.
export function searchProducts(products, categories, query) {
  const words = tokenize(query);
  if (!words.length) return products;
  const names = new Map(categories.map((c) => [c._id, c.name]));
  return products
    .map((product) => {
      const title = tokenize(product.title);
      const other = tokenize(`${names.get(product.category) || ""} ${product.description} ${isConfection(product) ? "sur mesure commande" : ""}`);
      let score = 0;
      for (const word of words) {
        const inTitle = wordScore(word, title) * 3;
        const best = Math.max(inTitle, wordScore(word, other));
        if (!best) return null;
        score += best;
      }
      return { product, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);
}

export const orderNumber = (id) => `EB-${String(id).slice(-6).toUpperCase()}`;
