"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { ChevronLeft, Send, MapPin, User, Loader2, CheckCircle2, Wallet, AlertCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function CheckoutPage() {
  const { cartProducts, clearCart } = useContext(CartContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Abobo");
  const [customCity, setCustomCity] = useState(""); 
  const [address, setAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errorStock, setErrorStock] = useState(""); // --- NOUVEL ÉTAT POUR L'ERREUR ---

  const WHATSAPP_NUMBER = "22587335847"; 

  const subtotal = cartProducts.reduce((acc, item) => acc + (item.price || 0), 0);
  const shippingCost = city === "Autre" ? 2000 : 1500; 
  const total = subtotal + shippingCost;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorStock(""); // Réinitialise l'erreur au clic

    const finalCity = city === "Autre" ? customCity : city;

    if (!name || !phone || !address || (city === "Autre" && !customCity)) {
      alert("Veuillez remplir toutes vos coordonnées, Queen 👸");
      return;
    }

    setIsProcessing(true);

    try {
      // --- MODIFICATION CRUCIALE POUR ÉVITER L'ERREUR 500 ---
      // Nettoyage strict des produits : on s'assure que _id est présent et que price est un nombre
      const cleanedProducts = cartProducts.map(p => ({
        _id: p._id, 
        title: p.title,
        price: Number(p.price),
        images: p.images || [],
        selectedSize: p.selectedSize || "Unique"
      }));

      // 1. Enregistrement de la commande avec forçage du type Number pour le total
      const response = await axios.post('/api/checkout', {
        name, 
        phone, 
        city: finalCity, 
        address, 
        cartProducts: cleanedProducts,
        total: Number(total), // S'assure que c'est un nombre pour MongoDB
        shippingCost: Number(shippingCost)
      });

      const newOrderId = response.data.id || response.data._id;
      setOrderId(newOrderId);

      // 2. Préparation du message WhatsApp (Seulement si l'API a validé)
      const message = `Bonjour Esther Bella Fashion ✨\n\n` +
        `Nouvelle commande de *${name}*\n` +
        `Commande N°: #${newOrderId.substring(0, 8)}\n\n` +
        `*DÉTAILS :*\n` +
        cartProducts.map(p => `- ${p.title} (${p.selectedSize || 'Unique'})`).join('\n') +
        `\n\n*TOTAL : ${total.toLocaleString()} FCFA*\n` +
        `*(Produits: ${subtotal.toLocaleString()} | Livraison: ${shippingCost.toLocaleString()} FCFA)*\n\n` +
        `*LIVRAISON :* ${finalCity}, ${address}\n` +
        `*CONTACT :* ${phone}\n\n` +
        `Merci de confirmer la commande. 👸👑`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank");
      clearCart();

    } catch (error) {
      // --- GESTION AMÉLIORÉE DES ERREURS (400 ET 500) ---
      const errorMsg = error.response?.data?.error || "Une erreur serveur est survenue lors de la validation.";
      setErrorStock(errorMsg);
      
      // On remonte la page pour que la cliente voie le bandeau d'erreur
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.error("Détails de l'erreur:", error.response?.data || error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center animate-in fade-in duration-700 font-montserrat">
        <div className="max-w-md w-full border border-yellow-600/20 p-10 rounded-[3rem] shadow-2xl bg-black text-white">
          <CheckCircle2 className="mx-auto text-yellow-600 mb-6 animate-bounce" size={60} />
          <h2 className="text-3xl font-serif italic mb-4">Commande Reçue</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-10 leading-loose">
            Votre commande <span className="text-white font-bold">#{orderId.substring(0, 8)}</span> a été transmise.
            <br />
            Conservez ce numéro pour le suivi.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                <p className="text-[10px] text-yellow-600 uppercase font-black mb-2">Prochaine étape</p>
                <p className="text-[11px] leading-relaxed text-zinc-300">Vérifiez votre WhatsApp. Notre équipe valide le paiement avec vous.</p>
            </div>
            <Link href="/" className="block w-full text-white/40 pt-6 text-[10px] uppercase tracking-widest hover:text-white transition">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-montserrat">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        
        <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-10 hover:text-yellow-600 transition">
          <ChevronLeft size={16} /> Retour au panier
        </Link>

        {/* --- BANDEAU D'ERREUR DYNAMIQUE --- */}
        {errorStock && (
          <div className="max-w-2xl mx-auto mb-10 bg-red-50 border border-red-100 p-5 rounded-2xl flex items-center gap-4 text-red-600 animate-in slide-in-from-top-4 duration-500">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Alerte : {errorStock}
              </p>
              <p className="text-[9px] uppercase mt-1 opacity-70">Veuillez vérifier vos articles ou vos informations.</p>
            </div>
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter mb-12">
          Finaliser <span className="font-serif italic text-yellow-600 lowercase font-light">l&apos;achat</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2 text-black text-left">
                <User size={16} className="text-yellow-600" /> Vos Coordonnées
              </h2>
              <div className="space-y-6">
                <input 
                  type="text" required placeholder="NOM COMPLET" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-bold tracking-widest outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all"
                />
                <input 
                  type="tel" required placeholder="NUMÉRO DE TÉLÉPHONE" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-bold tracking-widest outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all"
                />
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2 text-black text-left">
                <MapPin size={16} className="text-yellow-600" /> Livraison
              </h2>
              <div className="space-y-4">
                <select 
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-yellow-600/20 transition-all"
                  value={city} onChange={e => setCity(e.target.value)}
                >
                  <option value="Abobo">Abobo</option>
                  <option value="Adjamé">Adjamé</option>
                  <option value="Anyama">Anyama</option>
                  <option value="Attécoubé">Attécoubé</option>
                  <option value="Bingerville">Bingerville</option>
                  <option value="Cocody">Cocody</option>
                  <option value="Koumassi">Koumassi</option>
                  <option value="Marcory">Marcory</option>
                  <option value="Plateau">Plateau</option>
                  <option value="Port-Bouët">Port-Bouët</option>
                  <option value="Songon">Songon</option>
                  <option value="Treichville">Treichville</option>
                  <option value="Yopougon">Yopougon</option>
                  <option value="Autre">Autre (Précisez...)</option>
                </select>

                {city === "Autre" && (
                  <div className="animate-in slide-in-from-top-2 duration-300 text-left">
                    <input 
                      type="text" placeholder="NOM DE VOTRE VILLE" value={customCity} onChange={e => setCustomCity(e.target.value)}
                      className="w-full bg-yellow-600/5 border border-yellow-600/20 rounded-xl p-4 text-xs font-bold tracking-widest outline-none focus:ring-2 focus:ring-yellow-600/40"
                    />
                    <p className="text-[9px] text-yellow-600 mt-2 uppercase tracking-widest font-bold">* Tarif hors-zone : 2.000 FCFA</p>
                  </div>
                )}

                <textarea 
                  placeholder="PRÉCISIONS (QUARTIER, IMMEUBLE...)" value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-bold tracking-widest outline-none focus:ring-2 focus:ring-yellow-600/20 h-28 resize-none transition-all"
                ></textarea>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-black text-white p-8 rounded-[2rem] shadow-2xl border border-white/5">
              <h3 className="font-serif italic text-2xl text-yellow-600 mb-8 text-left">Votre Commande</h3>
              <div className="space-y-4 mb-8 max-h-48 overflow-y-auto pr-2">
                {cartProducts.map(item => (
                  <div key={item.cartId} className="flex justify-between items-center text-[10px] uppercase tracking-widest border-b border-white/5 pb-4 opacity-70">
                    <span className="text-left">{item.title}</span>
                    <span className="font-bold">{item.price?.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/40">
                  <span>Livraison</span>
                  <span className="text-white">{shippingCost.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-[10px] font-black uppercase text-yellow-600 tracking-[0.3em]">Total TTC</span>
                  <span className="text-3xl font-black tracking-tighter">{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full mt-10 bg-yellow-600 text-black h-16 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <>Valider la commande <Send size={16} /></>}
              </button>
            </div>
            
            <div className="bg-white border border-yellow-600/20 p-6 rounded-2xl flex items-center gap-4 shadow-sm text-left">
              <Wallet className="text-yellow-600" size={24} />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-black">Paiement Sécurisé</h4>
                <p className="text-[9px] text-gray-400 uppercase">Orange Money • Wave • Espèces</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}