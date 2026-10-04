import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { projectsData } from "@/data/projects";

const Projects = () => {
  const { ref: projectsRef, isVisible } = useScrollAnimation();

  // Pick top 4-6 featured
  const featured = projectsData.filter(p => ["Healthy AI", "ChromaCrystal UHD", "SignLang AI", "RetiNex AI"].includes(p.title)).slice(0, 4);
  if (featured.length === 0) featured.push(...projectsData.slice(0, 4));

  return (
    <section id="projects" ref={projectsRef} className={`py-24 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="eyebrow">Featured Work</span>
          <h2 className="display-heading text-3xl font-bold mt-2">Selected Projects</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((project) => (
            <div key={project.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/20 transition-colors flex flex-col">
              <div className="h-48 bg-muted relative overflow-hidden">
                <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold mb-1 text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {/* TODO(bhavya): Add metric outcome here, currently falling back to description */}
                  {project.description.split('.')[0]}. TODO(bhavya): metric outcome.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.slice(0, 4).map(t => (
                    <span key={t} className="px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded border border-border">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center gap-3">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                      Live Demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline">
                      Code <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Projects;
