"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, Users, BarChart3, Package, ArrowUpRight } from "lucide-react";
import Link from "next/link"; // Import indispensable

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/api/admin/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Erreur stats:", err));
  }, []);

  if (!stats) return <div className="p-10 text-center italic text-gray-400">Chargement de votre empire...</div>;

  // Sécurité sur le CA : si totalRevenue n'existe pas, on affiche 0
  const revenue = stats.totalRevenue || 0;

  const cards = [
    { label: "Chiffre d'Affaires", value: `${revenue.toLocaleString()} FCFA`, icon: BarChart3, color: "text-green-600" },
    { label: "Commandes en attente", value: stats.pendingOrders || 0, icon: ShoppingBag, color: "text-yellow-600" },
    { label: "Total Produits", value: stats.productCount || 0, icon: Package, color: "text-blue-600" },
    { label: "Clientes", value: "Premium", icon: Users, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-black uppercase tracking-widest">Tableau de Bord</h1>
        <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Bienvenue dans votre espace de gestion, Queen Mooooo 👑</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`p-4 rounded-2xl bg-gray-50 ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
              <p className="text-xl font-bold text-black">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-bold uppercase tracking-widest text-sm text-black">Commandes Récentes</h2>
          {/* --- FIX : Le bouton devient un Link --- */}
          <Link 
            href="/admin/orders" 
            className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-transform"
          >
            Voir tout <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-black tracking-widest">
              <tr>
                <th className="px-8 py-4 font-black">Client</th>
                <th className="px-8 py-4 font-black">Commune</th>
                <th className="px-8 py-4 font-black">Total</th>
                <th className="px-8 py-4 font-black">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders?.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-sm text-black">{order.name}</td>
                  <td className="px-8 py-5 text-gray-500 text-xs uppercase tracking-wider">{order.city}</td>
                  <td className="px-8 py-5 font-bold text-black">
                    {Number(order.total).toLocaleString()} <span className="text-[9px] text-gray-400">FCFA</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[9px] font-black uppercase rounded-full">
                      {order.status || 'En attente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}