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
      "I am an AI engineer and founder focused on building deployable machine learning systems. Right now I am building multimodal reasoning infrastructure at MultiModex AI and developing Project AAGNI for real-time decision support.",
  },
  {
    question: "What kind of projects excite you the most?",
    answer:
      "I am most excited by real-world AI projects where research turns into measurable outcomes. Projects like health risk prediction, sign language translation, deepfake detection, and automation assistants are exactly where I do my best work.",
  },
  {
    question: "What tools and technologies do you feel most comfortable with?",
    answer:
      "I work primarily with Python, PyTorch, TensorFlow, HuggingFace, OpenCV, and FastAPI. For vision and sequence tasks I use tools like YOLO, OCR, MediaPipe, and LSTM pipelines. I also build supporting automation and integration layers in production workflows.",
  },
  {
    question: "How do you usually approach a new problem or project?",
    answer:
      "I start by defining the problem and the deployment constraints first. Then I build modular pipelines, validate model behavior with metrics, and harden reliability using deterministic logic where needed. My approach is always research-driven but production-focused.",
  },
];


  return (
    <section id="faq" ref={faqRef} className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className={`text-center mb-16 ${faqVisible ? 'scroll-animate' : ''}`}>
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Questions & Answers
          </p>
          <h2 className="text-5xl font-bold">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={`bg-transparent rounded-2xl px-6 border-none transition-all group ${
                faqVisible ? `scroll-animate scroll-animate-delay-${Math.min(index % 3 + 1, 3)}` : ''
              }`}
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6 relative border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 group-hover:border-black dark:group-hover:border-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
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
