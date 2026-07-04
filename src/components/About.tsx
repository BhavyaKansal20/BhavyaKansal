import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Cpu, Globe, Database, Wrench } from "lucide-react";

const About = () => {
  const { ref: aboutRef, isVisible: aboutVisible } = useScrollAnimation();

  const skills = {
    ai: [
      "Python", "PyTorch", "TensorFlow", "scikit-learn", "OpenCV",
      "NumPy", "Pandas", "Matplotlib", "SciPy", "Keras", "ONNX", "LangChain",
    ],
    web: [
      "Flask", "FastAPI", "React", "Next.js", "Node.js", "NestJS",
      "TailwindCSS", "Three.js", "Streamlit", "Flutter",
      "HTML5", "JavaScript", "TypeScript", "Jinja",
    ],
    cloud: [
      "PostgreSQL", "MongoDB", "MySQL", "SQLite",
      "Firebase", "Google Cloud", "Render", "Vercel",
    ],
    extras: [
      "HuggingFace", "Transformers", "MediaPipe", "Gradio",
      "Git", "GitHub Actions", "IoT", "Robotics",
      "Raspberry Pi", "VS Code", "Jupyter",
    ],
  };

  const skillCategories = [
    { key: "ai",     label: "AI / ML / DL",        icon: <Cpu className="w-3.5 h-3.5" />,     items: skills.ai },
    { key: "web",    label: "Web / Backend / APIs", icon: <Globe className="w-3.5 h-3.5" />,   items: skills.web },
    { key: "cloud",  label: "Databases & Cloud",    icon: <Database className="w-3.5 h-3.5" />, items: skills.cloud },
    { key: "extras", label: "Additional Tools",     icon: <Wrench className="w-3.5 h-3.5" />,  items: skills.extras },
  ];

  return (
    <section id="about" ref={aboutRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left Content */}
          <div className={`space-y-8 ${aboutVisible ? 'scroll-animate' : ''}`}>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-medium">
                About Me
              </p>
              <h2 className="text-5xl font-bold mb-8 tracking-tight">About me</h2>
            </div>

            <div className="space-y-5 text-lg text-muted-foreground">
              <p style={{ textAlign: "justify" }}>
                I build AI systems that actually ship — closing the gap between research-grade models and production infrastructure. I specialize in <span className="text-foreground font-medium">deep learning</span>, <span className="text-foreground font-medium">computer vision</span>, and <span className="text-foreground font-medium">generative AI</span>, with a strong focus on solving real-world engineering problems that matter.
              </p>
              <p style={{ textAlign: "justify" }}>
                My recent work spans applied healthcare AI, accessibility systems, deepfake detection, and intelligent automation. I focus on dependable engineering, measurable product outcomes, and clean UX that non-technical stakeholders can actually use.
              </p>
              <p style={{ textAlign: "justify" }}>
                Currently pursuing a B.Tech in <span className="text-foreground font-medium">Data Science & Artificial Intelligence</span> at <span className="text-foreground font-medium">Thapar Institute of Engineering & Technology (TIET)</span>, Patiala — one of India's top-ranked technical institutes — while shipping production AI systems on the side.
              </p>
              <p style={{ textAlign: "justify" }}>
                I previously completed intensive AI/ML training at <span className="text-foreground font-medium">IIT & NIELIT Ropar</span>, and a Diploma in Computer Science from <span className="text-foreground font-medium">Thapar Polytechnic College</span>. My mindset is research-driven, execution-focused, and systems-oriented.
              </p>
            </div>

            {/* Achievement stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: "12+", label: "Projects Shipped", sub: "Production-grade" },
                { value: "10+", label: "AI/ML Projects", sub: "End-to-end built" },
                { value: "1+", label: "Years Experience", sub: "Industry-focused" },
              ].map(({ value, label, sub }) => (
                <div
                  key={label}
                  className="card-ripple glass-card rounded-2xl p-4 text-center cursor-default"
                >
                  <div className="text-3xl font-bold mb-1">{value}</div>
                  <div className="text-xs font-semibold text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Skills Card */}
          <div className={`card-ripple glass-card rounded-3xl p-6 md:p-7 shadow-xl ${aboutVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}>
            <h3 className="text-2xl font-bold mb-6 tracking-tight">Tech Arsenal</h3>

            <div className="space-y-5">
              {skillCategories.map(({ key, label, icon, items }) => (
                <div key={key}>
                  <h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3 flex items-center gap-1.5 font-medium">
                    {icon}
                    {label}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-white dark:bg-gray-800/80 text-black dark:text-white rounded-full text-xs font-medium border border-border hover:border-black dark:hover:border-white hover:shadow-sm transition-all duration-150 cursor-default"
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
