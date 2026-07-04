import { useEffect, useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTiltCard } from "@/hooks/useTiltCard";

interface TimelineItem {
  date: string;
  title: string;
  company?: string;
  companyUrl?: string;
  period?: string;
  summary: string;
  tech: string[];
  logos?: string[];
  type?: "education" | "work" | "training";
}

const timelineData: TimelineItem[] = [
  {
    date: "2023 - 2026",
    title: "Diploma in Computer Science Engineering",
    company: "Thapar Polytechnic College",
    period: "2023 – 2026",
    type: "education",
    summary:
      "Built strong foundations in Python programming, data structures, algorithms, and practical software development — setting the stage for advanced AI systems engineering.",
    tech: ["Python", "DSA", "Core CS", "Software Development", "C++"],
    logos: ["/tpc_logo.png"],
  },
  {
    date: "JUN 2025 - AUG 2025",
    title: "AI/ML & Cybersecurity Trainee",
    company: "Thapar Polytechnic College",
    period: "Jun 2025 – Aug 2025",
    type: "training",
    summary:
      "Completed intensive summer training in Python, AI/ML, and cybersecurity through practical labs, model implementation workshops, and security assessment mini-projects.",
    tech: ["Python", "Machine Learning", "Cybersecurity", "Hands-on Labs"],
    logos: ["/tpc_logo.png"],
  },
  {
    date: "JAN 2026 - JUL 2026",
    title: "AI/ML Intern Trainee",
    company: "IIT & NIELIT Ropar",
    period: "Jan 2026 – Jul 2026",
    type: "work",
    summary:
      "Industrial AI/ML training at IIT Ropar & NIELIT — focused on applied machine learning workflows, model experimentation, computer vision pipelines, and real-world deployment.",
    tech: ["Deep Learning", "Applied ML", "Computer Vision", "Model Deployment", "PyTorch"],
    logos: ["/iit_logo.png", "/nielit_logo.png"],
  },
  {
    date: "JUL 2026 - JUN 2029",
    title: "B.Tech — Data Science & Artificial Intelligence",
    company: "Thapar Institute of Engineering & Technology",
    period: "Jul 2026 – Jun 2029",
    type: "education",
    summary:
      "Pursuing advanced coursework in deep learning, statistical modeling, and scalable AI engineering — with a focus on production-grade intelligent systems at one of India's premier engineering institutions.",
    tech: ["Deep Learning", "Data Science", "AI Systems", "Software Engineering", "Research"],
    logos: ["/tiet_logo.png"],
  },
];

const typeColors: Record<string, string> = {
  education: "bg-blue-500",
  work: "bg-emerald-500",
  training: "bg-amber-500",
};

const typeLabel: Record<string, string> = {
  education: "Education",
  work: "Experience",
  training: "Training",
};

