import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { ExternalLink, Github, Star, ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { projectsData, type Project } from "@/data/projects";
import ProjectDetailModal from "@/components/ProjectDetailModal";

type ProjectGroup = "All" | "Live Projects" | "Codes" | "ML/Datasets";

const filterGroups: ProjectGroup[] = ["All", "Live Projects", "Codes", "ML/Datasets"];

/* ── Tech stack icon system ── */
const techMeta: Record<string, { color: string; abbr: string }> = {
  Python: { color: "#3776AB", abbr: "Py" },
  PyTorch: { color: "#EE4C2C", abbr: "PT" },
  Flask: { color: "#61DAFB", abbr: "Fl" },
  "Scikit-learn": { color: "#F7931E", abbr: "Sk" },
  TensorFlow: { color: "#FF6F00", abbr: "TF" },
  Keras: { color: "#D00000", abbr: "Kr" },
  MediaPipe: { color: "#0F9D58", abbr: "MP" },
  Gradio: { color: "#F97316", abbr: "Gr" },
  Streamlit: { color: "#FF4B4B", abbr: "St" },
  OpenCV: { color: "#5C3EE8", abbr: "CV" },
  LSTM: { color: "#8B5CF6", abbr: "LS" },
  Jupyter: { color: "#F37626", abbr: "Jp" },
  SQLite: { color: "#003B57", abbr: "SQ" },
  ReportLab: { color: "#2563EB", abbr: "RL" },
  DeOldify: { color: "#A78BFA", abbr: "DO" },
  GFPGAN: { color: "#EC4899", abbr: "GF" },
  "Real-ESRGAN": { color: "#14B8A6", abbr: "RE" },
  "Hugging Face Spaces": { color: "#FFD21E", abbr: "HF" },
  "Socket.IO": { color: "#010101", abbr: "IO" },
  FER: { color: "#7C3AED", abbr: "FE" },
  NLP: { color: "#06B6D4", abbr: "NL" },
  "Telegram Bot API": { color: "#26A5E4", abbr: "TG" },
  Pandas: { color: "#150458", abbr: "Pd" },
  NumPy: { color: "#4DABCF", abbr: "Np" },
  Matplotlib: { color: "#11557C", abbr: "Mp" },
  "python-telegram-bot": { color: "#26A5E4", abbr: "TB" },
  "Tesseract OCR": { color: "#4285F4", abbr: "OC" },
  Cryptography: { color: "#059669", abbr: "Cr" },
  "SHA-256": { color: "#059669", abbr: "#" },
  EfficientNet: { color: "#4F46E5", abbr: "EN" },
  "EfficientNet-B4": { color: "#4F46E5", abbr: "E4" },
};

const TechIcon = ({ name }: { name: string }) => {
  const meta = techMeta[name] || { color: "#94a3b8", abbr: name.slice(0, 2) };
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase transition-all duration-200 hover:scale-105"
      style={{
        background: `${meta.color}18`,
        color: meta.color,
        border: `1px solid ${meta.color}30`,
      }}
      title={name}
    >
      <span
        className="w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-black text-white"
        style={{ background: meta.color }}
      >
        {meta.abbr.slice(0, 2)}
      </span>
      <span className="hidden sm:inline">{name.length > 12 ? name.slice(0, 10) + "…" : name}</span>
    </div>
  );
};

/* ── Category accent system ── */
const categoryAccents: Record<string, { accent: string; glow: string; ring: string; label: string }> = {
  "Live Projects": {
    accent: "#34d399",
    glow: "rgba(52,211,153,0.25)",
    ring: "rgba(52,211,153,0.35)",
    label: "Live Projects",
  },
  Codes: {
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.25)",
    ring: "rgba(96,165,250,0.35)",
    label: "Codes",
  },
  "ML/Datasets": {
    accent: "#c084fc",
    glow: "rgba(192,132,252,0.25)",
    ring: "rgba(192,132,252,0.35)",
    label: "ML/Datasets",
  },
};

/* ── Per-project accent overrides ── */
const projectAccents: Record<string, string> = {
  "healthy-ai": "#34d399",
  "chromacrystal-uhd": "#c084fc",
  "signlang-ai": "#67e8f9",
  "deepfake-scanner": "#f87171",
  "ml-house-price-prediction": "#fbbf24",
  "retinex-ai": "#f43f5e",
  "aagni-assistant": "#60a5fa",
  "immutable-doc-verify": "#a78bfa",
  "neurolock-ai": "#f472b6",
  "machine-learning": "#818cf8",
  "deep-learning": "#fb923c",
  "datasets": "#94a3b8",
};

