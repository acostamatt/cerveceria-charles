import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BeerCarousel from "@/components/BeerCarousel";
import FoodBento from "@/components/FoodBento";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full">
        <Hero />
        <BeerCarousel />
        <FoodBento />
        <footer id="footer" className="py-16 px-6 md:px-12 bg-[#08080a]" />
      </main>
    </>
  );
}
