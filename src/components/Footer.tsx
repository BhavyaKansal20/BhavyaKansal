import { Link } from "react-router-dom";
import { Github, Linkedin, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    const ua = navigator.userAgent || "";
    const isChromeLike = /(Chrome|CriOS)/.test(ua) && !/(Edg|OPR|Opera)/.test(ua);
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const behavior = isChromeLike && !isMobileUA ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
  };

  return (
    <footer className="bg-[#0a0a0a] py-16 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Left Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">bhavyakansal.dev</h3>
            <p className="text-gray-400">
              AI Engineer, ML Researcher, and Founder building production-ready deep-tech systems across multimodal AI, vision, and automation.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/in/kansal0920"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/BhavyaKansal20"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
            
          </div>

          {/* Middle Column - Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Navigation</h4>
            <nav className="space-y-2">
              <a href="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </a>
              <a href="#projects" className="block text-gray-400 hover:text-white transition-colors">
                Projects
              </a>
              <a href="#about" className="block text-gray-400 hover:text-white transition-colors">
                About
              </a>
              <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
              <a href="#faq" className="block text-gray-400 hover:text-white transition-colors">
                FAQs
              </a>
            </nav>
          </div>

          {/* Right Column - CTA with glass effect */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 space-y-4 border border-white/10">
              <h4 className="text-xl font-semibold text-white">Let's talk</h4>
              <p className="text-gray-400 text-sm">
                Open for AI/ML internships, research collaborations, and deep-tech product building.
              </p>
              <a
                href="mailto:kansalbhavya27@gmail.com"
                className="text-sm text-white hover:text-blue-400 flex items-center gap-2 transition-colors"
              >
                kansalbhavya27@gmail.com
                <ArrowUp className="w-4 h-4 rotate-45" />
              </a>
              <Button
                onClick={scrollToTop}
                variant="outline"
                className="w-full rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all"
              >
                Back to top
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 Bhavya Kansal. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Experience: 1+ Year
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Projects: 10+
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                AI Projects: 5+
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Maintained by Bhavya Kansal.
            </p>
            <p className="text-xs text-white/70">जय श्री राम 🙏❤️</p>
          </div>
          
          {/* Command Palette Hint */}
          <div className="mt-6 hidden sm:flex justify-center">
            <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <span>Press</span>
              <kbd className="px-2 py-1 text-xs font-semibold bg-white/10 border border-white/20 rounded text-white">
                Ctrl+K
              </kbd>
              <span>to open the command palette</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
