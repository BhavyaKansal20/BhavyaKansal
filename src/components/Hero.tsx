import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();

  return (
    <section
      ref={heroRef}
      className="min-h-[88vh] bg-background relative overflow-hidden pt-28 sm:pt-24 pb-16"
    >
      {/* Decorative floating blobs — GPU-composited CSS transforms */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-6 sm:left-10 w-20 h-20 rounded-full bg-blue-300/25 blur-2xl animate-float" />
        <div className="absolute top-40 right-10 sm:right-20 w-32 h-32 rounded-full bg-purple-300/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-1/4 w-24 h-24 rounded-full bg-pink-300/20 blur-2xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full bg-cyan-300/25 blur-xl animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 lg:gap-8 items-center relative z-10">
        {/* Command palette hint */}
        <div className="absolute top-0.5 right-0 z-20 hidden sm:block">
          <div className="bg-gradient-to-r from-gray-100/95 to-gray-200/90 dark:from-gray-900/95 dark:to-black/90 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-black/20 dark:border-white/10">
            Press <kbd className="px-2 py-0.5 mx-1 bg-gray-300/60 dark:bg-gray-800/60 border border-black/20 dark:border-white/20 rounded text-xs font-semibold">Ctrl+K</kbd> to open the AI assistant
          </div>
        </div>

        {/* Left content */}
        <div className={`space-y-7 ${heroVisible ? "scroll-animate" : "opacity-0"}`}>
          <span className="eyebrow">Portfolio — Bhavya Kansal</span>

          <h1 className="display-heading text-[2.35rem] leading-[1.05] sm:text-5xl md:text-6xl font-bold">
            Building production-ready AI systems across machine learning, computer vision & intelligent automation.
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg" style={{ textAlign: "justify" }}>
            Hi, I'm <span className="text-foreground font-semibold">Bhavya Kansal</span>. I architect and
            build scalable AI systems — machine-learning models, multimodal applications, and deep-tech
            solutions for real-world engineering challenges.
          </p>

          <p className="text-sm text-muted-foreground max-w-xl" style={{ textAlign: "justify" }}>
            Based in Patiala, Punjab — pursuing B.Tech in Data Science & AI at TIET. I work across AI/ML
            engineering, research, and collaborations within the TIET ecosystem and beyond.
          </p>

          <div className="flex flex-wrap gap-4 pt-1">
            <Button
              size="lg"
              className="rounded-full gap-2 px-8 py-6 text-base font-medium shadow-lg shadow-black/10 hover:shadow-xl transition-shadow"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              View my work
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2 px-8 py-6 text-base font-medium border-2 border-black dark:border-white hover:bg-black hover:text-white hover:border-white dark:hover:bg-white dark:hover:text-black dark:hover:border-black"
              onClick={() => window.open("/Bhavya-Kansal-Resume.pdf", "_blank")}
            >
              View Resume
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Right content — profile image */}
        <div className={`relative mt-14 lg:mt-0 ${heroVisible ? "scroll-animate scroll-animate-delay-2" : "opacity-0"}`}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <div className="rounded-3xl p-1 bg-white/60 dark:bg-black/30 relative">
              <img
                src="/Bhavya-Kansal-PFP.jpg?v=20260509"
                alt="Bhavya Kansal — AI Systems Architect & Developer"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-[440px] sm:h-[500px] md:h-[560px] object-cover object-top rounded-2xl transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {/* Dark-mode vignette */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none hidden dark:block"
                style={{ background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)" }}
              />
              {/* Light-mode subtle highlight */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none block dark:hidden"
                aria-hidden
                style={{
                  background: "radial-gradient(circle at 62% 34%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 8%, rgba(255,255,255,0.05) 18%, transparent 28%)",
                  mixBlendMode: "screen",
                  opacity: 0.22,
                }}
              />
            </div>

            {/* Bottom overlay — no phone, no availability badge */}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-6 text-white">
              <p className="text-lg font-semibold text-white/80">AI/ML · Research & Collaborations</p>
              <p className="text-sm text-white/80 mt-2">जय श्री राम 🙏❤️</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
