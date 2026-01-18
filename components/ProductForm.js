"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Save, X, Upload } from "lucide-react";

export default function ProductForm({
  _id,
  title: initialTitle,
  description: initialDescription,
  price: initialPrice,
  stock: initialStock,
  images: initialImages,
  sizes: initialSizes,
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [price, setPrice] = useState(initialPrice || "");
  const [stock, setStock] = useState(initialStock || 0);
  const [images, setImages] = useState(initialImages || []);
  const [sizes, setSizes] = useState(initialSizes || []);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  async function saveProduct(e) {
    e.preventDefault();
    setIsSaving(true);
    const data = { title, description, price, stock, images, sizes };

    if (_id) {
      // Modification
      await axios.put("/api/products", { ...data, _id });
    } else {
      // Création
      await axios.post("/api/products", data);
    }
    
    setIsSaving(false);
    router.push("/admin/products");
  }

  return (
    <form onSubmit={saveProduct} className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Infos Principales */}
        <div className="space-y-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Désignation de la pièce</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-yellow-600/20" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Prix (FCFA)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-yellow-600/20" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Stock disponible</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} required className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-yellow-600/20" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Description Éditoriale</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-medium h-32 resize-none outline-none focus:ring-2 focus:ring-yellow-600/20" />
          </div>
        </div>

        {/* Médias et Tailles */}
        <div className="space-y-6">
          <div className="bg-black text-white p-8 rounded-[2rem] shadow-xl">
            <label className="text-[10px] font-black uppercase tracking-widest text-yellow-600 mb-4 block">Galerie d'images (URLs)</label>
            <div className="flex flex-wrap gap-3 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden border border-white/10">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-red-500 p-1 rounded-bl-lg">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
            <input 
              type="text" 
              placeholder="Ajouter une URL d'image..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] outline-none focus:border-yellow-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (e.target.value) {
                    setImages([...images, e.target.value]);
                    e.target.value = "";
                  }
                }
              }}
            />
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Tailles proposées</label>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL", "Unique"].map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => sizes.includes(s) ? setSizes(sizes.filter(x => x !== s)) : setSizes([...sizes, s])}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${sizes.includes(s) ? 'bg-black text-yellow-600' : 'bg-gray-50 text-gray-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          disabled={isSaving}
          className="bg-black text-yellow-600 px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-yellow-600 hover:text-black transition-all shadow-2xl disabled:opacity-50 flex items-center gap-3"
        >
          <Save size={18} /> {isSaving ? "Enregistrement..." : "Mettre à jour la pièce"}
        </button>
      </div>
    </form>
  );
}