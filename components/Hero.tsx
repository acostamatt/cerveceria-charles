"use client";

/**
 * Hero.tsx — Pillar 2 (partial)
 * • Parallax background: image moves at 10% scroll speed (gsap y tween)
 * • Progressive zoom-out: scale 1.08 → 1.0 as user scrolls
 * • .reveal-item: masked clip-path slide from below (overflow-hidden parent)
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const bg = bgRef.current;
      if (!section || !bg) return;

      // ── Parallax + zoom-out on the background ──────────────────────
      gsap.to(bg, {
        yPercent: 10,          // moves down 10% of its own height
        scale: 1,              // zoom-out from 1.08 (set via CSS initial)
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // ── .reveal-item mask reveals ─────────────────────────────────
      // Each reveal-item is wrapped in overflow-hidden by its parent.
      // We animate yPercent 100→0 for a cinematic "rise" effect.
      const reveals = section.querySelectorAll<HTMLElement>(".reveal-item");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      // Large display headings — individual letter stagger for H2s
      const headings = section.querySelectorAll<HTMLElement>("h2");
      headings.forEach((h) => {
        gsap.fromTo(
          h,
          { clipPath: "inset(0 0 100% 0)", y: 40 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: h,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 overflow-hidden bg-brand-black border-b border-white/5"
    >
      {/* ── Parallax Background ─────────────────────────────────────── */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{ scale: 1.08, transformOrigin: "center center" }}
      >
        <Image
          src="/images/bar-entrance1.png"
          alt="Entrada Cervecería Charles"
          fill
          priority
          quality={90}
          className="object-cover object-center opacity-30 mix-blend-luminosity"
          sizes="100vw"
        />
        {/* Gradient overlay to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-brand-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-transparent to-brand-black/40" />
      </div>

      {/* ── Copper grain noise overlay ──────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,rgba(217,119,6,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* ── Top meta bar ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono tracking-widest text-brand-muted uppercase">
        <div className="overflow-hidden">
          <div className="flex items-center gap-3 reveal-item">
            <span className="h-1.5 w-1.5 bg-brand-copper rounded-full animate-pulse-copper" />
            <span>ESTACIÓN CENTRAL — ROSARIO</span>
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="reveal-item">
            <span>COBRE LÍQUIDO &amp; ACERO BRUTO</span>
          </div>
        </div>
      </div>

      {/* ── Central headline block ───────────────────────────────────── */}
      <div className="relative z-10 my-auto py-12 flex flex-col justify-center">
        {/* CRAFT BEER — masked reveal */}
        <div className="overflow-hidden leading-none select-none">
          <h2 className="text-[12vw] md:text-[14vw] font-display text-brand-chalk uppercase tracking-tighter leading-none transition-all duration-1000">
            CRAFT BEER
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 my-4">
          <div className="w-full lg:w-4/12 overflow-hidden">
            <div className="reveal-item">
              <p className="font-mono text-brand-copper text-xs tracking-widest mb-2">
                // DIRECTAMENTE DE LA CANILLA
              </p>
              <p className="text-brand-muted text-sm md:text-base leading-relaxed">
                Cervezas vivas sin filtrar, tiradas desde el tanque de maduración
                a tu copa de hierro. Sin atajos, sin concesiones.
              </p>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="text-right text-brand-copper font-display text-7xl md:text-9xl tracking-tight leading-none select-none reveal-item lg:-translate-y-6">
              &amp;
            </div>
          </div>
        </div>

        {/* BURGERS — masked reveal */}
        <div className="overflow-hidden leading-none select-none flex justify-end">
          <h2 className="text-[12vw] md:text-[14vw] font-display text-brand-copper uppercase tracking-tighter leading-none text-right transition-all duration-1000">
            BURGERS
          </h2>
        </div>
      </div>

      {/* ── Bottom stats bar ─────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-between items-end border-t border-white/5 pt-8">
        <div className="flex gap-12 font-mono text-[10px] text-brand-muted">
          <div>
            <p className="text-brand-copper">CANILLAS ACTIVAS</p>
            <p className="text-brand-chalk font-semibold text-xs mt-1">
              12 GRIFOS DE ACERO
            </p>
          </div>
          <div>
            <p className="text-brand-copper">ESTILO DE COCINA</p>
            <p className="text-brand-chalk font-semibold text-xs mt-1">
              SMASH &amp; PATTY MELT
            </p>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex flex-col items-end gap-2 reveal-item">
            <span className="text-[10px] font-mono text-brand-muted uppercase tracking-widest">
              DRAG O SCROLL PARA DESCUBRIR
            </span>
            <div className="w-16 h-[2px] bg-brand-muted/30 relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-8 bg-brand-copper animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
