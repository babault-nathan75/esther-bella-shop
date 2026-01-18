"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";

export default function AdminLoginPage() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // On envoie les infos à notre API de vérification
      const res = await axios.post("/api/admin/login", { pseudo, password });
      if (res.status === 200) {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("Accès refusé. Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo de sécurité */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 border border-yellow-600/30 rounded-full flex items-center justify-center mb-6">
            <Lock className="text-yellow-600" size={24} />
          </div>
          <h1 className="text-white font-serif italic text-2xl">Salons Privés</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mt-2">Accès Restreint • EBF</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <input 
              type="text" required placeholder="Pseudo"
              value={pseudo} onChange={e => setPseudo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-bold text-white tracking-widest outline-none focus:border-yellow-600/50 transition-all placeholder:text-white/10"
            />
          </div>

          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} required placeholder="MOT DE PASSE"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-bold text-white tracking-widest outline-none focus:border-yellow-600/50 transition-all placeholder:text-white/10"
            />
            <button 
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-[9px] uppercase tracking-widest text-center">{error}</p>}

          <button 
            disabled={loading}
            className="w-full bg-yellow-600 text-black h-16 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-2xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Authentification"}
          </button>
        </form>

        <p className="mt-12 text-center text-[8px] uppercase tracking-[0.5em] text-white/10 leading-loose">
          Toute tentative d&apos;accès non autorisée est enregistrée.
        </p>
      </div>
    </div>
  );
}