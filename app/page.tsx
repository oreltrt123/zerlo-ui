import Navbar from "@/components/navbar";
import HeroSection from "@/components/sections/hero-section";
import HeroSlider from "@/components/sections/hero-slider";
import HeroImg from "@/components/sections/hero-img";
// import {Features} from "@/components/sections/features";
import HeroVideo from "@/components/sections/hero-video";
import Footer from "@/components/sections/footer";
import ConsentBanner from "@/components/consent/ConsentBanner";
// import { CommunitySection } from "@/components/sections/community";
// import { Component } from "@/components/ui/animated-background";

export default function Home() {
  return (
    <div className="">
      <div>
        <Navbar />
        <HeroSection />
      </div>
       {/* <Features/> */}
       {/* <Component /> */}
      <HeroSlider />
      <HeroImg />
      <HeroVideo />
      {/* <CommunitySection /> */}
      <Footer />
      <ConsentBanner />
    </div>
  );
}
