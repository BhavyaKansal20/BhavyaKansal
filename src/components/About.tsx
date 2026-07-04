import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRef, useCallback } from "react";

/* ── 3D Parallax Tilt + Mouse Spotlight hook ── */
function useTiltCard() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    if (spotRef.current) spotRef.current.style.opacity = '1';
  }, []);

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    if (spotRef.current) spotRef.current.style.opacity = '0';
  }, []);

  return { cardRef, spotRef, onMouseMove, onMouseLeave };
}

const About = () => {
  const { ref: aboutRef, isVisible: aboutVisible } = useScrollAnimation();
  const tilt = useTiltCard();

  const skills = {
    ai: [
      "Python", "PyTorch", "TensorFlow", "scikit-learn", "OpenCV",
      "NumPy", "Pandas", "Matplotlib", "SciPy", "Keras",
    ],
    web: [
      "Flask", "FastAPI", "React", "NodeJS", "NestJS",
      "TailwindCSS", "Three.js", "Streamlit", "Flutter",
      "HTML5", "Jinja", "JavaScript", "TypeScript",
    ],
    cloud: [
      "PostgreSQL", "MongoDB", "MySQL", "SQLite",
      "Firebase", "Google Cloud", "Render", "Vercel",
    ],
    extras: [
      "HuggingFace", "Transformers", "MediaPipe", "Gradio",
      "Git", "IoT", "Robotics", "Raspberry Pi", "VS Code", "LangChain",
    ],
  };

  const stats = [
    { value: "1+", label: "Years Experience" },
    { value: "12+", label: "Projects Shipped" },
    { value: "10+", label: "AI/ML Systems" },
    { value: "3", label: "Institutions Trained" },
  ];

  return (
    <section id="about" ref={aboutRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial header */}
        <div className={`mb-16 ${aboutVisible ? 'scroll-animate' : ''}`}>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-3 font-medium">
            About Me
          </p>
          <div className="flex items-end gap-6 flex-wrap">
            <h2 className="text-5xl md:text-7xl font-bold leading-none">
              Bhavya<br />Kansal
            </h2>
            <div className="pb-2">
              <p className="text-base text-muted-foreground font-medium">
                AI/ML Engineer · B.Tech DS&AI, TIET
              </p>
              <p className="text-sm text-muted-foreground">
                Patiala, Punjab, India
              </p>
            </div>
          </div>
          {/* Divider rule */}
          <div className="mt-8 h-px bg-gradient-to-r from-foreground/30 via-foreground/10 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Bio */}
          <div className={`space-y-8 ${aboutVisible ? 'scroll-animate scroll-animate-delay-1' : ''}`}>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p style={{ textAlign: "justify" }}>
                I build AI systems that actually ship — closing the gap between research-grade models and production infrastructure. I specialise in deep learning, computer vision, and generative AI with a strong focus on solving real-world engineering problems.
              </p>
              <p style={{ textAlign: "justify" }}>
                Currently pursuing B.Tech in Data Science & Artificial Intelligence at <span className="text-foreground font-semibold">Thapar Institute of Engineering & Technology (TIET)</span>, Patiala, with prior industrial training at IIT & NIELIT Ropar and a Diploma in CSE from Thapar Polytechnic College.
              </p>
              <p style={{ textAlign: "justify" }}>
                My recent work spans applied healthcare AI, accessibility systems, deepfake screening, retinal enhancement, and assistant automation. I focus on dependable engineering, clear UX, and measurable product outcomes.
              </p>
              <p style={{ textAlign: "justify" }}>
                Research-driven, execution-focused, and systems-oriented — I turn experimental AI workflows into production-grade products that make an impact.
              </p>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`text-center p-4 rounded-2xl bg-foreground/4 dark:bg-white/4 border border-border ${aboutVisible ? `scroll-animate scroll-animate-delay-${i + 2}` : ''}`}
                >
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Tech Arsenal (3D Tilt Card) */}
          <div
            ref={tilt.cardRef}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className={`glass-card rounded-3xl p-6 md:p-7 shadow-xl ${aboutVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}
          >
            {/* Spotlight layer */}
            <div ref={tilt.spotRef} className="card-spotlight" />

            <h3 className="text-2xl font-bold mb-6">Tech Arsenal</h3>

            <div className="space-y-6">
              {/* AI / ML / DL */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-semibold">
                  AI / ML / DL
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.ai.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full text-xs sm:text-sm font-medium border border-border hover:border-black dark:hover:border-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Web / Backend / APIs */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-semibold">
                  Web / Backend / APIs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.web.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full text-xs sm:text-sm font-medium border border-border hover:border-black dark:hover:border-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Databases & Cloud */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-semibold">
                  Databases & Cloud
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.cloud.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full text-xs sm:text-sm font-medium border border-border hover:border-black dark:hover:border-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Tools */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-semibold">
                  Additional Tools & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.extras.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full text-xs sm:text-sm font-medium border border-border hover:border-black dark:hover:border-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
