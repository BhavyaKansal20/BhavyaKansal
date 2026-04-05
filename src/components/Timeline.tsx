import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
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
}

const timelineData: TimelineItem[] = [
  {
    date: "2023 - 2026",
    title: "Diploma in Computer Science Engineering",
    company: "Thapar Polytechnic College",
    period: "2023 - 2026",
    summary:
      "Built strong foundations in Python programming, data structures, and practical software development before transitioning to advanced AI systems.",
    tech: ["Python", "DSA", "Core CS", "Software Development"],
    logos: ["/tpc_logo.png"],
  },
  {
    date: "JUN 2025 - AUG 2025",
    title: "AI/ML & Cybersecurity Trainee",
    company: "Thapar Polytechnic College",
    period: "JUN 2025 - AUG 2025",
    summary:
      "Completed intensive summer training in Python, AI/ML, and cybersecurity through practical labs and mini-project implementation.",
    tech: ["Python", "Machine Learning", "Cybersecurity", "Hands-on Labs"],
    logos: ["/tpc_logo.png"],
  },
  {
    date: "JAN 2026 - JUL 2026",
    title: "AI/ML Intern Trainee",
    company: "IIT & NIELIT Ropar",
    period: "JAN 2026 - JUL 2026",
    summary:
      "Industrial AI/ML training focused on applied machine learning workflows, model experimentation, and real-world deployment pipelines.",
    tech: ["Deep Learning", "Applied ML", "Computer Vision", "Model Deployment"],
    logos: ["/iit_logo.png", "/nielit_logo.png"],
  },
  {
    date: "JUL 2026 - JUN 2029",
    title: "B.Tech in Data Science & Artificial Intelligence",
    company: "Thapar Institute of Engineering & Technology",
    period: "JUL 2026 - JUN 2029",
    summary:
      "Pursuing advanced coursework in deep learning, statistical modeling, and scalable AI engineering with a focus on production-grade intelligent systems.",
    tech: ["Deep Learning", "Data Science", "AI Systems", "Software Engineering"],
    logos: ["/tiet_logo.png"],
  },
];

function renderCompany(company?: string) {
  if (!company) return null;
  return company
    .replace(/RoomsonRent/gi, (m) => `<span class="text-accent font-semibold">${m}</span>`)
    .replace(/RoadIntelligence/gi, (m) => `<span class="text-accent font-semibold">${m}</span>`);
}