const featuredKeys = new Set(["Healthy AI", "ChromaCrystal UHD", "SignLang AI", "DeepFake Scanner", "ML House Price Prediction", "RetiNex AI"]);
const preferredProjectOrder = [
  "healthy-ai",
  "chromacrystal-uhd",
  "aagni-assistant",
  "deepfake-scanner",
  "signlang-ai",
  "ml-house-price-prediction",
  "retinex-ai",
  "machine-learning",
  "deep-learning",
  "datasets",
  "immutable-doc-verify",
  "neurolock-ai",
];

/* ── Intersection Observer hook for staggered entrance ── */
function useStaggeredReveal(count: number) {
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const observers = useRef<Map<number, IntersectionObserver>>(new Map());

  const setRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    // Clean up old observer for this index
    observers.current.get(index)?.disconnect();
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible((prev) => new Set(prev).add(index));
          }, index * 80); // stagger delay
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    observers.current.set(index, obs);
  }, []);

  useEffect(() => {
    return () => {
      observers.current.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Reset when count changes (filter change)
  useEffect(() => {
    setVisible(new Set());
  }, [count]);

  return { visible, setRef };
}

/* ══════════════════════════════════════════════════════ */
/*                    MAIN COMPONENT                     */
/* ══════════════════════════════════════════════════════ */

const Projects = () => {
  const { ref: projectsRef, isVisible: projectsVisible } = useScrollAnimation();
  const [filter, setFilter] = useState<ProjectGroup>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const displayedProjects = useMemo(() => {
    const items = projectsData.filter((project) => filter === "All" || project.category === filter);
    const orderIndex = new Map(preferredProjectOrder.map((id, index) => [id, index]));
    return items.slice().sort((a, b) => {
      const aOrder = orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return projectsData.indexOf(a) - projectsData.indexOf(b);
    });
  }, [filter]);

  const { visible: visibleCards, setRef: setCardRef } = useStaggeredReveal(displayedProjects.length);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { All: projectsData.length };
    projectsData.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <section id="projects" ref={projectsRef} className="py-24 bg-background relative overflow-hidden">
      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes proj-scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(calc(100% + 256px)); opacity: 0; }
        }
        @keyframes proj-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes proj-pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes proj-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes proj-fade-up {
          0% { opacity: 0; transform: translateY(32px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes proj-glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .proj-card {
          opacity: 0;
          transform: translateY(32px) scale(0.97);
        }
        .proj-card.proj-visible {
          animation: proj-fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .proj-card:hover .proj-image {
          transform: scale(1.08);
          filter: brightness(1.1);
        }
        .proj-card:hover .proj-scan-bar {
          animation: proj-scan 1.8s ease-in-out infinite;
        }
        .proj-card:hover .proj-glow-border {
          opacity: 1;
        }
        .proj-card:hover {
          transform: translateY(-8px) scale(1);
        }
        .proj-card.proj-visible:hover {
          transform: translateY(-8px) scale(1);
        }
        .proj-featured-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.3) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: proj-shimmer 2s ease-in-out infinite;
        }
      `}</style>

      {/* ── Background subtle pattern ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ── Section Header ── */}
        <div className={`mb-14 ${projectsVisible ? "scroll-animate" : ""}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-muted-foreground/40" />
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium">
              Projects
            </p>
            <div className="h-px flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-muted-foreground/40" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Selected Work</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Production-grade AI systems, live deployments, and research implementations.
          </p>

          {/* ── Filter Tabs ── */}
          <div className="flex justify-start overflow-x-auto pb-2 sm:pb-0 mt-8">
            <div className="inline-flex items-center bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-200/60 dark:border-gray-700/30 shadow-sm min-w-max gap-1">
              {filterGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setFilter(group)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                    filter === group
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {group}
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                      filter === group
                        ? "bg-background/20 text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {filterCounts[group] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Project Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => {
            const isLive = Boolean(project.liveUrl);
            const isFeatured = featuredKeys.has(project.title);
            const isCardVisible = visibleCards.has(index);

            return (
              <div
                key={project.id}
                ref={setCardRef(index)}
                onClick={() => setSelectedProject(project)}
                className={`group relative flex flex-col rounded-[24px] overflow-hidden cursor-pointer bg-card/40 border border-border/40 hover:border-border/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                  isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
              >
                {/* ── Top Image Area ── */}
                <div className="relative h-60 overflow-hidden bg-muted/30">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${project.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80" />
                  
                  {isFeatured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-md text-xs font-medium text-foreground border border-border/50">
                        <Star className="w-3.5 h-3.5 fill-foreground" />
                        Featured
                      </span>
                    </div>
                  )}

                  {isLive && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        Live
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Content Area ── */}
                <div className="flex flex-col flex-grow p-6 lg:p-8 bg-gradient-to-b from-background/90 to-background/50 backdrop-blur-xl">
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      {project.category}
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-3 py-1 text-xs font-medium bg-secondary/30 text-muted-foreground rounded-lg">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/40">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        {project.liveUrl ? "Code" : "Repository"}
                      </a>
                    )}
                    <div className="flex-1" />
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default Projects;
