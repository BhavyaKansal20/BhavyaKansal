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
    title: "AI/ML Intern",
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
    title: "B.E — Data Science & Artificial Intelligence",
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

const TimelineItemDesktop = ({ item, index, total }: { item: TimelineItem, index: number, total: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  const reverseIdx = total - 1 - index;
  const delayMs = reverseIdx * 350;

  return (
    <div className="flex-1 flex flex-col items-center group relative min-w-[280px]">
      <div 
        ref={ref}
        className="w-full flex-1 pt-8 px-4 transition-all duration-700 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(40px)",
          transitionDelay: `${delayMs}ms`
        }}
      >
        <TiltCard item={item} revealed={isVisible} />
      </div>
      
      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
        <div
          className={`w-5 h-5 rounded-full border-2 transition-all duration-500 bg-background ${
            isVisible 
              ? `${typeColors[item.type || "education"]} border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-110` 
              : "border-border scale-75 opacity-50"
          }`}
          style={{ transitionDelay: `${delayMs}ms` }}
        />
        <div 
          className={`h-8 w-px transition-all duration-500 bg-gradient-to-b ${
            isVisible ? "from-white/20 to-transparent" : "from-border to-transparent opacity-0"
          }`}
          style={{ transitionDelay: `${delayMs}ms` }}
        />
      </div>
    </div>
  );
};

const TimelineItemMobile = ({ item }: { item: TimelineItem }) => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div ref={ref} className="relative">
      <div className="absolute -left-[26px] top-4">
        <div
          className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
            isVisible
              ? `${typeColors[item.type || "education"]} border-white/40 shadow-lg scale-125`
              : "bg-background border-border scale-75 opacity-0"
          }`}
        />
      </div>
      <div 
        className="ml-4 transition-all duration-700 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)"
        }}
      >
        <TiltCard item={item} revealed={isVisible} />
      </div>
    </div>
  );
};

const Timeline = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: trackRef, isVisible: trackVisible } = useScrollAnimation();
  const total = timelineData.length;

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8 relative overflow-hidden" id="timeline">
      <div className="aurora-bg" aria-hidden />
      <div className="max-w-7xl mx-auto relative z-10">
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

        <div className="hidden lg:block relative mt-8">
          <div className="absolute top-8 left-0 right-0 h-px bg-border" />
          
          <div
            ref={trackRef}
            className="absolute top-8 left-0 right-0 h-px bg-gradient-to-l from-accent via-primary to-accent transition-transform duration-1000 ease-out origin-right"
            style={{ 
              transform: `scaleX(${trackVisible ? 1 : 0})`,
              willChange: "transform",
              boxShadow: "0 0 12px hsl(var(--accent) / 0.6)"
            }}
          />

          <div className="flex justify-between items-start pt-6 gap-6 relative z-10">
            {[...timelineData].reverse().map((item, index) => (
              <TimelineItemDesktop key={item.period || item.date} item={item} index={index} total={total} />
            ))}
          </div>
        </div>

        <div className="lg:hidden relative pl-8 mt-8">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div
            className="absolute left-4 top-0 w-px bg-gradient-to-b from-accent via-primary to-accent transition-all duration-1000 ease-out origin-top"
            style={{
              height: "100%",
              transform: `scaleY(${trackVisible ? 1 : 0})`,
              willChange: "transform",
              boxShadow: "0 0 12px hsl(var(--accent) / 0.6)"
            }}
          />

          <div className="space-y-12">
            {[...timelineData].reverse().map((item) => (
              <TimelineItemMobile key={item.period || item.date} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
