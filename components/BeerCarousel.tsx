"use client";

/**
 * BeerCarousel.tsx — Pillar 1
 * • True horizontal scroll pinned to #taproom via ScrollTrigger (pin: true)
 * • Heavy-inertia scrub: 1.5 ("física de canilla")
 * • Card hover: subtle 3D tilt + copper glow
 * • Arrow buttons nudge the scroll position
 * • Real beer images from /images/beers/
 */

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { beers } from "@/lib/data";

export default function BeerCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const stRef = useRef<ScrollTrigger | null>(null);

  // Populate cardRefs array without duplicates
  const setCardRef = useCallback((el: HTMLElement | null, i: number) => {
    if (el) cardRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Total distance to scroll horizontally
      const getScrollAmount = () => -(track.scrollWidth - track.offsetWidth);

      const st = ScrollTrigger.create({
        trigger: section,
        pin: true,
        anticipatePin: 1,
        start: "top top",
        end: () => `+=${Math.abs(getScrollAmount()) + window.innerWidth * 0.3}`,
        scrub: 1.5,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          x: getScrollAmount,
          ease: "none",
        }),
      });

      stRef.current = st;

      // ── Card hover: 3D tilt + copper glow ───────────────────────────
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

        // Store cleanup on element for revert
        (card as HTMLElement & { _cleanup?: () => void })._cleanup = () => {
          card.removeEventListener("mouseenter", handleEnter);
          card.removeEventListener("mousemove", handleMove);
          card.removeEventListener("mouseleave", handleLeave);
        };
      });
    }, sectionRef);

    return () => {
      // Clean up hover listeners
      cardRefs.current.forEach((card) => {
        (card as HTMLElement & { _cleanup?: () => void })?._cleanup?.();
      });
      ctx.revert();
    };
  }, []);

  // ── Arrow nudge ───────────────────────────────────────────────────────
  const nudge = (dir: 1 | -1) => {
    const st = stRef.current;
    if (!st) return;
    const nudgePx = window.innerWidth * 0.45;
    const progress = st.progress;
    const total = st.end - st.start;
    gsap.to(window, {
      scrollTo: { y: st.start + progress * total + dir * nudgePx },
      duration: 0.8,
      ease: "power2.inOut",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="taproom"
      className="relative py-0 bg-[#08080a] border-b border-white/5 overflow-hidden will-change-transform"
      style={{ height: "100vh" }}
    >
      {/* ── Section header (stays pinned at top while carousel scrolls) ── */}
      <div className="px-6 md:px-12 pt-20 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
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
            de nitrógeno. Tira para desplazarte por las variedades del día.
          </p>
        </div>
      </div>

      {/* ── Arrow controls ───────────────────────────────────────────── */}
      <div className="flex justify-end gap-2 px-6 md:px-12 mb-4">
        <button
          onClick={() => nudge(-1)}
          className="p-2 border border-white/10 hover:border-brand-copper/50 hover:text-brand-copper transition-all text-xs font-mono"
          aria-label="Anterior cerveza"
        >
          [&larr;]
        </button>
        <button
          onClick={() => nudge(1)}
          className="p-2 border border-white/10 hover:border-brand-copper/50 hover:text-brand-copper transition-all text-xs font-mono"
          aria-label="Siguiente cerveza"
        >
          [&rarr;]
        </button>
      </div>

      {/* ── Horizontal track (GSAP moves this) ───────────────────────── */}
      <div className="px-6 md:px-12 overflow-hidden">
        <div
          ref={trackRef}
          className="gsap-horizontal-section flex gap-6 md:gap-8 w-max pb-8"
        >
          {beers.map((beer, index) => (
            <article
              key={beer.id}
              ref={(el) => setCardRef(el, index)}
              className="w-[80vw] sm:w-[440px] shrink-0 bg-brand-surface border border-white/5 hover:border-brand-copper/40 transition-colors duration-500 flex flex-col justify-between relative group overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Grid ref label */}
              <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-white/20 select-none z-10">
                GRIDREF{String(index + 1).padStart(2, "0")}
              </div>

              {/* Copper radial hover glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(217,119,6,0.07)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

              {/* ── Beer image ─────────────────────────────────────── */}
              <div className="relative w-full h-52 overflow-hidden shrink-0">
                <Image
                  src={beer.image}
                  alt={`Cerveza ${beer.name} — Cervecería Charles`}
                  fill
                  quality={80}
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 80vw, 440px"
                  // Fallback gradient if image missing
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/30 to-transparent" />
              </div>

              {/* ── Card body ─────────────────────────────────────── */}
              <div className="p-8 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-xs font-mono text-brand-copper tracking-widest">
                    // ON TAP {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex justify-between items-baseline mt-4">
                    <h4 className="text-4xl md:text-5xl font-display text-brand-chalk group-hover:text-brand-copper transition-colors">
                      {beer.name}
                    </h4>
                    {beer.tapNumber && (
                      <span className="font-mono text-brand-copper text-lg">
                        Nº {beer.tapNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-brand-muted text-sm mt-3 leading-relaxed font-sans max-w-sm">
                    {beer.description}
                  </p>
                </div>

                {/* Stats + CTA */}
                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                  <div className="grid grid-cols-3 text-xs font-mono">
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
                    <span className="text-xl font-mono text-brand-chalk">{beer.price ?? "$4.200"}</span>
                    <button className="order-beer-btn px-4 py-2 bg-brand-copper/10 hover:bg-brand-copper text-brand-copper hover:text-brand-black font-mono text-xs uppercase tracking-widest transition-all duration-300 border border-brand-copper/30 hover:border-brand-copper">
                      PEDIR CANILLA
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Scroll-hint fade gradient on the right edge */}
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#08080a] to-transparent pointer-events-none z-20" />
    </section>
  );
}
