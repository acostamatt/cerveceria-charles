export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative bg-[#050505] border-t border-white/5 py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden z-20"
    >
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <p className="text-3xl md:text-4xl font-display tracking-widest text-brand-chalk mb-3 select-none">
          CHARLES<span className="text-brand-copper">.</span>
        </p>
        <p className="font-mono text-xs text-brand-muted leading-relaxed">
          San Juan 1827, S2000 Rosario, Santa Fe<br />
          <span className="text-brand-copper mt-1 inline-block">
            MAR a DOM — 18:00 a 02:00
          </span>
        </p>
      </div>

      <div className="text-[10px] text-brand-muted uppercase tracking-widest mt-4 md:mt-0">
        Diseñado y desarrollado por{" "}
        <a
          href="https://tera.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold transition-all duration-300 hover:text-brand-copper hover:drop-shadow-[0_0_8px_rgba(217,119,6,0.6)] ml-1"
        >
          Tera
        </a>
      </div>
    </footer>
  );
}
