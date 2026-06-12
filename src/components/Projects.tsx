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
  "aagni-assistant": "#60a5fa",
  "immutable-doc-verify": "#a78bfa",
  "neurolock-ai": "#f472b6",
  "machine-learning": "#818cf8",
  "deep-learning": "#fb923c",
  "datasets": "#94a3b8",
};

const featuredKeys = new Set(["Healthy AI", "ChromaCrystal UHD", "SignLang AI", "DeepFake Scanner", "ML House Price Prediction"]);
const preferredProjectOrder = [
  "healthy-ai",
  "chromacrystal-uhd",
  "deepfake-scanner",
  "signlang-ai",
  "ml-house-price-prediction",
  "machine-learning",
  "deep-learning",
  "datasets",
  "aagni-assistant",
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
            const catStyle = categoryAccents[project.category] || {
              accent: "#94a3b8",
              glow: "rgba(148,163,184,0.25)",
              ring: "rgba(148,163,184,0.35)",
              label: project.category,
            };
            const accent = projectAccents[project.id] || catStyle.accent;
            const isLive = Boolean(project.liveUrl);
            const isFeatured = featuredKeys.has(project.title);
            const isCardVisible = visibleCards.has(index);
            const isHovered = hoveredCard === project.id;

            return (
              <div
                key={project.id}
                ref={setCardRef(index)}
                onClick={() => setSelectedProject(project)}
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`proj-card group relative rounded-2xl overflow-hidden cursor-pointer border border-border/60 bg-background/80 backdrop-blur-sm ${
                  isCardVisible ? "proj-visible" : ""
                }`}
                style={{
                  animationDelay: `${index * 80}ms`,
                  transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.4s ease",
                  boxShadow: isHovered
                    ? `0 20px 60px -15px ${accent}40, 0 0 0 1px ${accent}30`
                    : "0 4px 20px -5px rgba(0,0,0,0.1)",
                  borderColor: isHovered ? `${accent}50` : undefined,
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
                {/* ── Glow border on hover ── */}
                <div
                  className="proj-glow-border absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-500 z-10"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${accent}20 0%, transparent 60%)`,
                  }}
                />

                {/* ── Top accent line ── */}
                <div
                  className="absolute inset-x-0 top-0 h-[2px] z-20"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                    opacity: isHovered ? 1 : 0.5,
                    transition: "opacity 0.3s",
                  }}
                />

                {/* ── Featured badge ── */}
                {isFeatured && (
                  <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-black/70 dark:bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/10">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>Featured</span>
                    <div className="absolute inset-0 rounded-full proj-featured-shimmer pointer-events-none" />
                  </div>
                )}

                {/* ── Live status badge ── */}
                {isLive && (
                  <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    Live
                  </div>
                )}

                {/* ── Hero Image Area ── */}
                <div className="relative overflow-hidden h-52 bg-slate-950">
                  {/* Background gradient */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${accent}15 0%, rgba(15,23,42,1) 60%)`,
                    }}
                  />

                  {/* Project image */}
                  <div
                    className="proj-image absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                    style={{
                      backgroundImage: `url('${project.image}')`,
                      opacity: isHovered ? 0.55 : 0.3,
                    }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                  {/* Animated scan bar on hover */}
                  <div
                    className="proj-scan-bar absolute left-0 right-0 top-0 h-[2px] pointer-events-none z-10"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                      boxShadow: `0 0 20px ${accent}80`,
                      opacity: 0,
                    }}
                  />

                  {/* Floating glow orb */}
                  <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
                      animation: "proj-glow-pulse 3s ease-in-out infinite",
                    }}
                  />

                  {/* Center content */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
                    <div className="text-center space-y-2">
                      <div
                        className="text-[10px] uppercase tracking-[0.4em] font-bold"
                        style={{ color: `${accent}CC` }}
                      >
                        {catStyle.label}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom metrics chips */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap gap-1.5">
                      {project.metrics.slice(0, 3).map((metric, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white/90 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-white/10"
                        >
                          <span style={{ color: accent }}>{metric.value}</span>
                          <span className="text-white/50">·</span>
                          <span className="text-white/70">{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Card Body ── */}
                <div className="p-5 space-y-4 bg-background">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack Row */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <TechIcon key={tech} name={tech} />
                    ))}
                    {project.techStack.length > 5 && (
                      <div className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold text-muted-foreground bg-muted/50 border border-border">
                        +{project.techStack.length - 5}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white tracking-wider uppercase px-3.5 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                        style={{
                          background: accent,
                          boxShadow: `0 2px 10px ${accent}40`,
                        }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-foreground tracking-wider uppercase px-3.5 py-2 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-foreground/30 transition-all duration-200"
                      >
                        <Github className="w-3.5 h-3.5" />
                        {project.liveUrl ? "Code" : "Repo"}
                      </a>
                    )}
                    <div className="flex-1" />
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
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
