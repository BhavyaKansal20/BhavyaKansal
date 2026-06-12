import { useState, useEffect } from "react";
import { X, Github, ExternalLink, ChevronLeft, ChevronRight, Zap, Target, Layers, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/* ── Tech color map (shared with Projects.tsx) ── */
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
  EfficientNet: { color: "#4F46E5", abbr: "EN" },
  "EfficientNet-B4": { color: "#4F46E5", abbr: "E4" },
};

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
  datasets: "#94a3b8",
};

interface ProjectDetailModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const images = project.images || [project.image].filter(Boolean);
  const keyFeatures = project.keyFeatures || project.features || [];
  const technical = project.technical || {
    approach: project.implementation?.approach || "",
    technologyChoices: project.implementation?.technologies || [],
    architecture: project.architecture || "",
  };
  const accent = projectAccents[project.id] || "#94a3b8";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 915);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && images.length > 1) {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight" && images.length > 1) {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, images.length]);

  if (!isOpen) return null;

  const nextImage = () => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  /* ── Tech Badge ── */
  const TechBadge = ({ name }: { name: string }) => {
    const meta = techMeta[name] || { color: "#94a3b8", abbr: name.slice(0, 2) };
    return (
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
        style={{
          background: `${meta.color}15`,
          color: meta.color,
          border: `1px solid ${meta.color}25`,
        }}
      >
        <span
          className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-black text-white"
          style={{ background: meta.color }}
        >
          {meta.abbr}
        </span>
        {name}
      </div>
    );
  };

  /* ── Metric Card ── */
  const MetricCard = ({ metric }: { metric: { value: string; label: string; description?: string } }) => (
    <div
      className="relative p-5 rounded-xl border border-border/60 bg-background/80 overflow-hidden group hover:border-opacity-80 transition-all"
      style={{ borderColor: `${accent}20` }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ background: `linear-gradient(90deg, ${accent}60, transparent)` }}
      />
      <div className="text-3xl font-black mb-1" style={{ color: accent }}>
        {metric.value}
      </div>
      <div className="text-sm font-semibold text-foreground">{metric.label}</div>
      {metric.description && (
        <div className="text-xs text-muted-foreground mt-1">{metric.description}</div>
      )}
    </div>
  );

  /* ── Shared Hero Section ── */
  const HeroSection = ({ height = "h-72" }: { height?: string }) => (
    <div className={`relative ${height} overflow-hidden`}>
      <img
        src={images[currentImageIndex]}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-500"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, ${accent}10 100%)`,
        }}
      />

      {/* Title & CTAs */}
      <div className="absolute bottom-5 left-5 right-5 z-10">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.category && (
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: `${accent}30`, color: accent }}
            >
              {project.category}
            </span>
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{project.title}</h2>
        <div className="flex flex-wrap gap-2">
          {project.githubUrl && (
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full gap-2 bg-white/15 backdrop-blur-md text-white border-white/20 hover:bg-white/25 text-xs font-bold"
              asChild
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button
              size="sm"
              className="rounded-full gap-2 text-white text-xs font-bold"
              style={{ background: accent }}
              asChild
            >
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5" /> Live Demo
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Carousel controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === currentImageIndex ? "bg-white w-5" : "bg-white/40 w-1.5"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  /* ── Content Sections ── */
  const OverviewContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <Target className="w-4 h-4" style={{ color: accent }} /> About
        </h3>
        <p className="text-muted-foreground leading-relaxed">{project.fullDescription}</p>
      </div>

      {keyFeatures.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: accent }} /> Key Features
          </h3>
          <div className="grid gap-2">
            {keyFeatures.map((feature: any, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 mt-0.5"
                  style={{ background: accent }}
                >
                  {idx + 1}
                </div>
                <p className="text-sm">
                  {typeof feature === "string" ? feature : feature.title || feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.challenges && project.challenges.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Challenges</h3>
          <div className="space-y-2">
            {project.challenges.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl border-l-3 bg-muted/20"
                style={{ borderLeftColor: accent, borderLeftWidth: "3px" }}
              >
                <p className="text-sm text-muted-foreground">
                  {typeof item === "string" ? item : item.challenge || item}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const TechnicalContent = () => (
    <div className="space-y-6">
      {technical.approach && (
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: accent }} /> Implementation
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">{technical.approach}</p>
        </div>
      )}

      {technical.technologyChoices && technical.technologyChoices.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Technology Choices</h3>
          <div className="grid gap-3">
            {technical.technologyChoices.map((tech: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-muted/20">
                <TechBadge name={tech.name} />
                <p className="text-sm text-muted-foreground flex-1 pt-0.5">{tech.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {technical.architecture && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Architecture</h3>
          <div
            className="p-4 rounded-xl font-mono text-xs leading-relaxed border border-border/50 bg-slate-950 text-slate-300 whitespace-pre-wrap"
            style={{ borderColor: `${accent}20` }}
          >
            {technical.architecture}
          </div>
        </div>
      )}
    </div>
  );

  const MetricsContent = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <BarChart3 className="w-4 h-4" style={{ color: accent }} /> Performance Metrics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(project.metrics || []).map((metric: any, idx: number) => (
          <MetricCard key={idx} metric={metric} />
        ))}
      </div>
    </div>
  );

  /* ── MOBILE SHEET ── */
  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 z-[100] bg-black/80 animate-in fade-in-0 duration-300" onClick={onClose} />
        <div
          className="fixed inset-x-0 bottom-0 z-[101] h-[92vh] bg-background rounded-t-[24px] shadow-2xl animate-in slide-in-from-bottom-full duration-300 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-muted rounded-full" />
          </div>

          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="absolute right-3 top-3 w-8 h-8 rounded-full bg-muted/80 z-[200]"
          >
            <X className="w-4 h-4" />
          </Button>

          <ScrollArea className="flex-1 px-4">
            <HeroSection height="h-48" />

            {/* Tech badges */}
            <div className="flex flex-wrap gap-1.5 my-4">
              {(project.techStack || project.tags || []).map((tech: string) => (
                <TechBadge key={tech} name={tech} />
              ))}
            </div>

            <Tabs defaultValue="overview" className="mb-6">
              <div className="sticky top-0 z-50 pb-3 bg-background/95 backdrop-blur-md">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="overview" className="rounded-full text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="technical" className="rounded-full text-xs">Technical</TabsTrigger>
                  <TabsTrigger value="metrics" className="rounded-full text-xs">Metrics</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="overview" className="mt-0"><OverviewContent /></TabsContent>
              <TabsContent value="technical" className="mt-0"><TechnicalContent /></TabsContent>
              <TabsContent value="metrics" className="mt-0"><MetricsContent /></TabsContent>
            </Tabs>
            <div className="h-8" />
          </ScrollArea>
        </div>
      </>
    );
  }

  /* ── DESKTOP MODAL ── */
  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/80 animate-in fade-in-0 duration-300" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 z-[101] w-[92vw] max-w-[1100px] h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="absolute right-5 top-5 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 z-[200]"
        >
          <X className="w-5 h-5" />
        </Button>

        <ScrollArea className="flex-1">
          <div className="relative">
            <HeroSection height="h-[320px]" />

            {/* Tech badges sticky bar */}
            <div className="sticky top-0 z-40 px-8 py-4 border-b border-border/50 bg-background/95 backdrop-blur-md">
              <div className="flex flex-wrap gap-2">
                {(project.techStack || project.tags || []).map((tech: string) => (
                  <TechBadge key={tech} name={tech} />
                ))}
              </div>
            </div>

            <Tabs defaultValue="overview" className="px-8">
              <div className="sticky top-[72px] z-50 pt-4 pb-2 flex justify-center">
                <div className="bg-background/95 backdrop-blur-md rounded-full p-1">
                  <TabsList className="inline-flex h-11 items-center justify-center rounded-full bg-muted p-1">
                    <TabsTrigger value="overview" className="rounded-full px-6">Overview</TabsTrigger>
                    <TabsTrigger value="technical" className="rounded-full px-6">Technical</TabsTrigger>
                    <TabsTrigger value="metrics" className="rounded-full px-6">Metrics</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="py-6 pb-8">
                <TabsContent value="overview" className="mt-0"><OverviewContent /></TabsContent>
                <TabsContent value="technical" className="mt-0"><TechnicalContent /></TabsContent>
                <TabsContent value="metrics" className="mt-0"><MetricsContent /></TabsContent>
              </div>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default ProjectDetailModal;
