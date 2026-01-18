"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, MessageCircle, CheckCircle, Clock, MapPin, Hash, Loader2, ImageOff } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Erreur chargement commandes");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put("/api/admin/orders", { id, status: newStatus });
      fetchOrders();
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.name?.toLowerCase().includes(search.toLowerCase()) || 
    o.city?.toLowerCase().includes(search.toLowerCase()) ||
    o._id?.toLowerCase().includes(search.toLowerCase())
  );

  // --- CORRECTION WHATSAPP : 225 + 8 DERNIERS CHIFFRES ---
  const formatWhatsApp = (phone) => {
    if (!phone) return "#";
    const digits = phone.replace(/\D/g, ''); // On garde uniquement les chiffres
    // On prend les 8 derniers chiffres (pour ignorer le nouveau préfixe 01, 05, 07, etc.)
    const last8 = digits.slice(-8); 
    return `https://wa.me/225${last8}`;
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-yellow-600" size={40} />
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em] font-black">Consultation des archives...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header & Recherche */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter">
            Gestion des <span className="font-serif italic text-yellow-600 font-light lowercase">Commandes</span>
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mt-2 font-bold">Showroom Esther Bella • Abidjan</p>
        </div>
        
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-yellow-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="NOM, VILLE OU N° ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black tracking-widest outline-none focus:ring-4 focus:ring-yellow-600/5 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
            
            <div className="absolute top-8 right-8 flex items-center gap-1 text-[9px] text-gray-200 font-black uppercase tracking-widest">
              <Hash size={10} /> {order._id.slice(-8)}
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-10">
              
              {/* --- BLOC CLIENT --- */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-black text-yellow-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transform -rotate-3">
                    {order.name?.charAt(0) || "Q"}
                  </div>
                  <div>
                    <h3 className="font-black text-black uppercase tracking-tight text-xl leading-none mb-2">{order.name || "Client Anonyme"}</h3>
                    <span className="bg-yellow-600/10 text-yellow-700 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
                      Contact: {order.phone}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-2xl space-y-2 border border-gray-50">
                  <div className="flex items-center gap-2 text-black font-black text-[10px] uppercase tracking-widest">
                    <MapPin size={14} className="text-yellow-600" /> {order.city}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed pl-6 italic">
                    {order.address || "Aucune précision d'adresse"}
                  </p>
                </div>
              </div>

              {/* --- BLOC PANIER (CORRIGÉ POUR IMAGES) --- */}
              <div className="flex-[1.5] bg-zinc-50/50 rounded-3xl p-6 border border-zinc-100/50">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] mb-6">Articles commandés</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {order.cartProducts?.map((item, idx) => {
                    // On vérifie plusieurs sources possibles pour l'image
                    const itemImage = item.images?.[0] || item.image || item.thumbnail;
                    
                    return (
                      <div key={idx} className="flex items-center gap-4 group/item">
                        <div className="w-12 h-16 bg-gray-200 rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
                          {itemImage ? (
                            <img src={itemImage} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <ImageOff size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-tighter leading-tight text-zinc-500">
                          {item.title || "Article sans nom"} <br/>
                          <span className="text-yellow-600 font-serif italic lowercase tracking-normal">taille: {item.selectedSize || "U"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- BLOC FINANCE (CORRIGÉ POUR PRIX) --- */}
              <div className="flex-1 flex flex-col justify-between items-end gap-8">
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] mb-2">Total à percevoir</p>
                  <p className="text-3xl font-black text-black tracking-tighter">
                    {/* Fallback à 0 si le total est manquant */}
                    {(Number(order.total) || 0).toLocaleString()} <span className="text-xs">FCFA</span>
                  </p>
                </div>

                <div className="flex gap-4">
                  <a 
                    href={formatWhatsApp(order.phone)} 
                    target="_blank"
                    className="h-14 w-14 bg-green-500 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-90"
                    title="Ouvrir WhatsApp Business"
                  >
                    <MessageCircle size={24} />
                  </a>

                  <button 
                    onClick={() => updateStatus(order._id, order.status === 'Livrée' ? 'En attente' : 'Livrée')}
                    className={`h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg
                      ${order.status === 'Livrée' 
                        ? 'bg-black text-yellow-600' 
                        : 'bg-yellow-600 text-black hover:bg-black hover:text-white'}`}
                  >
                    {order.status === 'Livrée' ? <CheckCircle size={18} /> : <Clock size={18} />}
                    {order.status || 'En attente'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}