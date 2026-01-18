"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Video, Image as ImageIcon, ExternalLink, AlertTriangle } from "lucide-react";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    axios.get("/api/products").then(response => {
      setProducts(response.data);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- LOGIQUE DE SUPPRESSION RÉELLE ---
  const deleteProduct = async (id) => {
    if (window.confirm("Voulez-vous vraiment retirer cette pièce de la collection ?")) {
      try {
        await axios.delete(`/api/products?id=${id}`);
        fetchProducts(); // Rafraîchir la liste après suppression
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const isVideo = (filename) => filename && filename.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 font-montserrat">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
           <h1 className="text-4xl font-black text-black uppercase tracking-tighter">Inventaire <span className="font-serif italic text-yellow-600 font-light lowercase">Royal</span></h1>
           <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mt-2 font-bold">Gestion des stocks Esther Bella</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link 
            href="/" 
            target="_blank"
            className="flex-1 md:flex-none border border-gray-200 text-gray-400 px-6 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <ExternalLink size={16} /> Boutique
          </Link>

          <Link 
            href="/admin/products/new" 
            className="flex-1 md:flex-none bg-black text-yellow-600 px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-600 hover:text-black shadow-xl transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={18} /> Ajouter une pièce
          </Link>
        </div>
      </div>

      {/* Tableau Design Luxe */}
      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-black tracking-[0.2em] border-b border-gray-100">
            <tr>
              <th className="p-6">Visuel</th>
              <th className="p-6">Désignation</th>
              <th className="p-6">Tailles</th>
              <th className="p-6">Stock</th>
              <th className="p-6">Prix</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length === 0 && (
               <tr>
                 <td colSpan="6" className="p-20 text-center text-gray-300 font-serif italic text-xl">
                   Votre showroom est vide pour le moment...
                 </td>
               </tr>
            )}
            
            {products.map(product => (
              <tr key={product._id} className="group hover:bg-gray-50/30 transition-colors">
                
                {/* VISUEL */}
                <td className="p-6">
                  <div className="w-16 h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm relative">
                    {product.images?.[0] ? (
                        isVideo(product.images[0]) ? (
                            <div className="relative w-full h-full bg-black">
                                <video src={product.images[0]} className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Video size={16} className="text-white" />
                                </div>
                            </div>
                        ) : (
                            <Image src={product.images[0]} alt={product.title} className="w-full h-full object-cover" width={100} height={120} />
                        )
                    ) : (
                        <ImageIcon size={20} className="text-gray-200" />
                    )}
                  </div>
                </td>

                {/* NOM & DESCRIPTION */}
                <td className="p-6">
                    <div className="font-black text-black uppercase text-sm tracking-tight">{product.title}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 line-clamp-1 max-w-[200px]">{product.description || "Aucune description"}</div>
                </td>

                {/* TAILLES */}
                <td className="p-6">
                   <div className="flex gap-1 flex-wrap max-w-[120px]">
                     {product.sizes && product.sizes.length > 0 ? (
                        product.sizes.map(s => (
                            <span key={s} className="text-[9px] bg-black text-yellow-600 px-2 py-1 rounded-md font-black">
                                {s}
                            </span>
                        ))
                     ) : (
                        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest italic">U</span>
                     )}
                   </div>
                </td>

                {/* --- NOUVELLE COLONNE STOCK --- */}
                <td className="p-6">
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                            ${product.stock <= 0 
                                ? 'bg-red-50 text-red-500 border border-red-100' 
                                : product.stock <= 3 
                                ? 'bg-orange-50 text-orange-500 border border-orange-100' 
                                : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {product.stock <= 0 ? 'Épuisé' : `${product.stock} pcs`}
                        </span>
                        {product.stock <= 3 && product.stock > 0 && <AlertTriangle size={12} className="text-orange-500 animate-pulse" />}
                    </div>
                </td>

                {/* PRIX */}
                <td className="p-6">
                    <div className="text-black font-black text-sm">
                        {product.price?.toLocaleString()} <span className="text-[9px] text-gray-400">FCFA</span>
                    </div>
                </td>

                {/* ACTIONS */}
                <td className="p-6">
                  <div className="flex justify-end gap-2">
                    <Link href={'/admin/products/edit/'+product._id} className="text-gray-300 hover:text-black transition-all p-3 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl shadow-none hover:shadow-sm">
                      <Pencil size={18} />
                    </Link>
                    <button 
                        onClick={() => deleteProduct(product._id)}
                        className="text-gray-300 hover:text-red-500 transition-all p-3 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl shadow-none hover:shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}