const Timeline = () => {
  const { ref, isVisible } = useScrollAnimation();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleItems, setVisibleItems] = useState(0);
  const [hasPassedProjects, setHasPassedProjects] = useState(false);
  const [hasStartedAutoReveal, setHasStartedAutoReveal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight && elementTop > -elementHeight) {
        const progress = Math.max(
          0,
          Math.min(100, ((windowHeight - elementTop) / (windowHeight + elementHeight)) * 100)
        );
        setScrollProgress(progress);
      }

      if (!hasStartedAutoReveal && elementTop < windowHeight * 0.75 && elementTop > -elementHeight * 0.25) {
        setHasStartedAutoReveal(true);
      }

      if (!hasPassedProjects) {
        const projectsEl =
          document.getElementById("projects") ||
          (document.querySelector('[data-section="projects"]') as HTMLElement | null);
        if (projectsEl) {
          const projBottom = projectsEl.getBoundingClientRect().bottom + window.scrollY;
          if (window.scrollY > projBottom) {
            setHasPassedProjects(true);
            setVisibleItems(timelineData.length);
            setScrollProgress(100);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasPassedProjects, hasStartedAutoReveal]);

  useEffect(() => {
    if (!hasStartedAutoReveal) return;

    if (visibleItems >= timelineData.length) {
      setScrollProgress(100);
      return;
    }

    const timer = window.setTimeout(() => {
      setVisibleItems((prev) => Math.min(prev + 1, timelineData.length));
    }, 650);

    return () => window.clearTimeout(timer);
  }, [hasStartedAutoReveal, visibleItems]);

  useEffect(() => {
    if (hasStartedAutoReveal) {
      setScrollProgress((visibleItems / timelineData.length) * 100);
    }
  }, [hasStartedAutoReveal, visibleItems]);

  return (
    <section
      ref={timelineRef}
      className="py-0 px-6 lg:px-8 relative overflow-hidden"
      id="timeline"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title with intern badge */}
        <div ref={ref} className={`${isVisible ? "scroll-animate" : "opacity-0"} flex items-center justify-center gap-8 mb-20 flex-wrap`}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center">
            Tracing the Arc...
          </h2>
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block relative">
          {/* Background Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-border" />

          {/* Animated Progress Line */}
          <div
            className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-accent via-primary to-accent transition-all duration-300 ease-out"
            style={{ width: `${(visibleItems / timelineData.length) * 100}%` }}
          />

          {/* Timeline Items */}
          <div className="grid grid-cols-4 gap-8 relative items-stretch">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`relative transition-all duration-700 ${
                  index < visibleItems ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                {/* Dot */}
                <div className="relative flex justify-center mb-8">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                      index < visibleItems
                        ? "bg-accent border-accent shadow-lg shadow-accent/50 scale-125"
                        : "bg-background border-border"
                    }`}
                  />
                </div>

                {/* Content Card */}
                <div className="glass-card p-4 rounded-xl group cursor-default border border-black/60 dark:border-gray-400 transition-transform duration-200 ease-out transform hover:-translate-y-1 hover:shadow-lg bg-white/5 dark:bg-white/3 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.period || item.date}</p>
                      <h3 className="text-xl font-bold mb-1 text-foreground">{item.title}</h3>
                      {item.company && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.companyUrl ? (
                            <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline relative pr-6">
                              <span dangerouslySetInnerHTML={{ __html: renderCompany(item.company) as string }} />
                              <ArrowRight className="absolute top-0 right-0 w-5 h-5 -rotate-45 text-accent" />
                            </a>
                          ) : (
                            <>{item.company}</>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

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

                  <p className="text-sm text-muted-foreground leading-relaxed mt-2" dangerouslySetInnerHTML={{ __html: item.summary }} />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tech.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted/80 text-foreground font-medium dark:bg-muted/70 dark:text-foreground"
                        style={{ borderRadius: "9999px" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="lg:hidden relative pl-8">
          {/* Background Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          {/* Animated Progress Line */}
          <div
            className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-accent via-primary to-accent transition-all duration-300 ease-out"
            style={{ height: `${scrollProgress}%` }}
          />

          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`relative ${
                  isVisible ? `scroll-animate scroll-animate-delay-${index + 1}` : "opacity-0"
                }`}
              >
                {/* Dot */}
                <div className="absolute -left-[26px] top-0">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                      index < visibleItems
                        ? "bg-accent border-accent shadow-lg shadow-accent/50 scale-125"
                        : "bg-background border-border"
                    }`}
                  />
                </div>

                {/* Content Card */}
                <div className="glass-card p-6 rounded-xl group cursor-default border border-black/60 dark:border-gray-400 ml-4">
                  <p className="text-sm text-muted-foreground">{item.period || item.date}</p>
                  <h3 className="text-xl font-bold mb-1 text-foreground">{item.title}</h3>
                  {item.company && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.companyUrl ? (
                        <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline relative pr-6">
                          <span dangerouslySetInnerHTML={{ __html: renderCompany(item.company) as string }} />
                          <ArrowRight className="absolute top-0 right-0 w-5 h-5 -rotate-45 text-accent" />
                        </a>
                      ) : (
                        <>{item.company}</>
                      )}
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

                  <p className="text-sm text-muted-foreground leading-relaxed mt-1" dangerouslySetInnerHTML={{ __html: item.summary }} />

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tech.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted/80 text-foreground font-medium dark:bg-muted/70 dark:text-foreground"
                        style={{ borderRadius: "9999px" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;