"use client";

/**
 * FoodBento.tsx — Pillar 2 (food cards)
 * • Each card: black copper wipe → reveals image (scale 1.1→1.0)
 * • Asymmetric stagger: primary card triggers first, secondary offset
 * • Subtle parallax on images (scroll y at different rates per card)
 * • .reveal-item text slides from below
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { food } from "@/lib/data";

export default function FoodBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const primary = food[0];
  const secondary = food.slice(1, 3);
  const rest = food.slice(3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Wipe-reveal for every bento card ─────────────────────────────
      // Pattern: a sibling .wipe-curtain div slides from left→right
      // while the underlying <Image> scales 1.1→1.0
      const cards = section.querySelectorAll<HTMLElement>(".bento-card");

      cards.forEach((card, i) => {
        const curtain = card.querySelector<HTMLElement>(".wipe-curtain");
        const img = card.querySelector<HTMLElement>(".bento-img");

        if (!curtain || !img) return;

        const delay = i * 0.08; // asymmetric stagger

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            once: true,
          },
          delay,
        });

        // Curtain sweeps right (X: 0% → 101%)
        tl.fromTo(
          curtain,
          { xPercent: 0 },
          { xPercent: 101, duration: 0.85, ease: "power3.inOut" }
        );

        // Simultaneously de-zoom image
        tl.fromTo(
          img,
          { scale: 1.12 },
          { scale: 1, duration: 1.1, ease: "power2.out" },
          "<"
        );

        // Subtle ongoing parallax on the image as section scrolls
        gsap.to(img, {
          yPercent: i % 2 === 0 ? -8 : 8,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // ── Section title reveal ──────────────────────────────────────────
      const titleEl = section.querySelector<HTMLElement>(".section-title");
      if (titleEl) {
        gsap.fromTo(
          titleEl,
          { clipPath: "inset(0 0 100% 0)", y: 30 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleEl,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // ── Generic .reveal-item in this section ─────────────────────────
      section.querySelectorAll<HTMLElement>(".reveal-item").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
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
      id="kitchen"
      className="relative py-24 md:py-32 bg-brand-black border-b border-white/5 overflow-hidden"
    >
      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className="px-6 md:px-12 mb-16">
        <div className="overflow-hidden">
          <span className="block text-xs font-mono text-brand-copper uppercase tracking-widest reveal-item">
            // LA COCINA
          </span>
        </div>
        <div className="overflow-hidden mt-2">
          <h3 className="section-title text-6xl md:text-8xl font-display text-brand-chalk uppercase leading-none">
            SMASH &amp; PATTY MELT
          </h3>
        </div>
      </div>

      {/* ── Bento Grid ───────────────────────────────────────────────────── */}
      <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[320px]">

        {/* Hero card — 4 cols x 2 rows */}
        <div className="bento-card md:col-span-4 md:row-span-2 relative group overflow-hidden bg-brand-surface border border-white/5 hover:border-brand-copper/40 transition-colors duration-500">
          {/* Image layer */}
          <div className="absolute inset-0">
            <Image
              src={primary.image}
              alt={primary.name}
              fill
              quality={85}
              className="bento-img object-cover object-center"
              sizes="(max-width: 768px) 100vw, 66vw"
              style={{ scale: 1.12 }}
            />
          </div>
          {/* Wipe curtain (copper-black) */}
          <div
            className="wipe-curtain absolute inset-0 z-20"
            style={{
              background: "linear-gradient(135deg, #d97706 0%, #050505 60%)",
              transformOrigin: "left center",
            }}
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-brand-copper/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

          {/* Text overlay */}
          <div className="relative z-30 h-full flex flex-col justify-end p-6 md:p-10">
            {primary.tag && (
              <span className="self-start mb-3 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-brand-copper border border-brand-copper/50">
                {primary.tag}
              </span>
            )}
            <div className="overflow-hidden">
              <div className="reveal-item flex items-baseline justify-between gap-4">
                <h4 className="text-4xl md:text-6xl font-display text-brand-chalk group-hover:text-brand-copper transition-colors leading-tight">
                  {primary.name}
                </h4>
                <span className="text-xl md:text-2xl font-mono text-brand-copper whitespace-nowrap shrink-0">
                  {primary.price}
                </span>
              </div>
            </div>
            <p className="text-brand-muted text-sm mt-3 max-w-xl leading-relaxed">
              {primary.description}
            </p>
          </div>
        </div>

        {/* Secondary cards — 2 cols */}
        {secondary.map((item, i) => (
          <div
            key={item.id}
            className="bento-card md:col-span-2 md:row-span-1 relative group overflow-hidden bg-brand-surface border border-white/5 hover:border-brand-copper/40 transition-colors duration-500"
          >
            <div className="absolute inset-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                quality={75}
                className="bento-img object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ scale: 1.12 }}
              />
            </div>
            <div
              className="wipe-curtain absolute inset-0 z-20"
              style={{
                background: i === 0
                  ? "linear-gradient(135deg, #050505 0%, #d97706 100%)"
                  : "#050505",
                transformOrigin: "left center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-brand-copper/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

            <div className="relative z-30 h-full flex flex-col justify-end p-6">
              {item.tag && (
                <span className="self-start mb-2 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-brand-copper border border-brand-copper/50">
                  {item.tag}
                </span>
              )}
              <div className="overflow-hidden">
                <div className="reveal-item flex items-baseline justify-between gap-3">
                  <h4 className="text-2xl md:text-3xl font-display text-brand-chalk group-hover:text-brand-copper transition-colors leading-tight">
                    {item.name}
                  </h4>
                  <span className="text-lg font-mono text-brand-copper whitespace-nowrap shrink-0">
                    {item.price}
                  </span>
                </div>
              </div>
              <p className="text-brand-muted text-xs mt-2 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}

        {/* Rest cards — 2 cols each */}
        {rest.map((item, i) => (
          <div
            key={item.id}
            className="bento-card md:col-span-2 md:row-span-1 relative group overflow-hidden bg-brand-surface border border-white/5 hover:border-brand-copper/40 transition-colors duration-500"
          >
            <div className="absolute inset-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                quality={75}
                className="bento-img object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ scale: 1.12 }}
              />
            </div>
            <div
              className="wipe-curtain absolute inset-0 z-20"
              style={{
                background: "#050505",
                transformOrigin: "left center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-brand-copper/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

            <div className="relative z-30 h-full flex flex-col justify-end p-6">
              {item.tag && (
                <span className="self-start mb-2 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-brand-copper border border-brand-copper/50">
                  {item.tag}
                </span>
              )}
              <div className="overflow-hidden">
                <div className="reveal-item flex items-baseline justify-between gap-3">
                  <h4 className="text-2xl md:text-3xl font-display text-brand-chalk group-hover:text-brand-copper transition-colors leading-tight">
                    {item.name}
                  </h4>
                  <span className="text-lg font-mono text-brand-copper whitespace-nowrap shrink-0">
                    {item.price}
                  </span>
                </div>
              </div>
              <p className="text-brand-muted text-xs mt-2 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