/* Individual tilt card */
const TiltCard = ({ item, revealed }: { item: TimelineItem; revealed: boolean }) => {
  const { cardRef, spotRef, onMouseMove, onMouseLeave } = useTiltCard(6);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect || !cardRef.current) return;
        const ripple = document.createElement("div");
        ripple.className = "card-ripple-effect";
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        cardRef.current.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      }}
      className={`glass-card group h-full p-5 rounded-2xl border border-black/10 dark:border-white/10 relative overflow-hidden
        transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform
        ${revealed ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
    >
      <div className="card-spotlight" ref={spotRef} />

      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${typeColors[item.type || "education"]} flex-shrink-0`} />
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          {typeLabel[item.type || "education"]}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-1 font-medium tabular-nums">{item.period || item.date}</p>
      <h3 className="text-lg font-bold mb-1 text-foreground leading-snug">{item.title}</h3>

      {item.company && <p className="text-sm text-muted-foreground mb-3">{item.company}</p>}

      {item.logos && item.logos.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {item.logos.map((logo) => (
            <img
              key={logo}
              src={logo}
              alt={item.company || "Institution logo"}
              className="w-9 h-9 rounded-md object-contain border border-border bg-white p-1"
            />
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed mt-2" style={{ textAlign: "justify" }}>
        {item.summary}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tech.map((tag) => (
          <span
            key={tag}
            className="tech-chip inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-muted/80 text-foreground font-medium border border-transparent hover:border-foreground/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Timeline = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [maxProgress, setMaxProgress] = useState(0);
  const total = timelineData.length;

  useEffect(() => {
    const el = sectionRef.current;
    if (typeof window === "undefined" || !el) return;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setProgress(1);
      setMaxProgress(1);
      return;
    }

    let active = false;

    const onScroll = () => {
      if (!active) return;
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return; // Ignore unrendered states

      const vh = window.innerHeight;
      const start = vh * 0.90;
      const end = vh * 0.25;
      
      const distance = start - end;
      const current = start - rect.top;
      
      let p = current / distance;
      p = Math.max(0, Math.min(1, p));
      
      setProgress(p);
      setMaxProgress((prev) => Math.max(prev, p));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        active = entry.isIntersecting;
        if (active) {
          onScroll();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const fillPct = progress * 100;

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 px-6 lg:px-8 relative overflow-hidden" id="timeline">
      <div className="aurora-bg" aria-hidden />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          ref={titleRef}
          className={`${titleVisible ? "scroll-animate" : "opacity-0"} text-center mb-16 lg:mb-24`}
        >
          <span className="eyebrow justify-center">The Journey</span>
          <h2 className="display-heading text-5xl md:text-6xl lg:text-7xl font-bold mt-4">Tracing the Arc</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            From foundations to frontier — revealed right to left, the way the story was built.
          </p>
        </div>

        {/* ── Desktop — right-to-left horizontal flow ── */}
        <div className="hidden lg:block relative mt-8">
          {/* Base track */}
          <div className="absolute top-8 left-0 right-0 h-px bg-border" />
          {/* Right-to-left glowing fill (hardware-accelerated scaleX) */}
          <div
            className="absolute top-8 right-0 h-px bg-gradient-to-l from-accent via-primary to-accent transition-transform duration-500 ease-out"
            style={{
              width: "100%",
              transform: `scaleX(${fillPct / 100})`,
              transformOrigin: "right",
              willChange: "transform",
              boxShadow: "0 0 12px hsl(var(--accent) / 0.6)"
            }}
          />

          <div className="grid grid-cols-4 gap-8 relative items-stretch">
            {timelineData.map((item, originalIndex) => {
              // total is 4. indices: 0 (left), 1, 2, 3 (right)
              // right-to-left reveal: index 3 (reversedIndex = 0) reveals first
              const reversedIndex = total - 1 - originalIndex;
              const threshold = 0.15 + (reversedIndex * 0.25);
              const revealed = maxProgress >= threshold;
              
              return (
                <div key={item.period || item.date} className="relative flex flex-col">
                  {/* Node */}
                  <div className="relative flex justify-center mb-8">
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                        revealed
                          ? `${typeColors[item.type || "education"]} border-white/40 shadow-lg scale-125`
                          : "bg-background border-border scale-75 opacity-0"
                      }`}
                      style={revealed ? { boxShadow: "0 0 14px 2px currentColor" } : undefined}
                    />
                  </div>
                  <TiltCard item={item} revealed={revealed} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile — vertical, reveals as you scroll ── */}
        <div className="lg:hidden relative pl-8 mt-8">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div
            className="absolute left-4 top-0 w-px bg-gradient-to-b from-accent via-primary to-accent transition-all duration-500 ease-out"
            style={{
              height: "100%",
              transform: `scaleY(${fillPct / 100})`,
              transformOrigin: "top",
              willChange: "transform",
              boxShadow: "0 0 12px hsl(var(--accent) / 0.6)"
            }}
          />

          <div className="space-y-12">
            {/* Newest first on mobile (reverse chronological) */}
            {[...timelineData].reverse().map((item, index) => {
              const threshold = index / total;
              const revealed = maxProgress >= threshold;
              
              return (
                <div key={item.period || item.date} className="relative">
                  <div className="absolute -left-[26px] top-4">
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                        revealed
                          ? `${typeColors[item.type || "education"]} border-white/40 shadow-lg scale-125`
                          : "bg-background border-border scale-75 opacity-0"
                      }`}
                    />
                  </div>
                  <div className="ml-4">
                    <TiltCard item={item} revealed={revealed} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
