"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Link as LinkIcon, FolderUp, Eye, FileVideo, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  
  // --- ÉTAT DU STOCK (Ajouté) ---
  const [stock, setStock] = useState(0);

  // --- GESTION DES TAILLES ---
  const [sizes, setSizes] = useState([]); 
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"]; 

  // États pour gérer le média
  const [media, setMedia] = useState(""); 
  const [mediaTypeInput, setMediaTypeInput] = useState("url"); 
  const [isUploading, setIsUploading] = useState(false); 

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  
  const router = useRouter(); 

  useEffect(() => {
    axios.get("/api/categories").then(res => {
      setCategories(res.data);
    });
  }, []);

  const isVideo = (filename) => {
    return filename && filename.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  const handleSizeToggle = (size) => {
    setSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleFileChange = async (ev) => {
    const files = ev.target.files;
    if (files?.length > 0) {
      setIsUploading(true); 
      const file = files[0];
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post('/api/upload', formData);
        setMedia(res.data.url); 
      } catch (err) {
        console.error("Erreur upload", err);
        alert("Erreur lors de l'envoi du fichier.");
      } finally {
        setIsUploading(false); 
      }
    }
  };

  async function createProduct(ev) {
    ev.preventDefault();
    const data = { 
      title, 
      description, 
      price: Number(price), 
      stock: Number(stock), // --- STOCK AJOUTÉ ICI ---
      images: [media], 
      category,
      sizes 
    };
    
    try {
      await axios.post("/api/products", data);
      router.push("/admin/products");
    } catch (error) {
      alert("Erreur lors de la création");
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-montserrat">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-yellow-600 transition-colors mb-6 font-medium">
        <ArrowLeft size={20} /> Retour à la liste
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Nouveau Produit</h1>
        <div className="h-1 w-20 bg-yellow-600 rounded-full"></div>
      </div>
      
      <form onSubmit={createProduct} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col gap-8">
        
        {/* Titre */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Nom de la pièce</label>
          <input 
            type="text" 
            placeholder="Ex: Robe de Soirée Gold"
            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all"
            value={title} onChange={ev => setTitle(ev.target.value)}
            required
          />
        </div>

        {/* Catégorie, Prix et Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Catégorie</label>
              <select 
                className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all"
                value={category} onChange={ev => setCategory(ev.target.value)}
                required
              >
                <option value="">Sélectionner</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Prix (FCFA)</label>
                <input 
                  type="number" 
                  placeholder="15000"
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all"
                  value={price} onChange={ev => setPrice(ev.target.value)}
                  required
                />
            </div>

            <div>
                <label className="block text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-3">Quantité Stock</label>
                <input 
                  type="number" 
                  value={stock} 
                  onChange={e => setStock(e.target.value)} 
                  required 
                  placeholder="10" 
                  className="w-full bg-yellow-600/5 border border-yellow-600/10 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-yellow-600/20" 
                />
            </div>
        </div>

        {/* TAILLES */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Tailles Disponibles</label>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`
                  w-12 h-12 rounded-full border-2 font-black text-xs flex items-center justify-center transition-all
                  ${sizes.includes(size) 
                    ? 'bg-black border-black text-yellow-600 shadow-lg scale-110' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-yellow-600 hover:text-yellow-600'}
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* MÉDIA */}
        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
           <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-6">Visuel (Image ou Vidéo)</label>
           
           <div className="flex gap-4 mb-6">
             <button 
               type="button" 
               onClick={() => setMediaTypeInput("url")}
               className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mediaTypeInput === 'url' ? 'bg-black text-yellow-600 shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
             >
               <LinkIcon size={16} /> Lien Web
             </button>
             <button 
               type="button" 
               onClick={() => setMediaTypeInput("local")}
               className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mediaTypeInput === 'local' ? 'bg-black text-yellow-600 shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
             >
               <FolderUp size={16} /> Import
             </button>
           </div>

           {mediaTypeInput === "url" ? (
              <input 
                type="text" 
                placeholder="https://..."
                className="w-full bg-white border border-gray-100 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-yellow-600/20"
                value={media} 
                onChange={ev => setMedia(ev.target.value)}
              />
           ) : (
             <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-dashed border-gray-200 rounded-[2rem] hover:border-yellow-600 transition-all relative">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Importer un fichier</span>
                  </div>
                )}
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
             </label>
           )}

           {media && !isUploading && (
             <div className="mt-8">
                <div className="flex items-center gap-2 mb-4 text-[10px] text-yellow-600 font-black uppercase tracking-widest">
                  <Eye size={14} /> Aperçu
                </div>
                <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-inner flex justify-center overflow-hidden max-h-64">
                  {isVideo(media) ? (
                    <video src={media} controls className="max-h-60 rounded-xl" />
                  ) : (
                    <img src={media} alt="Aperçu" className="max-h-60 object-contain rounded-xl" />
                  )}
                </div>
             </div>
           )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">L'Éditorial (Description)</label>
          <textarea 
            placeholder="Détails du produit..."
            className="w-full bg-gray-50 border-none rounded-[2rem] p-6 text-sm font-medium h-32 focus:ring-2 focus:ring-yellow-600/20 transition-all outline-none resize-none"
            value={description} onChange={ev => setDescription(ev.target.value)}
          />
        </div>

        <button 
          type="submit" 
          disabled={isUploading}
          className="bg-black text-yellow-600 font-black py-5 rounded-2xl hover:bg-yellow-600 hover:text-black shadow-2xl transition-all flex justify-center items-center gap-4 text-xs tracking-[0.3em] uppercase disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
          {isUploading ? "Veuillez patienter..." : "Publier la pièce"}
        </button>

      </form>
    </div>
  );
}