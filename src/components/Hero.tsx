import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState, useRef } from "react";
import { useFastFloat } from "@/hooks/useFastFloat";

const ROLES = [
  "AI/ML Engineer",
  "Deep-Tech Builder",
  "Computer Vision Dev",
  "ML Systems Architect",
];

const Hero = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const [isMobile, setIsMobile] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const blobA = useRef<HTMLDivElement | null>(null);
  const blobB = useRef<HTMLDivElement | null>(null);
  const blobC = useRef<HTMLDivElement | null>(null);
  const blobD = useRef<HTMLDivElement | null>(null);
  const { animate } = useFastFloat();

  // Typing animation
  useEffect(() => {
    const role = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (typing) {
      if (displayed.length < role.length) {
        timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setRoleIndex((i) => (i + 1) % ROLES.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIndex]);

  useEffect(() => {
    const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 767px)') : null;
    const update = () => {
      const inner = typeof window !== 'undefined' ? window.innerWidth <= 767 : false;
      setIsMobile((mq && mq.matches) || inner);
    };
    update();
    mq?.addEventListener?.('change', update);
    return () => mq?.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 360px)') : null;
    const update = () => {
      const inner = typeof window !== 'undefined' ? window.innerWidth <= 360 : false;
      setIsNarrow((mq && mq.matches) || inner);
    };
    update();
    mq?.addEventListener?.('change', update);
    return () => mq?.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const stopA = animate(blobA.current);
      const stopB = animate(blobB.current);
      const stopC = animate(blobC.current);
      const stopD = animate(blobD.current);
      return () => { stopA(); stopB(); stopC(); stopD(); };
    }
    [blobA, blobB, blobC, blobD].forEach((r) => { if (r.current) r.current.style.transform = ''; });
    return;
  }, [isMobile, animate]);

  return (
    <section ref={heroRef} className="min-h-[85vh] bg-background relative overflow-hidden pt-24 pb-16">
      {/* Decorative floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div ref={blobA} className={`absolute top-20 left-10 w-24 h-24 rounded-full bg-blue-400/20 blur-2xl ${isMobile ? '' : 'animate-float-sm md:animate-float'}`} />
        <div ref={blobB} className={`absolute top-40 right-20 w-40 h-40 rounded-full bg-purple-400/15 blur-3xl ${isMobile ? '' : 'animate-float-sm md:animate-float'}`} style={isMobile ? { animationDelay: '1s' } : { animationDelay: '1s' }} />
        <div ref={blobC} className={`absolute bottom-40 left-1/4 w-28 h-28 rounded-full bg-pink-400/15 blur-2xl ${isMobile ? '' : 'animate-float-sm md:animate-float'}`} style={isMobile ? { animationDelay: '2s' } : { animationDelay: '2s' }} />
        <div ref={blobD} className={`absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-cyan-400/20 blur-xl ${isMobile ? '' : 'animate-float-sm md:animate-float'}`} style={isMobile ? { animationDelay: '0.5s' } : { animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 lg:gap-4 items-center relative z-10">
        {/* Command Palette Hint */}
        <div className="absolute top-0.5 right-0 z-20 hidden sm:block">
          <div className="bg-gradient-to-r from-gray-100/95 to-gray-200/90 dark:from-gray-900/95 dark:to-black/90 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-black/20 dark:border-white/10">
            Press <kbd className="px-2 py-0.5 mx-1 bg-gray-300/60 dark:bg-gray-800/60 border border-black/20 dark:border-white/20 rounded text-xs font-mono font-semibold">Ctrl+K</kbd> to open the command palette
          </div>
        </div>

        {/* Left Content */}
        <div className={`space-y-7 ${heroVisible ? 'scroll-animate' : ''}`}>
          {/* Availability badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for Opportunities
            </div>
          </div>

          {/* Role tag with typing animation */}
          <div className="inline-block">
            {isNarrow ? (
              <div className="marquee" aria-hidden>
                <div className="marquee__inner bg-black text-white px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
                  <span>AI/ML Engineer • Deep-Tech Builder</span>
                </div>
              </div>
            ) : (
              <span className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full text-sm font-medium uppercase tracking-widest">
                {displayed}<span className="animate-pulse">|</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            Building production-ready AI systems across machine learning, computer vision, and intelligent automation.
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg" style={{ textAlign: "justify" }}>
            Hi, I'm <span className="text-foreground font-semibold">Bhavya Kansal</span>.<br />
            I architect and build scalable AI systems focused on machine learning models, multimodal applications, and deep-tech solutions for real-world engineering challenges.
          </p>

          <p className="text-sm text-muted-foreground max-w-xl" style={{ textAlign: "justify" }}>
            Based in Patiala, Punjab — pursuing B.Tech in Data Science & AI at <span className="text-foreground font-medium">TIET</span>. I thrive at the intersection of research and production-grade engineering.
          </p>

          {/* Quick stats strip */}
          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { value: "12+", label: "Projects Shipped" },
              { value: "10+", label: "AI/ML Projects" },
              { value: "1+", label: "Year Experience" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="rounded-full gap-2 px-8 py-6 text-base font-medium"
              onClick={() => {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) projectsSection.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View my work
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2 px-8 py-6 text-base font-medium border-2 border-black dark:border-white hover:bg-black hover:text-white hover:border-white dark:hover:bg-white dark:hover:text-black dark:hover:border-black"
              onClick={() => window.open('/Bhavya-Kansal-Resume.pdf', '_blank')}
            >
              View Resume
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Right Content - Profile Image */}
        <div className={`relative mt-12 lg:mt-0 ${heroVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <div className="rounded-3xl p-1 bg-white/60 dark:bg-black/30 relative">
              <img
                src="/Bhavya-Kansal-PFP.jpg?v=20260509"
                alt="Bhavya Kansal - AI Systems Architect & Developer"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-[420px] sm:h-[500px] md:h-[550px] object-cover rounded-2xl transition-transform duration-500 scale-150 sm:scale-100 sm:group-hover:scale-105"
              />
              {/* Vignette - dark mode */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none hidden dark:block"
                style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)' }}
              />
              {/* Highlight - light mode */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none block dark:hidden"
                aria-hidden
                style={{
                  background: 'radial-gradient(circle at 62% 34%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 8%, rgba(255,255,255,0.05) 18%, transparent 28%)',
                  mixBlendMode: 'screen',
                  opacity: 0.22
                }}
              />
            </div>
            {/* Bottom overlay */}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-6 text-white border-white/10">
              <p className="text-s uppercase tracking-wider mb-2 text-white/80">AVAILABLE FOR WORK</p>
              <p className="text-lg font-semibold text-white/70 mt-3">AI/ML · Research & Collaborations</p>
              <p className="text-s text-white/80 mt-3">जय श्री राम 🙏❤️</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
