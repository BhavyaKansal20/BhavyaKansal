import { useMemo, useState } from "react";
import { ExternalLink, Github, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { projectsData, type Project } from "@/data/projects";
import ProjectDetailModal from "@/components/ProjectDetailModal";

type ProjectGroup = "All" | "Live Projects" | "Codes" | "ML/Datasets";

const filterGroups: ProjectGroup[] = ["All", "Live Projects", "Codes", "ML/Datasets"];

const groupStyles: Record<string, { ring: string; accent: string; label: string; badge: string }> = {
  "Live Projects": {
    ring: "rgba(16,185,129,0.28)",
    accent: "#34d399",
    label: "Live Projects",
    badge: "from-emerald-500/20 via-emerald-400/10 to-transparent",
  },
  Codes: {
    ring: "rgba(59,130,246,0.28)",
    accent: "#60a5fa",
    label: "Codes",
    badge: "from-sky-500/20 via-cyan-400/10 to-transparent",
  },
  "ML/Datasets": {
    ring: "rgba(168,85,247,0.28)",
    accent: "#c084fc",
    label: "ML/Datasets",
    badge: "from-purple-500/20 via-fuchsia-400/10 to-transparent",
  },
};

const featuredKeys = new Set(["Healthy AI", "SignLang AI", "DeepFake Scanner"]);

const Projects = () => {
  const { ref: projectsRef, isVisible: projectsVisible } = useScrollAnimation();
  const [filter, setFilter] = useState<ProjectGroup>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const displayedProjects = useMemo(() => {
    const items = projectsData.filter((project) => filter === "All" || project.category === filter);
    return items.slice().sort((a, b) => {
      const aFeatured = featuredKeys.has(a.title);
      const bFeatured = featuredKeys.has(b.title);
      if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;
      return projectsData.indexOf(a) - projectsData.indexOf(b);
    });
  }, [filter]);

  return (
    <section id="projects" ref={projectsRef} className="py-24 bg-background relative overflow-hidden">
      <style>{`
        @keyframes project-scan {
          0% { transform: translateY(-120%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(120%); opacity: 0; }
        }
        @keyframes project-glow {
          0%, 100% { opacity: 0.45; transform: scaleX(0.9); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        .project-card-shell {
          transition: transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease;
        }
        .project-card-shell:hover {
          transform: translateY(-8px);
        }
        .project-card-shell:hover .project-scan-line {
          opacity: 1;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className={`mb-12 ${projectsVisible ? "scroll-animate" : ""}`}>
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Projects
          </p>
          <h2 className="text-5xl font-bold mb-8" >Selected work</h2>

          <div className="flex justify-start overflow-x-auto pb-2 sm:pb-0">
            <div className="inline-flex items-center bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-full p-1.5 border border-gray-200/60 dark:border-gray-700/30 shadow-sm min-w-max">
              {filterGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setFilter(group)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    filter === group
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => {
            const isSignLang = project.title === "SignLang AI";
            const style = groupStyles[project.category] || {
              ring: "rgba(148,163,184,0.24)",
              accent: "#94a3b8",
              label: project.category,
              badge: "from-slate-500/20 via-slate-400/10 to-transparent",
            };
            const isLive = Boolean(project.liveUrl);

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`project-card-shell group glass-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-border relative ${
                  projectsVisible ? `scroll-animate scroll-animate-delay-${Math.min((index % 3) + 1, 3)}` : ""
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.badge} opacity-80`}
                  style={{ boxShadow: `0 0 18px ${style.ring}` }}
                />

                {featuredKeys.has(project.title) && (
                  <div className="absolute top-4 left-4 z-30 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/20 backdrop-blur-md flex items-center gap-1.5">
                    <Star className="w-3 h-3" /> Featured
                  </div>
                )}

                <div className="relative overflow-hidden h-64 bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900" />
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
                    style={{ backgroundImage: `url('${project.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  {isSignLang && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-x-8 top-10 h-24 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
                      <div
                        className="absolute left-1/2 top-6 h-44 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/80 to-transparent opacity-70"
                        style={{ animation: "project-scan 2.1s ease-in-out infinite" }}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="project-scan-line absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-0"
                      style={{ animation: isSignLang ? "project-scan 2.1s ease-in-out infinite" : "project-scan 3s ease-in-out infinite" }}
                    />
                    <div
                      className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      style={{ animation: isSignLang ? "project-glow 1.8s ease-in-out infinite" : "project-glow 2.4s ease-in-out infinite" }}
                    />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-20 px-6 text-center">
                    <div className="space-y-3">
                      <div className={`text-[11px] uppercase tracking-[0.4em] font-black ${isSignLang ? "text-cyan-200/80" : "text-white/70"}`}>{style.label}</div>
                      <h3 className="text-3xl font-bold text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.2)]">{project.title}</h3>
                      <p className="text-sm text-white/75 max-w-xs mx-auto leading-relaxed">{project.description}</p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-5 z-20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: isSignLang ? "#67e8f9" : style.accent, boxShadow: `0 0 10px ${isSignLang ? "#67e8f9" : style.accent}` }} />
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: isSignLang ? "#67e8f9" : style.accent }}>
                      {isLive ? "Live on web" : "GitHub repository"}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 bg-background/90">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {project.fullDescription}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-xs font-black text-foreground transition-all tracking-widest bg-secondary/70 px-4 py-2 rounded-lg border border-border uppercase hover:border-foreground"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" /> LIVE DEMO
                      </a>
                    ) : (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-xs font-black text-foreground transition-all tracking-widest bg-secondary/70 px-4 py-2 rounded-lg border border-border uppercase hover:border-foreground"
                      >
                        <Github className="w-4 h-4 mr-2" /> REPO
                      </a>
                    )}
                    {project.githubUrl && project.liveUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-xs font-black text-muted-foreground hover:text-foreground transition-all tracking-widest bg-background px-4 py-2 rounded-lg border border-border uppercase hover:border-foreground"
                      >
                        <Github className="w-4 h-4 mr-2" /> REPO
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
