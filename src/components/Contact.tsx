import { Button } from "@/components/ui/button";
import { Mail, MapPin, ArrowRight, Github, Linkedin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTiltCard } from "@/hooks/useTiltCard";

const Contact = () => {
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation();
  const tilt = useTiltCard();

  const contactItems = [
    {
      icon: <Mail className="w-5 h-5 text-gray-900 dark:text-gray-100" />,
      label: "Primary Email",
      value: "kansalbhavya27@gmail.com",
      href: "mailto:kansalbhavya27@gmail.com",
    },
    {
      icon: <Mail className="w-5 h-5 text-gray-900 dark:text-gray-100" />,
      label: "Secondary Email",
      value: "kansalbhavya20@icloud.com",
      href: "mailto:kansalbhavya20@icloud.com",
    },
    {
      icon: <MapPin className="w-5 h-5 text-gray-900 dark:text-gray-100" />,
      label: "Location",
      value: "Patiala, Punjab, India",
      href: undefined,
    },
  ];

  const socials = [
    { icon: <Github className="w-5 h-5" />, label: "GitHub", href: "https://github.com/BhavyaKansal20" },
    { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", href: "https://linkedin.com/in/bhavyakansal20" },
  ];

  return (
    <section id="contact" ref={contactRef} className="py-24 bg-background relative overflow-hidden">
      <div className="aurora-bg" aria-hidden />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Editorial header */}
        <div className={`mb-14 sm:mb-16 ${contactVisible ? "scroll-animate" : "opacity-0"}`}>
          <span className="eyebrow">Get in Touch</span>
          <h2 className="display-heading text-5xl md:text-7xl font-bold leading-[0.95] mt-5">
            Let's work
            <br />
            together.
          </h2>
          <div className="section-rule mt-8" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — contact info */}
          <div className={`space-y-10 ${contactVisible ? "scroll-animate scroll-animate-delay-1" : "opacity-0"}`}>
            <p className="text-lg text-muted-foreground max-w-md" style={{ textAlign: "justify" }}>
              Whether you want to discuss AI/ML roles, research collaboration, deep-tech product engineering, or
              just say hello — I would love to connect and explore what we can build together.
            </p>

            <div className="space-y-4">
              {contactItems.map((item) => {
                const Inner = (
                  <div className="stat-tile flex items-start gap-4 p-4 rounded-2xl">
                    <div className="w-11 h-11 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-border flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5 font-medium">
                        {item.label}
                      </p>
                      <p className="font-medium text-foreground break-words">{item.value}</p>
                    </div>
                  </div>
                );
                return item.href ? (
                  <a key={item.label} href={item.href} className="block">
                    {Inner}
                  </a>
                ) : (
                  <div key={item.label}>{Inner}</div>
                );
              })}
            </div>

            {/* Socials */}
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-4 font-medium">Find me online</p>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground/5 dark:bg-white/5 border border-border hover:border-foreground dark:hover:border-white transition-all text-sm font-medium"
                  >
                    {s.icon}
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — CTA card (3D tilt) */}
          <div
            ref={tilt.cardRef}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className={`glass-card rounded-3xl p-8 md:p-12 shadow-2xl text-center relative overflow-hidden ${
              contactVisible ? "scroll-animate scroll-animate-delay-2" : "opacity-0"
            }`}
          >
            <div className="card-spotlight" ref={tilt.spotRef} />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/6 via-transparent to-purple-500/6 rounded-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center mx-auto border border-border shadow-lg overflow-hidden mb-6">
                <img src="/gmail-icon.png" alt="Gmail" className="w-12 h-12 object-contain" />
              </div>

              <h3 className="text-3xl font-bold mb-3">
                Ready to start
                <br />a project?
              </h3>
              <p className="text-muted-foreground text-base max-w-xs mx-auto">
                Drop me an email and I will get back to you to discuss your requirements and collaboration goals.
              </p>

              <div className="flex flex-col gap-3 mt-8">
                <a href="mailto:kansalbhavya27@gmail.com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full gap-2 px-8 py-6 text-base font-medium w-full">
                    Send Primary Email
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
                <a href="mailto:kansalbhavya20@icloud.com" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full gap-2 px-8 py-6 text-base font-medium w-full border-2"
                  >
                    Send Secondary Email
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
              </div>

              <p className="text-xs text-muted-foreground mt-4">Opens your default email app</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
