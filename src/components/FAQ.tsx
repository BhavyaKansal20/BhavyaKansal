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
        "I'm an AI/ML engineer focused on building production-deployable systems. Currently pursuing B.Tech in Data Science & AI at TIET, Patiala, while building practical machine learning products in health AI, accessibility, and computer vision. I'm also exploring multimodal AI architectures and LLM-integrated applications.",
    },
    {
      question: "What kind of projects excite you the most?",
      answer:
        "Projects where AI directly solves high-impact user problems. My strongest interest areas are healthcare prediction, assistive AI for accessibility, authenticity/deepfake detection, and intelligent workflow automation. I especially enjoy end-to-end projects — from data to deployed product.",
    },
    {
      question: "What tools and technologies do you feel most comfortable with?",
      answer:
        "My core stack is Python, PyTorch, TensorFlow, scikit-learn, and OpenCV for AI/ML. For backends and APIs I use Flask/FastAPI, and React/Next.js for front-end. I've also worked extensively with MediaPipe, HuggingFace Transformers, LangChain, Firebase, and cloud deployments on Google Cloud and Render.",
    },
    {
      question: "How do you approach a new AI/ML problem or project?",
      answer:
        "I start with the business goal and deployment constraints first, not the model. Then I design a modular pipeline, select baselines, validate with metrics, and iteratively optimize. I write clean, documented code and ship incrementally. Reliability and reproducibility matter as much as accuracy.",
    },
    {
      question: "Are you open to internships, full-time roles, or research collaborations?",
      answer:
        "Yes — I'm actively open to AI/ML internships, research collaborations, and deep-tech product building opportunities. I'm particularly interested in roles involving computer vision, generative AI, healthcare AI, or applied ML engineering. Feel free to reach out at kansalbhavya27@gmail.com or kansalbhavya20@icloud.com.",
    },
    {
      question: "What makes your work stand out compared to other ML engineers?",
      answer:
        "I focus obsessively on productionization — not just model accuracy. I build systems that are robust, interpretable, and usable by non-technical stakeholders. I also have a strong computer vision focus and experience across healthcare, IoT/robotics, and real-time inference pipelines — a relatively rare combination for someone at my stage.",
    },
    {
      question: "Do you contribute to open source or share your work publicly?",
      answer:
        "Yes — most of my projects are publicly available on GitHub at github.com/BhavyaKansal20. I maintain documentation, write clean README files, and aim for reproducible codebases. I also have a Google Developer profile at g.dev/kansalbhavya20 where I engage with the developer community.",
    },
    {
      question: "How can I get in touch with you?",
      answer:
        "You can email me at kansalbhavya27@gmail.com (primary) or kansalbhavya20@icloud.com (secondary). You can also connect on LinkedIn at linkedin.com/in/bhavyakansal20, or check out my work on GitHub. I usually respond within 24–48 hours.",
    },
  ];

  return (
    <section id="faq" ref={faqRef} className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className={`text-center mb-16 ${faqVisible ? 'scroll-animate' : ''}`}>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-medium">
            Questions & Answers
          </p>
          <h2 className="text-5xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={`card-ripple bg-transparent rounded-2xl px-6 border-none transition-all group ${
                faqVisible ? `scroll-animate scroll-animate-delay-${Math.min(index % 4 + 1, 4)}` : ''
              }`}
            >
              <AccordionTrigger className="text-base font-semibold hover:no-underline py-5 relative border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 group-hover:border-black dark:group-hover:border-white text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 pt-1 leading-relaxed">
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
