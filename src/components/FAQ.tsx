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
      "I am an AI/ML engineer focused on building deployable systems. I am currently working on practical machine learning products in health AI, accessibility, and computer vision.",
  },
  {
    question: "What kind of projects excite you the most?",
    answer:
      "I enjoy projects where AI directly solves user problems. My strongest areas are healthcare prediction, assistive AI, authenticity detection, and workflow automation.",
  },
  {
    question: "What tools and technologies do you feel most comfortable with?",
    answer:
      "My core stack includes Python, PyTorch, TensorFlow, scikit-learn, OpenCV, Flask/FastAPI, and React. I also use MediaPipe, OCR, and cloud deployment tools for end-to-end delivery.",
  },
  {
    question: "How do you usually approach a new problem or project?",
    answer:
      "I start with the business goal and deployment constraints, then design a modular pipeline, validate it with metrics, and optimize for reliability before release.",
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
