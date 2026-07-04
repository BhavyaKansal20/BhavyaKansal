import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    <section id="faq" ref={faqRef} className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className={`mb-16 ${faqVisible ? 'scroll-animate' : ''}`}>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-3 font-medium">
            Questions & Answers
          </p>
          <h2 className="text-5xl font-bold">Frequently Asked<br />Questions</h2>
          <div className="mt-6 h-px bg-gradient-to-r from-foreground/30 via-foreground/10 to-transparent" />
        </div>

        <Accordion type="single" collapsible className="space-y-0">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={`border-0 border-b border-gray-200/60 dark:border-gray-700/50 last:border-b-0 ${
                faqVisible ? `scroll-animate scroll-animate-delay-${Math.min((index % 4) + 1, 4)}` : ''
              }`}
            >
              <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-6 text-left leading-snug group transition-all duration-200">
                <span className="flex items-start gap-3 w-full pr-4">
                  <span className="text-muted-foreground font-normal text-sm min-w-[2rem] tabular-nums mt-0.5">
                    {String(index + 1).padStart(2, '0')}
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
    </section>
  );
};

export default FAQ;
