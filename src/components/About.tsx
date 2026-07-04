import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTiltCard } from "@/hooks/useTiltCard";

const About = () => {
  const { ref: aboutRef, isVisible: aboutVisible } = useScrollAnimation();
  const tilt = useTiltCard();

  const skills = {
    ai: ["Python", "PyTorch", "TensorFlow", "scikit-learn", "OpenCV", "NumPy", "Pandas", "Matplotlib", "SciPy", "Keras"],
    web: ["Flask", "FastAPI", "React", "NodeJS", "NestJS", "TailwindCSS", "Three.js", "Streamlit", "Flutter", "HTML5", "Jinja", "JavaScript", "TypeScript"],
    cloud: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Firebase", "Google Cloud", "Render", "Vercel"],
    extras: ["HuggingFace", "Transformers", "MediaPipe", "Gradio", "Git", "IoT", "Robotics", "Raspberry Pi", "VS Code", "LangChain"],
  };

  const stats = [
    { value: "1+", label: "Years Experience" },
    { value: "12+", label: "Projects Shipped" },
    { value: "10+", label: "AI/ML Systems" },
    { value: "3", label: "Institutions Trained" },
  ];

  const skillGroups = [
    { title: "AI / ML / DL", items: skills.ai },
    { title: "Web / Backend / APIs", items: skills.web },
    { title: "Databases & Cloud", items: skills.cloud },
    { title: "Additional Tools & Frameworks", items: skills.extras },
  ];

  return (
    <section id="about" ref={aboutRef} className="py-24 bg-background relative overflow-hidden">
      <div className="aurora-bg" aria-hidden />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Editorial header */}
        <div className={`mb-14 sm:mb-16 ${aboutVisible ? "scroll-animate" : "opacity-0"}`}>
          <span className="eyebrow">About Me</span>
          <div className="flex items-end gap-6 flex-wrap mt-5">
            <h2 className="display-heading text-5xl md:text-7xl font-bold">
              Bhavya<br />Kansal
            </h2>
            <div className="pb-2">
              <p className="text-base text-foreground/80 font-medium">AI/ML Engineer · B.Tech DS&AI, TIET</p>
              <p className="text-sm text-muted-foreground">Patiala, Punjab, India</p>
            </div>
          </div>
          <div className="section-rule mt-8" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — Bio */}
          <div className={`space-y-8 ${aboutVisible ? "scroll-animate scroll-animate-delay-1" : "opacity-0"}`}>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p style={{ textAlign: "justify" }}>
                I build AI systems that actually ship — closing the gap between research-grade models and
                production infrastructure. I specialise in deep learning, computer vision, and generative AI
                with a strong focus on solving real-world engineering problems.
              </p>
              <p style={{ textAlign: "justify" }}>
                Currently pursuing B.Tech in Data Science & Artificial Intelligence at{" "}
                <span className="text-foreground font-semibold">Thapar Institute of Engineering & Technology (TIET)</span>,
                Patiala, with prior industrial training at IIT & NIELIT Ropar and a Diploma in CSE from Thapar
                Polytechnic College.
              </p>
              <p style={{ textAlign: "justify" }}>
                My recent work spans applied healthcare AI, accessibility systems, deepfake screening, retinal
                enhancement, and assistant automation. I focus on dependable engineering, clear UX, and
                measurable product outcomes.
              </p>
              <p style={{ textAlign: "justify" }}>
                Research-driven, execution-focused, and systems-oriented — I turn experimental AI workflows into
                production-grade products that make an impact.
              </p>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`stat-tile text-center p-4 rounded-2xl ${
                    aboutVisible ? `scroll-animate scroll-animate-delay-${i + 2}` : "opacity-0"
                  }`}
                >
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Tech Arsenal (3D tilt) */}
          <div
            ref={tilt.cardRef}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className={`glass-card rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden ${
              aboutVisible ? "scroll-animate scroll-animate-delay-2" : "opacity-0"
            }`}
          >
            <div ref={tilt.spotRef} className="card-spotlight" />

            <h3 className="text-2xl font-bold mb-6">Tech Arsenal</h3>

            <div className="space-y-6">
              {skillGroups.map((group) => (
                <div key={group.title}>
                  <h4 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3 font-semibold">
                    {group.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="tech-chip px-3 py-1.5 bg-white dark:bg-white/5 text-black dark:text-white rounded-full text-xs sm:text-sm font-medium border border-border hover:border-black dark:hover:border-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
