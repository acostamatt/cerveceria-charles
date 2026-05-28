"use client";

/**
 * GsapInit — Client Component
 * Registers GSAP plugins once on the client side.
 * Rendered inside RootLayout so all pages inherit the plugins.
 * Safe strategy: useIsomorphicLayoutEffect (server no-op, client runs).
 */

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default function GsapInit() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Global ScrollTrigger defaults — smooth scrub
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
    });

    // Refresh on next tick after hydration settles
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, []);

  return null;
}
