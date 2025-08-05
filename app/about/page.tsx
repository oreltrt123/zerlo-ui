import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import About from "@/components/sections/about";

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <div className="relative top-[30px]">
        <About />
      </div>
      <Footer />
    </>
  );
}
