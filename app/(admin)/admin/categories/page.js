"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowDown, ArrowUp, Loader2, Pencil, Trash2 } from "lucide-react";
import Media from "@/components/Media";
import MediaUploader from "@/components/MediaUploader";

const EMPTY = { _id: null, name: "", description: "", image: "" };

export default function CategoriesPage() {
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    return axios.get("/api/categories").then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      if (form._id) await axios.put("/api/categories", form);
      else await axios.post("/api/categories", form);
      setForm(EMPTY);
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteCategory({ _id, name }) {
    if (window.confirm(`Supprimer la rubrique « ${name} » ? Ses tenues resteront en boutique, sans rubrique.`)) {
      try {
        await axios.delete(`/api/categories?_id=${_id}`);
        if (form._id === _id) setForm(EMPTY);
        fetchCategories();
      } catch (err) {
        setError("Impossible de supprimer cette rubrique.");
      }
    }
  }

  async function move(index, direction) {
    const reordered = [...categories];
    const target = index + direction;
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setCategories(reordered);
    try {
      await Promise.all(reordered.map((cat, order) => axios.put("/api/categories", { _id: cat._id, order })));
    } catch (err) {
      setError("Impossible d'enregistrer le nouvel ordre.");
      fetchCategories();
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-bold">Rubriques</h1>
      <p className="mb-6 mt-1 text-muted">Elles organisent la boutique et apparaissent sur la page d&apos;accueil.</p>

      <form onSubmit={saveCategory} className="mb-6 space-y-4 rounded-2xl border border-line bg-white shadow-sm p-5">
        <h2 className="font-semibold">{form._id ? "Modifier la rubrique" : "Nouvelle rubrique"}</h2>
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">Nom</label>
          <input id="name" required placeholder="Ex. Robes de soirée" value={form.name} onChange={ev => setForm({ ...form, name: ev.target.value })} className="field" />
        </div>
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">Description <span className="font-normal text-muted">(facultatif)</span></label>
          <input id="description" value={form.description} onChange={ev => setForm({ ...form, description: ev.target.value })} className="field" />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">Image de couverture <span className="font-normal text-muted">(sinon, celle d&apos;une tenue de la rubrique)</span></p>
          <MediaUploader multiple={false} value={form.image ? [form.image] : []} onChange={(urls) => setForm({ ...form, image: urls[0] || "" })} />
        </div>
        {error && <p role="alert" className="text-sm text-brand">{error}</p>}
        <div className="flex gap-2">
          <button disabled={isSaving} className="flex h-11 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {form._id ? "Enregistrer" : "Créer la rubrique"}
          </button>
          {form._id && (
            <button type="button" onClick={() => setForm(EMPTY)} className="h-11 rounded-lg border border-line px-5 text-sm font-semibold">Annuler</button>
          )}
        </div>
      </form>

      {categories.length === 0 ? (
        <p className="rounded-xl bg-white p-10 text-center text-muted">Aucune rubrique pour le moment.</p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-white shadow-sm">
          {categories.map((category, index) => (
            <li key={category._id} className="flex items-center gap-3 p-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-paper">
                <Media src={category.image} alt="" className="h-full w-full object-cover text-xs" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{category.name}</p>
                {category.description && <p className="truncate text-sm text-muted">{category.description}</p>}
              </div>
              <button disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Monter ${category.name}`} className="hidden h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-paper disabled:opacity-30 sm:flex"><ArrowUp size={18} /></button>
              <button disabled={index === categories.length - 1} onClick={() => move(index, 1)} aria-label={`Descendre ${category.name}`} className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-paper disabled:opacity-30"><ArrowDown size={18} /></button>
              <button onClick={() => { setForm({ ...EMPTY, ...category }); window.scrollTo({ top: 0 }); }} aria-label={`Modifier ${category.name}`} className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-paper hover:text-ink"><Pencil size={18} /></button>
              <button onClick={() => deleteCategory(category)} aria-label={`Supprimer ${category.name}`} className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-paper hover:text-brand"><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
