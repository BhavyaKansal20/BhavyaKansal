import fs from 'fs';

let content = fs.readFileSync('src/components/Timeline.tsx', 'utf-8');

// Update interface to support certificate
content = content.replace(
  `type?: "education" | "work" | "training";`,
  `type?: "education" | "work" | "training" | "leadership";\n  certificate?: string;`
);

// Add General Secretary entry
const genSecEntry = `
  {
    date: "PRESENT",
    title: "General Secretary",
    company: "CODE METRICS Research Society",
    period: "Present",
    type: "leadership",
    summary: "Spearheading society strategy, team coordination, and event execution at Thapar Institute of Engineering & Technology, operating under CSED and DORSP.",
    tech: ["Leadership", "Research Skills", "R&D", "Team Building"],
    logos: ["/tiet_logo.png"],
  },`;

content = content.replace(
  `const timelineData: TimelineItem[] = [`,
  `const timelineData: TimelineItem[] = [${genSecEntry}`
);

// Add certificates
content = content.replace(
  `company: "Thapar Polytechnic College",\n    period: "Jun 2025 – Aug 2025",`,
  `company: "Thapar Polytechnic College",\n    period: "Jun 2025 – Aug 2025",\n    certificate: "/tpc summer training.jpg",`
);

content = content.replace(
  `company: "IIT & NIELIT Ropar",\n    period: "Jan 2026 – Jul 2026",`,
  `company: "IIT & NIELIT Ropar",\n    period: "Jan 2026 – Jul 2026",\n    certificate: "/iit certificate.pdf",`
);

// We need a Dialog for certificates. We can use standard shadcn Dialog, or just a simple state overlay.
// To avoid complex UI changes, we can just link to it if the prompt doesn't strictly say "implement a complex modal", wait it says:
// "Certificate viewer: accessible frosted lightbox (focus trap, Esc, zoom on mobile, lazy full-size load)."
// We will add the Dialog import and use it.
const dialogImport = `import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";\nimport { Maximize2 } from "lucide-react";\n`;
content = content.replace(`import { useTiltCard } from "@/hooks/useTiltCard";`, `import { useTiltCard } from "@/hooks/useTiltCard";\n${dialogImport}`);

// Add certificate button in TiltCard
const certButton = `
        {item.certificate && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="mt-4 flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Maximize2 className="w-3 h-3" /> View Certificate
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
              {item.certificate.endsWith('.pdf') ? (
                <iframe src={item.certificate} className="w-full h-[80vh] rounded-xl bg-white" />
              ) : (
                <img src={item.certificate} className="w-full h-auto max-h-[80vh] object-contain rounded-xl" alt="Certificate" loading="lazy" />
              )}
            </DialogContent>
          </Dialog>
        )}
`;

content = content.replace(
  `{item.tech.map((t) => (`,
  `${certButton}\n          <div className="flex flex-wrap gap-1.5 mt-4">{item.tech.map((t) => (`
);
content = content.replace(
  `<div className="flex flex-wrap gap-1.5 mt-4">\n          <div className="flex flex-wrap gap-1.5 mt-4">`,
  `<div className="flex flex-wrap gap-1.5 mt-4">`
);

fs.writeFileSync('src/components/Timeline.tsx', content);
console.log('Timeline Data Patched');
