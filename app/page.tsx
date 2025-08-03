import  Navbar from "@/components/navbar"
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import PhilosophySection from "@/components/sections/philosophy-section";
import ContactSection from "@/components/sections/contact-section";
import ConnectSection from "@/components/sections/connect-section";
import BrandKitSection from "@/components/sections/brand-kit-section";

export default function Home() {
  return (
    <main className="bg-[#030303] text-white overflow-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PhilosophySection />
      <ConnectSection />
      <BrandKitSection />
      <ContactSection />
    </main>
  );
}
// import  Navabar from "@/components/navabar"

// export default async function Home() {
//   return (
//     <main className="min-h-screen bg-[#fafafa] dark:bg-[#0d1117]">
//       <Navabar />
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
//       </div>
//     </main>
//   );
// }