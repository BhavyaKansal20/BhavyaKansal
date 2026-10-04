import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();

  return (
    <section
      ref={heroRef}
      className="min-h-[80vh] flex items-center relative overflow-hidden py-24"
    >
      <div className={`max-w-4xl mx-auto px-6 relative z-10 w-full transition-all duration-300 ease-out ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <span className="eyebrow text-accent">Bhavya Kansal</span>

        <h1 className="display-heading text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6">
          AI/ML Engineer
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
          Building production-ready computer vision and generative AI systems. B.E. AI & Data Science at Thapar Institute. Focused on applied multimodal pipelines and deep learning infrastructure.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button
            size="lg"
            className="rounded-lg gap-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Projects
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-lg gap-2 text-sm font-medium border-border hover:bg-secondary"
            onClick={() => window.open("/Bhavya_Kansal_Resume.pdf", "_blank")}
          >
            Resume
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
