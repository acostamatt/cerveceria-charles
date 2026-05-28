"use client";

/**
 * BeerCarousel.tsx — Pillar 1 (Refactored)
 * • Native horizontal scrolling (overflow-x-auto) with CSS snap
 * • Mouse drag-to-scroll functionality for desktop
 * • Arrow buttons scroll the track left/right
 * • Removed GSAP ScrollTrigger pin to allow native swiping sideways
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { beers } from "@/lib/data";

export default function BeerCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const setCardRef = (el: HTMLElement | null, i: number) => {
    if (el) cardRefs.current[i] = el;
  };

  useEffect(() => {
    // ── Card hover: 3D tilt + copper glow (Desktop Only) ────────────────
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    if (!isMobile) {
      cardRefs.current.forEach((card) => {
        if (!card) return;

        const handleEnter = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const cx = (e.clientX - rect.left) / rect.width - 0.5;
          const cy = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: cx * 8,
            rotateX: -cy * 6,
            scale: 1.025,
            boxShadow: "0 0 40px rgba(217,119,6,0.22), 0 0 80px rgba(217,119,6,0.08)",
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 900,
          });
        };

        const handleMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const cx = (e.clientX - rect.left) / rect.width - 0.5;
          const cy = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: cx * 8,
            rotateX: -cy * 6,
            duration: 0.3,
            ease: "power1.out",
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            boxShadow: "none",
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
          });
        };

        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);

        (card as any)._cleanup = () => {
          card.removeEventListener("mouseenter", handleEnter);
          card.removeEventListener("mousemove", handleMove);
          card.removeEventListener("mouseleave", handleLeave);
        };
      });
    }

    return () => {
      cardRefs.current.forEach((card) => {
        (card as any)?._cleanup?.();
      });
    };
  }, []);

  // ── Drag to scroll (Mouse) ────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll-fast factor
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  // ── Arrow controls ────────────────────────────────────────────────────
  const scroll = (dir: 1 | -1) => {
    if (!trackRef.current) return;
    const scrollAmount = window.innerWidth > 768 ? 480 : 320;
    trackRef.current.scrollBy({ left: scrollAmount * dir, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="taproom"
      className="relative py-24 bg-[#08080a] border-b border-white/5 overflow-hidden"
    >
      {/* ── Section header ── */}
      <div className="px-6 md:px-12 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-xs font-mono text-brand-copper uppercase tracking-widest">
            // COBRE EN LAS VENAS
          </span>
          <h3 className="text-6xl md:text-8xl font-display text-brand-chalk uppercase leading-none mt-2">
            CANILLAS
          </h3>
        </div>
        <div className="max-w-xs">
          <p className="text-brand-muted text-xs font-mono uppercase mb-3">
            CONSEJO DEL MAESTRO CERVECERO:
          </p>
          <p className="text-brand-muted text-sm leading-relaxed">
            Nuestras cervezas se conservan en cámara hiperbárica bajo atmósfera
            de nitrógeno. Desliza para explorar las variedades del día.
          </p>
        </div>
      </div>

      {/* ── Arrow controls ───────────────────────────────────────────── */}
      <div className="flex justify-end gap-2 px-6 md:px-12 mb-6">
        <button
          onClick={() => scroll(-1)}
          className="p-3 border border-white/10 hover:border-brand-copper hover:text-brand-copper transition-all text-sm font-mono bg-[#08080a] z-30 relative"
          aria-label="Anterior cerveza"
        >
          [&larr;]
        </button>
        <button
          onClick={() => scroll(1)}
          className="p-3 border border-white/10 hover:border-brand-copper hover:text-brand-copper transition-all text-sm font-mono bg-[#08080a] z-30 relative"
          aria-label="Siguiente cerveza"
        >
          [&rarr;]
        </button>
      </div>

      {/* ── Horizontal native scroll track ───────────────────────────── */}
      <div className="relative w-full">
        <div
          ref={trackRef}
          className={`flex gap-6 md:gap-8 px-6 md:px-12 overflow-x-auto snap-x snap-mandatory pb-12 hide-scrollbar ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {beers.map((beer, index) => (
            <article
              key={beer.id}
              ref={(el) => setCardRef(el, index)}
              className="w-[85vw] sm:w-[440px] shrink-0 snap-center sm:snap-start bg-brand-surface border border-white/5 hover:border-brand-copper/40 transition-colors duration-500 flex flex-col justify-between relative group overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-white/20 select-none z-10 pointer-events-none">
                GRIDREF{String(index + 1).padStart(2, "0")}
              </div>

              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(217,119,6,0.07)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

              <div className="relative w-full h-56 overflow-hidden shrink-0 pointer-events-none">
                <Image
                  src={beer.image}
                  alt={`Cerveza ${beer.name}`}
                  fill
                  quality={80}
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  sizes="(max-width: 640px) 85vw, 440px"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/30 to-transparent pointer-events-none" />
              </div>

              <div className="p-8 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-xs font-mono text-brand-copper tracking-widest pointer-events-none">
                    // ON TAP {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex justify-between items-baseline mt-4 pointer-events-none">
                    <h4 className="text-4xl md:text-5xl font-display text-brand-chalk group-hover:text-brand-copper transition-colors">
                      {beer.name}
                    </h4>
                    {beer.tapNumber && (
                      <span className="font-mono text-brand-copper text-lg pointer-events-none">
                        Nº {beer.tapNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-brand-muted text-sm mt-3 leading-relaxed font-sans max-w-sm pointer-events-none">
                    {beer.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                  <div className="grid grid-cols-3 text-xs font-mono pointer-events-none">
                    <div>
                      <span className="text-brand-muted block text-[10px]">ALC</span>
                      <span className="text-brand-chalk font-semibold text-sm">{beer.abv}</span>
                    </div>
                    <div>
                      <span className="text-brand-muted block text-[10px]">IBU</span>
                      <span className="text-brand-chalk font-semibold text-sm">{beer.ibu}</span>
                    </div>
                    <div>
                      <span className="text-brand-muted block text-[10px]">SERVIR</span>
                      <span className="text-brand-chalk font-semibold text-sm">{beer.temp ?? "4º C"}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-2">
                    <span className="text-xl font-mono text-brand-chalk pointer-events-none">{beer.price ?? "$4.200"}</span>
                    <button className="order-beer-btn px-4 py-2 bg-brand-copper/10 hover:bg-brand-copper text-brand-copper hover:text-brand-black font-mono text-xs uppercase tracking-widest transition-all duration-300 border border-brand-copper/30 hover:border-brand-copper relative z-20 cursor-pointer">
                      PEDIR CANILLA
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Scroll-hint fade gradient on the right edge */}
        <div className="absolute right-0 top-0 h-full w-12 md:w-24 bg-gradient-to-l from-[#08080a] to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
}
