import Navbar from "@/components/navbar";
import HeroSection from "@/components/sections/hero-section";
import HeroSlider from "@/components/sections/hero-slider";
import HeroImg from "@/components/sections/hero-img";
// import {Features} from "@/components/sections/features";
import HeroVideo from "@/components/sections/hero-video";
import Footer from "@/components/sections/footer";
import ConsentBanner from "@/components/consent/ConsentBanner";
import NotificationGet from "@/components/sections/notification-get";
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
      <h1 style={{fontSize: "50px"}} className="text-black text-lg font-sans font-light leading-relaxed max-w-3xl mx-auto text-center">Zerlo Chat in Action</h1>
      <HeroSlider />
      <HeroImg />
      <HeroVideo />
      <h1 style={{fontSize: "50px"}} className="text-black text-lg font-sans font-light leading-relaxed  mx-auto text-center">Start building but with security <span className="bg-[#8888881A]">beta</span></h1>
      <NotificationGet />
      {/* <CommunitySection /> */}
      <Footer />
      <ConsentBanner />
    </div>
  )
}
