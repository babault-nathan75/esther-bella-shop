import { isVideo } from "@/lib/shop";

// <img> plutôt que next/image : l'admin peut coller une URL de n'importe quel domaine
export default function Media({ src, alt = "", className = "", eager = false }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-paper font-serif text-2xl text-muted/40 ${className}`} aria-hidden="true">
        EB
      </div>
    );
  }
  if (isVideo(src)) {
    return <video src={src} autoPlay muted loop playsInline preload="metadata" className={className} aria-label={alt} />;
  }
  return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={className} />;
}
