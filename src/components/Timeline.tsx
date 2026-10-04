import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const timelineData = [
  {
    role: "General Secretary",
    company: "Code Metrics Research Society (TIET)",
    date: "Present",
    bullets: [
      "Oversees society operations and coordinates across 4 departments (Research, Tech, Marketing & PR, Media & Design).",
      "Drives initiatives bridging academic research with real-world innovation; spearheads strategy, team coordination, and event execution.",
      "Works with faculty leadership including Dr. Prashant Singh Rana and VP Himanshu Gautam to build a research-driven ecosystem.",
      "Contributes to TICSR (Thapar International Conference for Student Research) as the main student lead collaborator."
    ],
    skills: ["Research Skills", "R&D", "Team Leadership", "Team Building", "Leadership"],
  },
  {
    role: "AI/ML Industrial Training",
    company: "IIT Ropar x NIELIT Ropar",
    date: "Jan 2026 - Jul 2026",
    bullets: [
      "TODO(bhavya): Add metric/outcome for IIT Ropar training.",
      "Focused on applied machine learning workflows, model experimentation, and computer vision pipelines."
    ],
    skills: ["Deep Learning", "Applied ML", "Computer Vision", "PyTorch"],
    certificate: "/iit certificate.pdf"
  },
  {
    role: "Summer Trainee",
    company: "Thapar Polytechnic College",
    date: "Jun 2025 - Aug 2025",
    bullets: [
      "Completed intensive summer training in Python, AI/ML, and cybersecurity.",
      "TODO(bhavya): Add concrete outcome/metric for summer training."
    ],
    skills: ["Python", "Machine Learning", "Cybersecurity"],
    certificate: "/tpc summer training.jpg"
  }
];

export default function Timeline() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="experience" ref={ref} className={`py-24 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <span className="eyebrow">Experience</span>
          <h2 className="display-heading text-3xl font-bold mt-2">Work & Leadership</h2>
        </div>
        
        <div className="space-y-12">
          {timelineData.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="md:w-1/4 shrink-0">
                <p className="text-sm font-medium text-muted-foreground">{item.date}</p>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-lg font-bold text-foreground">{item.role}</h3>
                <p className="text-base text-foreground/80 mb-4 font-medium">{item.company}</p>
                
                <ul className="list-disc list-outside ml-4 space-y-2 mb-4 text-muted-foreground text-sm">
                  {item.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded border border-border">
                      {s}
                    </span>
                  ))}
                </div>

                {item.certificate && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-sm font-medium text-accent hover:underline">View Certificate</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-1 bg-black/90 border-none">
                      {item.certificate.endsWith('.pdf') ? (
                        <iframe src={item.certificate} className="w-full h-[80vh] rounded-md bg-white" />
                      ) : (
                        <img src={item.certificate} alt="Certificate" className="w-full h-auto max-h-[85vh] object-contain rounded-md" />
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
