import { useState, useEffect } from "react";
import { Bot } from "lucide-react";


const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={handleClick}
          aria-label="Open AI chatbot"
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-[#0a0a0f]/80 backdrop-blur-md border border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.55)] hover:border-purple-400/80 transform transition-all duration-300 overflow-hidden p-0 group hidden sm:flex items-center justify-center"
        >
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-md scale-110 opacity-70 group-hover:bg-purple-500/20 transition-all" aria-hidden />
            <Bot className="w-6 h-6 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10" />
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </button>
      )}

    </>
  );
};

export default ScrollToTop;
