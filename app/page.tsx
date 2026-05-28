import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BeerCarousel from "@/components/BeerCarousel";
import FoodBento from "@/components/FoodBento";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full">
        <Hero />
        <BeerCarousel />
        <FoodBento />
        <Footer />
      </main>
    </>
  );
}
