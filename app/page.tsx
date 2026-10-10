import Hero from "@/components/sections/Hero";
import HallOfArmor from "@/components/sections/HallOfArmor";
import Schematics from "@/components/sections/Schematics";
import IncidentDrill from "@/components/sections/IncidentDrill";
import RushLab from "@/components/sections/RushLab";
import TrainingRoom from "@/components/sections/TrainingRoom";
import StatusBoard from "@/components/sections/StatusBoard";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Certifications from "@/components/sections/Certifications";
import FlightLog from "@/components/sections/FlightLog";
import Footer from "@/components/Footer";
import PilotNote from "@/components/sections/PilotNote";
import Interlude from "@/components/sections/Interlude";

export default function Home() {
  return (
    <main>
      <Hero />
      <PilotNote />
      <HallOfArmor />
      <Interlude />
      <Schematics />
      <IncidentDrill />
      <RushLab />
      <TrainingRoom />
      <StatusBoard />
      <About />
      <FlightLog />
      <Certifications />
      <Contact />
      <Footer />
    </main>
  );
}
