import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const About = () => {
  const { ref: aboutRef, isVisible: aboutVisible } = useScrollAnimation();
  
  const skills = {
    ai: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "OpenCV",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "SciPy",
    ],
    web: [
      "Flask",
      "FastAPI",
      "React",
      "NodeJS",
      "NestJS",
      "TailwindCSS",
      "Three.js",
      "Streamlit",
      "Flutter",
      "HTML5",
      "Jinja",
      "JavaScript",
    ],
    cloud: [
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "SQLite",
      "Firebase",
      "Google Cloud",
      "Render",
    ],
    extras: [
      "HuggingFace",
      "Transformers",
      "MediaPipe",
      "Gradio",
      "Git",
      "IoT",
      "Robotics",
      "Raspberry Pi",
      "VS Code",
    ],
  };

  return (
    <section id="about" ref={aboutRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className={`space-y-8 ${aboutVisible ? 'scroll-animate' : ''}`}>
            <div>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                About Me
              </p>
              <h2 className="text-5xl font-bold mb-8">About me</h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                I build AI systems that actually ship, closing the gap between research-grade models and production infrastructure. I specialize in deep learning, computer vision, and generative AI with a strong focus on solving real-world engineering problems.
              </p>

              <p>
                I am the founder of <span className="font-bold text-black dark:text-white">MultiModex AI</span>, where I am engineering multimodal reasoning infrastructure that unifies vision, language, and decision logic into one deployable system. I also created Project AAGNI, an augmented assistant designed for complex real-time decision support.
              </p>

              <p>
                My mindset is research-driven, execution-focused, and systems-oriented. I prioritize reliability, measurable impact, and turning experimental AI workflows into production-grade products.
              </p>
            </div>

          </div>

          {/* Right Content - Skills Card */}
          <div className={`glass-card rounded-3xl p-6 md:p-7 shadow-xl ${aboutVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}>
                <h3 className="text-2xl font-bold mb-6">Tech Arsenal</h3>

            <div className="space-y-6">
              {/* AI / ML / DL */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  AI / ML / DL
                </h4>
                <div className="flex flex-wrap gap-2.5">
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
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Web / Backend / APIs
                </h4>
                <div className="flex flex-wrap gap-2.5">
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
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Databases & Cloud
                </h4>
                <div className="flex flex-wrap gap-2.5">
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
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Additional Tools
                </h4>
                <div className="flex flex-wrap gap-2.5">
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
