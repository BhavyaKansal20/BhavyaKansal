import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const FAQ = () => {
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "What do you do and what are you currently working on?",
      answer:
        "I am an AI/ML engineer building deployable systems that close the gap between research and production. Currently, I am working on practical machine learning products in health AI, accessibility, computer vision, and intelligent automation — while pursuing my B.Tech in Data Science & AI at Thapar Institute of Engineering & Technology (TIET).",
    },
    {
      question: "What kind of projects excite you the most?",
      answer:
        "Projects where AI directly solves tangible user problems. My strongest areas are healthcare prediction systems, assistive AI for accessibility, deepfake detection, retinal image enhancement (RetiNex AI), and workflow automation. I enjoy the entire lifecycle — from research to deployment to performance monitoring.",
    },
    {
      question: "What tools and technologies do you feel most comfortable with?",
      answer:
        "My core stack includes Python, PyTorch, TensorFlow, scikit-learn, OpenCV, and MediaPipe for AI/ML. On the web side: Flask, FastAPI, React, and Next.js. For data persistence: PostgreSQL, MongoDB, Firebase. I also use HuggingFace Transformers, LangChain, Gradio, and Google Cloud for end-to-end deployment.",
    },
    {
      question: "How do you usually approach a new problem or project?",
      answer:
        "I start with the business goal and deployment constraints, then design a modular pipeline, validate it with clear metrics, and iterate toward reliability before release. I prioritise measurable impact over complexity — simpler systems that work reliably in production beat complex systems that are fragile.",
    },
    {
      question: "Are you open to internships, research collaborations, or freelance work?",
      answer:
        "Yes — I am actively open to AI/ML internships, deep-tech research collaborations, and selective freelance projects that align with my expertise. The best way to start a conversation is via email at kansalbhavya27@gmail.com or kansalbhavya20@icloud.com.",
    },
    {
      question: "Do you contribute to open-source or publish any research?",
      answer:
        "I actively contribute to open-source AI tooling and maintain several public repositories on GitHub (github.com/BhavyaKansal20). While I have not yet published formal research papers, I am engaged in project-level research at TIET and through industrial training at IIT & NIELIT Ropar, with ambitions to publish in applied ML domains.",
    },
    {
      question: "What sets you apart from other developers?",
      answer:
        "I operate at the intersection of research depth and production discipline. I do not just build prototypes — I engineer systems with reliability, observability, and user impact in mind. My multi-disciplinary background across AI, IoT, robotics, and full-stack development lets me architect solutions that span hardware to cloud.",
    },
    {
      question: "How can I contact you or view your resume?",
      answer:
        "You can reach me at kansalbhavya27@gmail.com (primary) or kansalbhavya20@icloud.com (secondary). My resume is downloadable directly from this portfolio — click 'View Resume' in the hero section. You can also connect on LinkedIn at linkedin.com/in/bhavyakansal20.",
    },
  ];

  return (
    <section id="faq" ref={faqRef} className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[0.88fr_1.12fr] gap-12 lg:gap-20 items-start">
          {/* Left — sticky intro + CTA */}
          <div className={`lg:sticky lg:top-28 ${faqVisible ? "scroll-animate" : "opacity-0"}`}>
            <span className="eyebrow">Questions & Answers</span>
            <h2 className="display-heading text-4xl md:text-5xl font-bold mt-5 sm:whitespace-nowrap tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="section-rule mt-8 mb-8 max-w-xs" />
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Everything you might want to know — and if something isn't covered here, a quick email is the
              fastest way to reach me.
            </p>
            <a href="mailto:kansalbhavya27@gmail.com" target="_blank" rel="noopener noreferrer">
              <Button className="mt-6 rounded-full gap-2 px-6 py-5 text-sm font-medium">
                Ask me directly
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </a>
          </div>

          {/* Right — accordion */}
          <div className="premium-panel rounded-[2rem] p-2 md:p-3 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.35)]">
            <Accordion type="single" collapsible className="space-y-0">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className={`group border-0 border-b border-gray-200/60 dark:border-white/10 last:border-b-0 ${
                    faqVisible ? `scroll-animate scroll-animate-delay-${Math.min((index % 4) + 1, 4)}` : "opacity-0"
                  }`}
                >
                  <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-6 text-left leading-snug transition-all duration-200">
                    <span className="flex items-start gap-4 w-full pr-4">
                      <span className="text-muted-foreground/70 font-normal text-sm min-w-[2rem] tabular-nums mt-0.5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="group-hover:text-foreground transition-colors duration-200">
                        {faq.question}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 pl-[3.5rem] text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
