import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import {
  Sheet,
  SheetPortal,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const eyeRaf = useRef<number | null>(null);
  const scrollRaf = useRef<number | null>(null);
  const activeSectionRef = useRef("home");

  useEffect(() => {
    setIsMounted(true);

    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

    /* ── Eyes: single rAF write, zero re-renders ── */
    const positionPupil = (eye: HTMLDivElement | null, pupil: HTMLDivElement | null) => {
      if (!eye || !pupil) return;
      const rect = eye.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(mouse.current.y - cy, mouse.current.x - cx);
      const dist = Math.min(4, Math.hypot(mouse.current.x - cx, mouse.current.y - cy) / 100);
      pupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    };

    const updateEyes = () => {
      eyeRaf.current = null;
      positionPupil(leftEyeRef.current, leftPupilRef.current);
      positionPupil(rightEyeRef.current, rightPupilRef.current);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (eyeRaf.current == null) eyeRaf.current = requestAnimationFrame(updateEyes);
    };

    /* ── Scroll: rAF-throttled ── */
    const sections = ["hero", "about", "timeline", "projects", "coding", "faq"];
    const readScroll = () => {
      scrollRaf.current = null;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
      setIsScrolled(scrollTop > 20);

      const probe = scrollTop + 120;
      let current = scrollTop < 100 ? "home" : activeSectionRef.current;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (probe >= offsetTop && probe < offsetTop + offsetHeight) {
            current = id === "hero" ? "home" : id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    const handleScroll = () => {
      if (scrollRaf.current == null) scrollRaf.current = requestAnimationFrame(readScroll);
    };

    if (canHover) window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    readScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (eyeRaf.current != null) cancelAnimationFrame(eyeRaf.current);
      if (scrollRaf.current != null) cancelAnimationFrame(scrollRaf.current);
    };
     
  }, []);

  // keep a ref of active section so the scroll callback can read it without re-subscribing
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  const navLinks = [
    { name: "Home", path: "/", section: "home" },
    { name: "About", path: "#about", section: "about" },
    { name: "Timeline", path: "#timeline", section: "timeline" },
    { name: "Projects", path: "#projects", section: "projects" },
    { name: "Coding", path: "#coding", section: "coding" },
    { name: "FAQ", path: "#faq", section: "faq" },
  ];

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    if (mobileMenuOpen) {
      try {
        const active = document.activeElement as HTMLElement | null;
        if (active && typeof active.blur === "function") active.blur();
        document.body.style.overflow = "hidden";
      } catch {
        /* ignore */
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  if (!isMounted) return null;

  return (
    <>
      <style>{`
        @keyframes nav-slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes nav-slide-out { from { transform: translateX(0); } to { transform: translateX(100%); } }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "px-3 sm:px-6 pt-4 sm:pt-6" : "px-0 pt-0"
        }`}
      >
        <nav
          className={`mx-auto px-4 sm:px-8 py-3.5 flex items-center relative transition-all duration-300 overflow-hidden ${
            isScrolled
              ? "max-w-[85em] rounded-full backdrop-blur-xl bg-white/70 dark:bg-black/60 border border-gray-200/50 dark:border-white/10 shadow-lg"
              : "max-w-full rounded-none backdrop-blur-xl bg-white/70 dark:bg-black/55 border-b border-gray-200/30 dark:border-white/10 shadow-none"
          }`}
        >
          {/* Scroll progress underline */}
          <div
            className="absolute bottom-0 left-0 h-[3px] rounded-b-full z-[5] dark:bg-white bg-black"
            style={{
              width: `${scrollProgress * 100}%`,
              opacity: isScrolled ? 1 : 0,
              boxShadow: "0 0 6px rgba(0,0,0,0.3), 0 0 6px rgba(255,255,255,0.2)",
              transition: "width 0.25s ease-out, opacity 0.3s ease",
            }}
          />

          {/* Left — Logo */}
          <Link to="/" className="text-xl font-bold z-10 flex-shrink-0 tracking-tight">
            <span className="text-foreground whitespace-nowrap">bhavya</span>
            <span className="text-muted-foreground whitespace-nowrap">kansal.dev</span>
          </Link>

          {/* Center — Eyes */}
          <div className="hidden min-[915px]:flex items-center gap-1.5 z-10 flex-1 justify-center mx-4">
            <div
              ref={leftEyeRef}
              className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center relative overflow-hidden"
            >
              <div
                ref={leftPupilRef}
                className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full absolute"
                style={{ transition: "transform 0.08s ease-out" }}
              />
            </div>
            <div
              ref={rightEyeRef}
              className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center relative overflow-hidden"
            >
              <div
                ref={rightPupilRef}
                className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full absolute"
                style={{ transition: "transform 0.08s ease-out" }}
              />
            </div>
          </div>

          {/* Right — Navigation */}
          <div className="z-10 flex items-center gap-2 flex-shrink-0 ml-auto">
            <div className="hidden min-[915px]:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeSection === link.section
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <ThemeToggle />
              <a href="mailto:kansalbhavya27@gmail.com" target="_blank" rel="noopener noreferrer">
                <Button className="rounded-full gap-2 px-6 py-2.5 text-sm font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 ml-2">
                  Let's talk
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* Mobile */}
            <div className="flex min-[915px]:hidden items-center gap-2">
              <ThemeToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    aria-label="Open menu"
                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-foreground hover:bg-foreground/90 text-background shadow-md"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetPortal>
                  <div
                    className={`fixed inset-0 z-[9998] bg-black/80 transition-opacity duration-300 ease-in-out ${
                      mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={closeMenu}
                  />

                  <div
                    className="fixed inset-y-0 right-0 z-[9999] h-full border-l border-white/10 bg-background shadow-2xl transform overflow-y-auto"
                    aria-hidden={!mobileMenuOpen}
                    style={{
                      animation: mobileMenuOpen
                        ? "nav-slide-in 300ms forwards ease-out"
                        : "nav-slide-out 300ms forwards ease-in",
                      willChange: "transform",
                      width: "min(85vw, 400px)",
                      maxWidth: "400px",
                    }}
                  >
                    <div className="p-6 h-full w-full">
                      <Button
                        type="button"
                        onClick={closeMenu}
                        className="absolute right-4 top-4 w-8 h-8 rounded-full bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 flex items-center justify-center p-0 z-10"
                      >
                        <X className="h-5 w-5 text-foreground" />
                        <span className="sr-only">Close</span>
                      </Button>

                      <div className="pt-12 w-full">
                        <SheetTitle className="text-xl font-bold mb-2">Menu</SheetTitle>
                        <SheetDescription className="text-sm text-muted-foreground mb-6">
                          Navigate to different sections
                        </SheetDescription>

                        <nav className="flex flex-col gap-2 w-full">
                          {navLinks.map((link) => (
                            <a
                              key={link.name}
                              href={link.path}
                              onClick={closeMenu}
                              className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                                activeSection === link.section
                                  ? "bg-foreground text-background"
                                  : "text-foreground hover:bg-secondary"
                              }`}
                            >
                              {link.name}
                            </a>
                          ))}
                          <a
                            href="mailto:kansalbhavya27@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                            className="mt-4 w-full"
                          >
                            <Button className="w-full rounded-full gap-2 px-6 py-6 text-base font-medium bg-foreground text-background hover:bg-foreground/90">
                              Let's talk
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </a>
                        </nav>
                      </div>
                    </div>
                  </div>
                </SheetPortal>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
