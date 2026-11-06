"use client";
import { useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, X } from "lucide-react";
import Media from "@/components/Media";

// Gère une liste de visuels : envoi de fichiers ou collage d'une URL
export default function MediaUploader({ value, onChange, multiple = true, onBusyChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const add = (urls) => onChange(multiple ? [...value, ...urls] : urls.slice(-1));

  const handleFiles = async (event) => {
    const files = [...event.target.files];
    event.target.value = "";
    if (!files.length) return;
    setIsUploading(true);
    onBusyChange?.(true);
    setError("");
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("/api/upload", formData);
        uploaded.push(res.data.url);
      }
      add(uploaded);
    } catch (err) {
      setError(err.response?.status === 413 ? "Fichier trop lourd." : "L'envoi du fichier a échoué.");
    } finally {
      setIsUploading(false);
      onBusyChange?.(false);
    }
  };

  const move = (index, step) => {
    const next = [...value];
    [next[index], next[index + step]] = [next[index + step], next[index]];
    onChange(next);
  };

  const addUrl = () => {
    if (!url.trim()) return;
    add([url.trim()]);
    setUrl("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((src, index) => (
          <div key={src + index} className="relative h-28 w-20 overflow-hidden rounded-lg bg-paper">
            <Media src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Retirer ce visuel"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white"
            >
              <X size={14} />
            </button>
            {multiple && index === 0 && value.length > 1 && (
              <span className="absolute left-1 top-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">Principale</span>
            )}
            {multiple && value.length > 1 && (
              <div className="absolute inset-x-1 bottom-1 flex justify-between">
                <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Avancer ce visuel" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink disabled:invisible"><ChevronLeft size={15} /></button>
                <button type="button" disabled={index === value.length - 1} onClick={() => move(index, 1)} aria-label="Reculer ce visuel" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink disabled:invisible"><ChevronRight size={15} /></button>
              </div>
            )}
          </div>
        ))}
        <label className="flex h-28 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line text-center text-xs text-muted hover:border-ink">
          {isUploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
          {isUploading ? "Envoi…" : multiple ? "Photos, vidéos" : "Ajouter"}
          <input type="file" accept="image/*,video/*" multiple={multiple} className="sr-only" onChange={handleFiles} disabled={isUploading} />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="url"
          aria-label="URL d'un visuel"
          placeholder="Ou coller une URL d'image ou de vidéo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
          className="field"
        />
        <button type="button" onClick={addUrl} className="shrink-0 rounded-lg border border-line px-4 text-sm font-semibold hover:border-ink">
          Ajouter
        </button>
      </div>
      {multiple && <p className="mt-2 text-xs text-muted">Sélectionnez plusieurs fichiers d&apos;un coup. Le premier visuel sert de photo principale.</p>}
      {error && <p role="alert" className="mt-2 text-sm text-brand">{error}</p>}
    </div>
  );
}
