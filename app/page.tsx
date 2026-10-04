import Hero from "@/components/sections/Hero";
import HallOfArmor from "@/components/sections/HallOfArmor";
import SnapSection from "@/components/sections/SnapSection";
import Schematics from "@/components/sections/Schematics";
import IncidentDrill from "@/components/sections/IncidentDrill";
import RushLab from "@/components/sections/RushLab";
import TrainingRoom from "@/components/sections/TrainingRoom";
import StatusBoard from "@/components/sections/StatusBoard";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import QuoteBand from "@/components/ui/QuoteBand";
import { quotes } from "@/data/portfolio";

export default function Home() {
  return (
    <main>
      <Hero />
      <QuoteBand {...quotes.armor} />
      <HallOfArmor />
      <SnapSection />
      <Schematics />
      <QuoteBand {...quotes.suit} />
      <IncidentDrill />
      <RushLab />
      <TrainingRoom />
      <StatusBoard />
      <QuoteBand {...quotes.lab} />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
