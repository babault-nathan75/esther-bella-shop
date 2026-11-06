"use client";
import { useRef, useState } from "react";
import Media from "@/components/Media";

// Galerie à faire glisser au doigt, avec un repère de position
export default function SnapGallery({ items, className = "", imageClassName = "", dotsClassName = "bottom-3" }) {
  const [active, setActive] = useState(0);
  const scroller = useRef(null);

  const onScroll = () => {
    const el = scroller.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={scroller} onScroll={onScroll} className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto">
        {items.map(({ key, src, alt }, index) => (
          <div key={key} className="w-full shrink-0 snap-center">
            <Media src={src} alt={alt} eager={index === 0} className={`w-full bg-paper object-cover ${imageClassName}`} />
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 z-10 flex justify-center gap-1.5 ${dotsClassName}`}>
          {items.map(({ key }, index) => (
            <span key={key} className={`h-1.5 rounded-full shadow transition-all duration-300 ${index === active ? "w-6 bg-white" : "w-1.5 bg-white/60"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
