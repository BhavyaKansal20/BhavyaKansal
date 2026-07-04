import { Button } from "@/components/ui/button";
import { Mail, MapPin, ArrowRight, Github, Linkedin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRef, useCallback } from "react";

function useTiltCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -7;
    const ry = ((x - cx) / cx) * 7;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    if (spotRef.current) spotRef.current.style.opacity = '1';
  }, []);

  const onMouseLeave = useCallback(() => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    if (spotRef.current) spotRef.current.style.opacity = '0';
  }, []);

  return { ref, spotRef, onMouseMove, onMouseLeave };
}

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
    {
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
      href: "https://github.com/BhavyaKansal20",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      href: "https://linkedin.com/in/bhavyakansal20",
    },
  ];

  return (
    <section id="contact" ref={contactRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial header */}
        <div className={`mb-16 ${contactVisible ? 'scroll-animate' : ''}`}>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-3 font-medium">
            Get in Touch
          </p>
          <h2 className="text-5xl md:text-7xl font-bold leading-none">
            Let's work<br />together.
          </h2>
          <div className="mt-8 h-px bg-gradient-to-r from-foreground/30 via-foreground/10 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Contact Info */}
          <div className={`space-y-10 ${contactVisible ? 'scroll-animate scroll-animate-delay-1' : ''}`}>
            <p className="text-lg text-muted-foreground max-w-md" style={{ textAlign: "justify" }}>
              Whether you want to discuss AI/ML roles, research collaboration, deep-tech product engineering, or just say hello — I would love to connect and explore what we can build together.
            </p>

            <div className="space-y-6">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5 font-medium">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-medium hover:underline transition-colors text-foreground"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-medium text-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium">Find me online</p>
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

          {/* Right — CTA Card (3D Tilt) */}
          <div
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className={`glass-card rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden ${contactVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}
          >
            <div className="card-spotlight" ref={tilt.spotRef} />

            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/6 via-transparent to-purple-500/6 rounded-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center mx-auto border border-border shadow-lg overflow-hidden mb-6">
                <img src="/gmail-icon.png" alt="Gmail" className="w-12 h-12 object-contain" />
              </div>

              <h3 className="text-3xl font-bold mb-3">Ready to start<br />a project?</h3>
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
