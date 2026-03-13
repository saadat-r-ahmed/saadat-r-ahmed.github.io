import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Research from "@/components/Research";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Teaching from "@/components/Teaching";
import NLPPipeline from "@/components/NLPPipeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import GameWrapper from "@/components/game/GameWrapper";

export default function Home() {
  return (
    <GameWrapper>
      <main>
        <Navbar />
        <Hero />
        <About />
        <Education />
        <Research />
        <Experience />
        <Skills />
        <Teaching />
        <NLPPipeline />
        <Contact />
        <Footer />
      </main>
    </GameWrapper>
  );
}
