import Navbar from "@/components/navbar";
import HeroSection from "@/components/sections/hero-section";
import HeroSlider from "@/components/sections/hero-slider";
import HeroImg from "@/components/sections/hero-img";
import HeroVideo from "@/components/sections/hero-video";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className='bg-white flex w-full flex-col gap-y-12 sm:gap-y-16 md:gap-y-20 lg:gap-y-24 xl:gap-y-32 2xl:gap-y-40'>
      <div>
        <Navbar />
        <HeroSection />
      </div>
      <HeroSlider />
      <HeroImg />
      <HeroVideo />
      <Footer />
    </div>
  );
}