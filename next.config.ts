import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allowed quality presets used across BeerCarousel and FoodBento
    qualities: [75, 80, 85, 90],
    // Serve modern formats automatically
    formats: ["image/avif", "image/webp"],
    // Local images only — no external domains needed yet
    remotePatterns: [],
  },
};

export default nextConfig;
