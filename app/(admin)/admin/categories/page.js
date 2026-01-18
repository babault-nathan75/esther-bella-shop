"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, LayoutGrid, Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    if (!name) return;
    setIsSaving(true);
    
    try {
      await axios.post("/api/categories", { name });
      setName("");
      fetchCategories();
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  }

  // --- LOGIQUE DE SUPPRESSION AJOUTÉE ---
  async function deleteCategory(category) {
    const { _id, name } = category;
    if (window.confirm(`Voulez-vous vraiment supprimer la catégorie "${name}" ?`)) {
      try {
        // On envoie l'ID à supprimer en paramètre
        await axios.delete(`/api/categories?_id=${_id}`);
        fetchCategories(); // Rafraîchir la liste
      } catch (error) {
        alert("Impossible de supprimer cette catégorie.");
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 font-montserrat">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-black uppercase tracking-tighter">
          Gestion des <span className="font-serif italic text-yellow-600 font-light lowercase">Univers</span>
        </h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2 font-bold">Showroom Esther Bella • Abidjan</p>
      </header>
      
      {/* Formulaire Style Luxe */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm mb-12">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 block text-gray-400">
          Nouvelle Catégorie
        </label>
        <form onSubmit={saveCategory} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Ex: Robes de Gala, Accessoires..." 
            className="flex-1 bg-gray-50 border-none rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all"
            value={name}
            onChange={ev => setName(ev.target.value)}
          />
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-black text-yellow-600 px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-yellow-600 hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            {isSaving ? "En cours..." : "Ajouter"}
          </button>
        </form>
      </div>

      {/* Liste des Univers */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 p-6 border-b border-gray-100">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-black">
             <LayoutGrid size={14} className="text-yellow-600" /> Vos Catégories Actuelles
           </h2>
        </div>

        <div className="divide-y divide-gray-50">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category._id} className="p-6 flex justify-between items-center hover:bg-gray-50/50 transition-colors group">
                 <span className="font-black text-black uppercase text-xs tracking-tight">{category.name}</span>
                 
                 {/* BOUTON SUPPRIMER CONNECTÉ */}
                 <button 
                    onClick={() => deleteCategory(category)}
                    className="text-gray-300 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-xl"
                    title="Supprimer la catégorie"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <p className="font-serif italic text-gray-300 text-lg">Aucune catégorie enregistrée pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}