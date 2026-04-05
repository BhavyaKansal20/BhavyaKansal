import { Button } from "@/components/ui/button";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Contact = () => {
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation();
  
  return (
    <section id="contact" ref={contactRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${contactVisible ? 'scroll-animate' : ''}`}>
            <div>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Get in Touch
              </p>
              <h2 className="text-5xl font-bold mb-6">Let's work together</h2>
              <p className="text-lg text-muted-foreground test">
                Whether you want to discuss AI/ML roles, research collaboration, or deep-tech product engineering, I would love to connect.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700">
                  <Mail className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">kansalbhavya27@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700">
                  <MapPin className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+91 62833 32944</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - CTA Card */}
          <div className={`glass-card rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-6 ${contactVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}>
            <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center mx-auto border border-border shadow-lg overflow-hidden">
              <img src="/gmail-icon.png" alt="Gmail" className="w-12 h-12 object-contain" />
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-3">Ready to start a project?</h3>
              <p className="text-muted-foreground">
                Drop me an email and I will get back to you to discuss your requirements and collaboration goals.
              </p>
            </div>
          <a href="mailto:kansalbhavya27@gmail.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-full gap-2 px-8 py-6 mt-4   text-base font-medium">
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Button>
            </a>
            <p className="text-sm text-muted-foreground">Opens your email app</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
