import { Button } from "@/components/ui/button";
import { Mail, MapPin, ArrowRight, Phone, Github, Linkedin, Globe } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Contact = () => {
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation();

  return (
    <section id="contact" ref={contactRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left Content */}
          <div className={`space-y-8 ${contactVisible ? 'scroll-animate' : ''}`}>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-medium">
                Get in Touch
              </p>
              <h2 className="text-5xl font-bold mb-6 tracking-tight">Let's work together</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you want to discuss AI/ML roles, research collaboration, or deep-tech product engineering — I'd love to connect and explore what we can build together.
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              {/* Primary Email */}
              <a
                href="mailto:kansalbhavya27@gmail.com"
                className="card-ripple flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-foreground/30 transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <Mail className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Primary Email</p>
                  <p className="font-semibold group-hover:text-foreground transition-colors">kansalbhavya27@gmail.com</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Secondary Email */}
              <a
                href="mailto:kansalbhavya20@icloud.com"
                className="card-ripple flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-foreground/30 transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Secondary Email</p>
                  <p className="font-semibold group-hover:text-foreground transition-colors">kansalbhavya20@icloud.com</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Phone */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border">
                <div className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <Phone className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone</p>
                  <p className="font-semibold">+91 62833 32944</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border">
                <div className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Location</p>
                  <p className="font-semibold">Patiala, Punjab, India</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { href: "https://linkedin.com/in/bhavyakansal20", icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
                { href: "https://github.com/BhavyaKansal20", icon: <Github className="w-4 h-4" />, label: "GitHub" },
                { href: "https://g.dev/kansalbhavya20", icon: <Globe className="w-4 h-4" />, label: "Google Dev" },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-foreground/40 hover:bg-secondary transition-all duration-150 text-sm font-medium"
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Content - CTA Card */}
          <div className={`card-ripple glass-card rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-6 ${contactVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}>
            <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center mx-auto border border-border shadow-lg overflow-hidden">
              <img src="/gmail-icon.png" alt="Gmail" className="w-12 h-12 object-contain" />
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-3 tracking-tight">Ready to start a project?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drop me an email and I'll get back to you to discuss your requirements, collaboration goals, and how we can build something meaningful together.
              </p>
            </div>

            <div className="space-y-3">
              <a href="mailto:kansalbhavya27@gmail.com" target="_blank" rel="noopener noreferrer" className="block">
                <Button size="lg" className="rounded-full gap-2 px-8 py-6 text-base font-medium w-full">
                  Send Primary Email
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="mailto:kansalbhavya20@icloud.com" target="_blank" rel="noopener noreferrer" className="block">
                <Button size="lg" variant="outline" className="rounded-full gap-2 px-8 py-6 text-base font-medium w-full border-2">
                  Send to iCloud
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>

            <p className="text-sm text-muted-foreground">Usually responds within 24–48 hours</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
