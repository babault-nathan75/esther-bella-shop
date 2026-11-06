"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import axios from "axios";

export default function AdminLoginPage() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
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
      const res = await axios.post("/api/admin/login", { pseudo, password, website });
      if (res.status === 200) {
        router.push("/admin/dashboard");
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Connexion impossible. Réessayez.");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink p-4 text-white">
      <div className="absolute inset-x-0 top-0 h-1 bg-brand" />
      <div aria-hidden="true" className="absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-brand/30 blur-[120px]" />
      <div aria-hidden="true" className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-brand/20 blur-[110px]" />

      <div className="rise relative grid w-full max-w-4xl overflow-hidden rounded-3xl bg-ink shadow-2xl ring-1 ring-white/15 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center border-b border-white/10 p-8 text-center md:border-b-0 md:border-r md:p-12">
          <Image src="/brand/logo.png" alt="Esther Bella Shop" width={640} height={380} priority className="h-28 w-auto md:h-44" />
          <p className="mt-4 font-script text-3xl text-red-400">Espace privé</p>
          <p className="mt-2 hidden max-w-xs text-sm text-white/60 md:block">Commandes, tenues et statistiques de votre boutique, au même endroit.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-white p-6 text-ink md:p-10">
          <div>
            <h1 className="font-serif text-3xl font-bold">Connexion</h1>
            <p className="mt-1 text-sm text-muted">Réservée à l&apos;administration.</p>
          </div>

          {/* Piège à robots : invisible pour une personne */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
            <label>Site web<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
          </div>

          <div>
            <label htmlFor="pseudo" className="mb-1 block text-sm font-medium">Pseudo</label>
            <input id="pseudo" required autoFocus autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={100} value={pseudo} onChange={e => setPseudo(e.target.value)} className="field" />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Mot de passe</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" maxLength={200} value={password} onChange={e => setPassword(e.target.value)} className="field pr-12!" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="absolute right-1 top-0.5 flex h-11 w-11 items-center justify-center text-muted hover:text-ink">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p role="alert" className="flex gap-2 rounded-xl bg-red-50 p-3 text-sm text-brand-dark"><AlertCircle size={18} className="shrink-0" /> {error}</p>}

          <button disabled={loading} className="group flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white transition-colors hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60">
            {loading ? <Loader2 className="animate-spin" /> : <><Lock size={16} /> Se connecter <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted"><ShieldCheck size={14} /> Accès bloqué après plusieurs essais erronés</p>
        </form>
      </div>
    </main>
  );
}
