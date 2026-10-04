import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import IncidentDrill from "@/components/sections/IncidentDrill";
import RushLab from "@/components/sections/RushLab";
import StatusBoard from "@/components/sections/StatusBoard";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Work />
      <IncidentDrill />
      <RushLab />
      <StatusBoard />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
