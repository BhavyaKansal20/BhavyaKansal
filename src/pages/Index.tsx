import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechStackScroller from "@/components/TechStackScroller";
import About from "@/components/About";
import Timeline from "../components/Timeline";
import Projects from "@/components/Projects";
import CodingDashboard from "@/components/CodingDashboard";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  // Handle hash navigation when component mounts
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow relative z-10 bg-background shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-b-[2.5rem] sm:rounded-b-[3rem]">
        <Hero />
        <TechStackScroller />
        <About />
        <Timeline />
        <Projects />
        <CodingDashboard />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;