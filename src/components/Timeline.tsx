import { useEffect, useRef, useState, useCallback } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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

/* ── 3D Tilt hook for individual cards ── */
function useTiltCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -6;
    const ry = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    if (spotRef.current) spotRef.current.style.opacity = '1';
  }, []);

  const onMouseLeave = useCallback(() => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    if (spotRef.current) spotRef.current.style.opacity = '0';
  }, []);

  return { ref, spotRef, onMouseMove, onMouseLeave };
}

/* Individual tilt card component */
const TiltCard = ({ item, index, isVisible }: { item: TimelineItem; index: number; isVisible: boolean }) => {
  const { ref, spotRef, onMouseMove, onMouseLeave } = useTiltCard();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect || !ref.current) return;
        const ripple = document.createElement('div');
        ripple.className = 'card-ripple-effect';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        ref.current.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      }}
      className={`glass-card p-5 rounded-2xl border border-black/10 dark:border-gray-700/60 relative overflow-hidden
        ${isVisible ? `scroll-animate scroll-animate-delay-${Math.min(index + 1, 5)}` : 'opacity-0'}`}
    >
      <div className="card-spotlight" ref={spotRef} />

      {/* Type badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${typeColors[item.type || 'education']} flex-shrink-0`} />
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          {item.type === 'education' ? 'Education' : item.type === 'work' ? 'Experience' : 'Training'}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-1 font-medium">{item.period || item.date}</p>
      <h3 className="text-lg font-bold mb-1 text-foreground leading-snug">{item.title}</h3>

      {item.company && (
        <p className="text-sm text-muted-foreground mb-3">
          {item.company}
        </p>
      )}

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

      <p
        className="text-sm text-muted-foreground leading-relaxed mt-2"
        style={{ textAlign: "justify" }}
        dangerouslySetInnerHTML={{ __html: item.summary }}
      />

      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tech.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-muted/80 text-foreground font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Timeline = () => {
  const { ref, isVisible } = useScrollAnimation();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState(0);

  // Reveal cards one-by-one from RIGHT to LEFT
  useEffect(() => {
    if (!isVisible) return;
    if (visibleItems >= timelineData.length) return;

    // Reveal from the rightmost (last) item first, then cascade left
    const timer = window.setTimeout(() => {
      setVisibleItems((prev) => Math.min(prev + 1, timelineData.length));
    }, 280);

    return () => window.clearTimeout(timer);
  }, [isVisible, visibleItems]);

  // Progress is measured right-to-left
  const scrollProgress = (visibleItems / timelineData.length) * 100;

  return (
    <section
      ref={timelineRef}
      className="py-16 px-6 lg:px-8 relative overflow-hidden"
      id="timeline"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div
          ref={ref}
          className={`${isVisible ? "scroll-animate" : "opacity-0"} flex items-center justify-center gap-8 mb-20 flex-wrap`}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center">
            Tracing the Arc...
          </h2>
        </div>

        {/* ── Desktop Timeline — RIGHT to LEFT horizontal flow ── */}
        <div className="hidden lg:block relative">
          {/* Background track */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-border" />

          {/* Animated progress line: fills from RIGHT to LEFT */}
          <div
            className="absolute top-8 right-0 h-0.5 bg-gradient-to-l from-accent via-primary to-accent transition-all duration-500 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />

          {/* Cards in REVERSED display order (newest on right, oldest on left) */}
          <div className="grid grid-cols-4 gap-8 relative items-stretch">
            {[...timelineData].reverse().map((item, index) => {
              // Index 0 = rightmost (newest), reveals first
              const revealIndex = index;
              const isItemVisible = revealIndex < visibleItems;

              return (
                <div key={item.period || item.date} className="relative">
                  {/* Dot */}
                  <div className="relative flex justify-center mb-8">
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                        isItemVisible
                          ? `${typeColors[item.type || 'education']} border-current shadow-lg scale-125`
                          : "bg-background border-border"
                      }`}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className={`transition-all duration-700 ${
                      isItemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                  >
                    <TiltCard item={item} index={revealIndex} isVisible={isItemVisible} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile Timeline — vertical, reveals top to bottom ── */}
        <div className="lg:hidden relative pl-8">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div
            className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-accent via-primary to-accent transition-all duration-500 ease-out"
            style={{ height: `${scrollProgress}%` }}
          />

          <div className="space-y-10">
            {/* On mobile keep chronological order (oldest first) */}
            {timelineData.map((item, index) => {
              const isItemVisible = (timelineData.length - 1 - index) < visibleItems;
              return (
                <div key={item.period || item.date} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-[26px] top-4">
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                        isItemVisible
                          ? `${typeColors[item.type || 'education']} border-current shadow-lg scale-125`
                          : "bg-background border-border"
                      }`}
                    />
                  </div>

                  <div
                    className={`transition-all duration-700 ml-4 ${
                      isVisible ? `scroll-animate scroll-animate-delay-${Math.min(index + 1, 5)}` : "opacity-0"
                    }`}
                  >
                    <TiltCard item={item} index={index} isVisible={isVisible} />
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