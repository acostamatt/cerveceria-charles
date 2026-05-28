"use client";

/**
 * Navbar.tsx — Pillar 3 (Web Audio) + interactividad base
 * • SOUND toggle: ON → startAmbient, OFF → stopAmbient
 * • "Pedir Canilla" buttons + nav links → playCanPop() on click
 *   (escucha clics con delegación desde document para capturar
 *    botones que viven en otros componentes)
 * • Menú fullscreen con animación GSAP
 */

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { siteData } from "@/lib/data";
import { useAudioEngine } from "@/lib/useAudioEngine";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLAnchorElement[]>([]);

  const { startAmbient, stopAmbient, playCanPop } = useAudioEngine();

  // ── Sound toggle ──────────────────────────────────────────────────────
  const handleSoundToggle = () => {
    if (soundOn) {
      stopAmbient();
    } else {
      startAmbient();
    }
    setSoundOn((prev) => !prev);
  };

  // ── Global click delegation: can-pop SFX ─────────────────────────────
  // Catches .order-beer-btn clicks (in BeerCarousel) + nav links
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(".order-beer-btn") ||
        target.closest(".nav-sfx-link")
      ) {
        if (soundOn) playCanPop();
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [soundOn, playCanPop]);

  // ── Menu GSAP open/close animation ───────────────────────────────────
  useEffect(() => {
    const panel = menuRef.current;
    if (!panel) return;

    if (isMenuOpen) {
      // Slide in from right
      gsap.fromTo(
        panel,
        { xPercent: 100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.65, ease: "power4.out" }
      );
      // Stagger nav links
      if (menuLinksRef.current.length) {
        gsap.fromTo(
          menuLinksRef.current,
          { xPercent: 20, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.07,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }
    } else {
      gsap.to(panel, {
        xPercent: 100,
        opacity: 0,
        duration: 0.45,
        ease: "power3.in",
      });
    }
  }, [isMenuOpen]);

  const openMenu = () => {
    if (soundOn) playCanPop();
    setIsMenuOpen(true);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { num: "01", label: "HOME", href: "#hero" },
    { num: "02", label: "CANILLAS", href: "#taproom" },
    { num: "03", label: "LA COCINA", href: "#kitchen" },
    { num: "04", label: "CONTACTO", href: "#footer" },
  ];

  return (
    <>
      {/* ── Fixed top bar ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-12 md:py-6 flex justify-between items-center bg-brand-black/40 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <a
          href="#"
          className="text-3xl md:text-4xl font-display tracking-widest text-brand-chalk hover:text-brand-copper transition-colors duration-300 select-none"
        >
          CHARLES<span className="text-brand-copper">.</span>
        </a>

        <div className="flex items-center gap-6">
          {/* Sound toggle */}
          <button
            id="sound-toggle"
            onClick={handleSoundToggle}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all text-xs font-mono tracking-wider group ${
              soundOn
                ? "border-brand-copper/60 text-brand-copper"
                : "border-brand-chalk/10 hover:border-brand-copper/40 text-brand-muted hover:text-brand-chalk"
            }`}
            aria-label={soundOn ? "Apagar sonido" : "Encender sonido"}
          >
            <span className="relative flex h-2 w-2">
              {soundOn && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-copper opacity-60" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 transition-colors ${
                  soundOn ? "bg-brand-copper" : "bg-brand-muted group-hover:bg-brand-copper"
                }`}
              />
            </span>
            <span>SOUND: {soundOn ? "ON" : "OFF"}</span>
          </button>

          {/* Hamburger */}
          <button
            onClick={openMenu}
            className="flex flex-col gap-2 p-3 group focus:outline-none"
            aria-label="Abrir Menú"
          >
            <span className="w-8 h-[2px] bg-brand-chalk group-hover:bg-brand-copper transition-all duration-300" />
            <span className="w-5 h-[2px] bg-brand-chalk group-hover:bg-brand-copper transition-all duration-300 self-end group-hover:w-8" />
          </button>
        </div>
      </header>

      {/* ── Fullscreen menu panel ─────────────────────────────────────── */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-brand-black/97 backdrop-blur-xl flex flex-col md:flex-row border-l border-white/5"
        style={{ transform: "translateX(100%)", opacity: 0 }}
        aria-hidden={!isMenuOpen}
      >
        {/* Left column — info */}
        <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-white/5 p-8 md:p-20 flex flex-col justify-between mt-24 md:mt-0">
          <div className="space-y-6">
            <p className="text-xs font-mono text-brand-copper uppercase tracking-widest">
              // HISTORIA INDUSTRIAL
            </p>
            <p className="text-brand-muted text-sm md:text-base leading-relaxed max-w-sm">
              Establecidos en los antiguos talleres ferroviarios de Rosario.
              Forjamos cerveza pesada y hamburguesas con carácter bajo el rugir
              del acero.
            </p>
          </div>
          <div className="hidden md:block space-y-4">
            <p className="text-xs font-mono text-brand-muted uppercase tracking-widest">
              // DIRECCIÓN
            </p>
            <p className="font-mono text-sm text-brand-chalk">
              San Juan 1827,
              <br />
              S2000 Rosario, Santa Fe
            </p>
            <div className="text-xs font-mono text-brand-copper">
              MAR a DOM — 18:00 a 02:00
            </div>
          </div>
        </div>

        {/* Right column — nav links */}
        <div className="w-full md:w-7/12 p-8 md:p-20 flex flex-col justify-between flex-grow">
          {/* Close button */}
          <div className="flex justify-end">
            <button
              onClick={closeMenu}
              className="text-xs font-mono text-brand-muted hover:text-brand-copper transition-colors"
            >
              CERRAR // [X]
            </button>
          </div>

          <nav className="flex flex-col gap-4 md:gap-8 justify-center flex-grow">
            {navLinks.map((link, i) => (
              <a
                key={link.num}
                ref={(el) => {
                  if (el) menuLinksRef.current[i] = el;
                }}
                href={link.href}
                onClick={() => {
                  if (soundOn) playCanPop();
                  closeMenu();
                }}
                className="nav-sfx-link group text-5xl md:text-8xl font-display text-brand-chalk hover:text-brand-copper transition-colors duration-300 flex items-baseline gap-4"
              >
                <span className="text-xs font-mono text-brand-copper group-hover:translate-x-2 transition-transform duration-300">
                  {link.num}
                </span>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex justify-between items-center border-t border-white/5 pt-8">
            <div className="flex gap-6 text-xs font-mono text-brand-muted">
              <a
                href={siteData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-sfx-link hover:text-brand-copper transition-colors"
              >
                INSTAGRAM
              </a>
              <a href="#" className="nav-sfx-link hover:text-brand-copper transition-colors">
                UNTAPPD
              </a>
            </div>
            <div className="text-xs font-mono text-brand-muted hidden sm:block">
              ROSARIO, ARGENTINA
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
