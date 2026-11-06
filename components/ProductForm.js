"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Package, Scissors, Shirt } from "lucide-react";
import MediaUploader from "@/components/MediaUploader";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Toutes tailles"];
const KINDS = [
  { value: "ready", label: "Prêt à porter", hint: "Collection", Icon: Shirt },
  { value: "stock", label: "En stock", hint: "Page En stock", Icon: Package },
  { value: "confection", label: "Sur commande", hint: "Après la commande", Icon: Scissors },
];

export default function ProductForm({
  _id,
  title: initialTitle,
  description: initialDescription,
  price: initialPrice,
  available: initialAvailable,
  images: initialImages,
  sizes: initialSizes,
  category: initialCategory,
  quantity: initialQuantity,
  kind: initialKind,
  poster: initialPoster,
  inStock: initialInStock,
  leadTime: initialLeadTime,
  defaultKind = "ready",
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [price, setPrice] = useState(initialPrice ?? "");
  const [available, setAvailable] = useState(initialAvailable !== false);
  const [images, setImages] = useState(initialImages || []);
  const [sizes, setSizes] = useState(initialSizes || []);
  const [category, setCategory] = useState(initialCategory || "");
  const [quantity, setQuantity] = useState(initialQuantity ?? "");
  const [kind, setKind] = useState(initialKind === "confection" ? "confection" : initialInStock ? "stock" : _id ? "ready" : defaultKind);
  const [poster, setPoster] = useState({
    enabled: false, collection: "", title: "", text: "", colorName: "", motif: "griffure", clawColor: "#7ec8e3", backgroundColor: "#ffffff",
    ...initialPoster,
  });
  const updatePoster = (field) => (e) => setPoster((prev) => ({ ...prev, [field]: e.target.value }));
  const [leadTime, setLeadTime] = useState(initialLeadTime || "");
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  const toggleSize = (size) =>
    setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);

  async function saveProduct(e) {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    const data = { title, description, price: Number(price), available, images, sizes, category, poster, kind: kind === "confection" ? "confection" : "stock", inStock: kind === "stock", leadTime, quantity: kind !== "confection" && quantity !== "" ? Number(quantity) : null };

    try {
      if (_id) {
        await axios.put("/api/products", { ...data, _id });
      } else {
        await axios.post("/api/products", data);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err.response?.data?.error || "L'enregistrement a échoué.");
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={saveProduct} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-line bg-white shadow-sm p-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Type de tenue</legend>
          <div className="grid grid-cols-3 gap-2">
            {KINDS.map(({ value, label, hint, Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={kind === value}
                onClick={() => setKind(value)}
                className={`rounded-lg border p-3 text-left transition-colors ${kind === value ? "border-brand bg-red-50" : "border-line hover:border-ink"}`}
              >
                <Icon size={18} className={kind === value ? "text-brand" : "text-muted"} />
                <span className="mt-1 block text-sm font-semibold">{label}</span>
                <span className="block text-xs text-muted">{hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-semibold">Nom de la tenue</label>
          <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="field" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-semibold">Prix (FCFA)</label>
            <input id="price" type="number" min="0" inputMode="numeric" required value={price} onChange={(e) => setPrice(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-semibold">Rubrique</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="field">
              <option value="">Sans rubrique</option>
              {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
          </div>
        </div>

        {kind !== "confection" && (
          <div>
            <label htmlFor="quantity" className="mb-1 block text-sm font-semibold">Quantité disponible</label>
            <input id="quantity" type="number" min="0" step="1" inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="field" />
            <p className="mt-1 text-xs text-muted">Diminue à chaque commande. À 0, la tenue passe en « Épuisé ».</p>
          </div>
        )}

        {kind === "confection" && (
          <div>
            <label htmlFor="leadTime" className="mb-1 block text-sm font-semibold">Délai de confection</label>
            <input id="leadTime" placeholder="Ex. 7 à 10 jours" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} className="field" />
          </div>
        )}

        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold">
          <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="h-5 w-5 accent-[var(--color-brand)]" />
          {kind === "confection" ? "Commandable" : "Disponible"}
          {!available && <span className="font-normal text-muted">(affichée comme épuisée)</span>}
        </label>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-semibold">
            Description <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="field resize-none" />
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-white shadow-sm p-5">
          <p className="mb-3 text-sm font-semibold">Visuels</p>
          <MediaUploader value={images} onChange={setImages} onBusyChange={setIsUploading} />
        </div>

        <fieldset className="rounded-2xl border border-line bg-white shadow-sm p-5">
          <legend className="sr-only">Tailles proposées</legend>
          <p className="mb-3 text-sm font-semibold">Tailles proposées</p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={sizes.includes(size)}
                onClick={() => toggleSize(size)}
                className={`h-11 rounded-lg border px-4 text-sm font-semibold ${sizes.includes(size) ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}
              >
                {size}
              </button>
            ))}
          </div>
          {kind === "confection" && <p className="mt-3 text-sm text-muted">L&apos;option « Sur mesure » est ajoutée automatiquement.</p>}
        </fieldset>

        <fieldset className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <legend className="sr-only">Affiche de collection</legend>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 font-semibold">
            <input type="checkbox" checked={poster.enabled} onChange={(e) => setPoster((prev) => ({ ...prev, enabled: e.target.checked }))} className="h-5 w-5 accent-[var(--color-brand)]" />
            Affiche de collection
          </label>
          <p className="text-sm text-muted">Visible sur la page de la tenue et dans Nouveautés, pendant ses 7 jours.</p>
          {poster.enabled && (
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="poster-collection" className="mb-1 block text-sm font-medium">Collection</label>
                  <input id="poster-collection" placeholder="Panthère, Fleurie…" value={poster.collection} onChange={updatePoster("collection")} className="field" />
                </div>
                <div>
                  <label htmlFor="poster-color-name" className="mb-1 block text-sm font-medium">Nom de la couleur</label>
                  <input id="poster-color-name" placeholder="Bleu ciel" value={poster.colorName} onChange={updatePoster("colorName")} className="field" />
                </div>
              </div>
              <div>
                <label htmlFor="poster-motif" className="mb-1 block text-sm font-medium">Motif de fond</label>
                <select id="poster-motif" value={poster.motif} onChange={updatePoster("motif")} className="field">
                  <option value="griffure">Griffures</option>
                  <option value="fleur">Fleurs</option>
                </select>
              </div>
              <div>
                <label htmlFor="poster-title" className="mb-1 block text-sm font-medium">Titre de l&apos;affiche</label>
                <input id="poster-title" value={poster.title} onChange={updatePoster("title")} className="field" />
              </div>
              <div>
                <label htmlFor="poster-text" className="mb-1 block text-sm font-medium">Texte <span className="font-normal text-muted">(facultatif)</span></label>
                <textarea id="poster-text" rows={2} value={poster.text} onChange={updatePoster("text")} className="field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium">Couleur du motif
                  <input type="color" value={poster.clawColor} onChange={updatePoster("clawColor")} className="mt-1 block h-12 w-full cursor-pointer rounded-lg border border-line p-1" />
                </label>
                <label className="text-sm font-medium">Couleur du fond
                  <input type="color" value={poster.backgroundColor} onChange={updatePoster("backgroundColor")} className="mt-1 block h-12 w-full cursor-pointer rounded-lg border border-line p-1" />
                </label>
              </div>
            </div>
          )}
        </fieldset>

        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-brand-dark">{error}</p>}

        <button disabled={isSaving || isUploading} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {isSaving && <Loader2 size={18} className="animate-spin" />}
          {isUploading ? "Envoi des visuels…" : _id ? "Enregistrer" : "Publier la tenue"}
        </button>
      </div>
    </form>
  );
}
