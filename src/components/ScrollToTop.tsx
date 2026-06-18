import { useState, useEffect } from "react";


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
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-[#0c0d12]/80 backdrop-blur-md border border-white/10 text-white shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.45)] hover:border-white/20 transform transition-all duration-300 overflow-hidden p-0 group hidden sm:flex items-center justify-center"
        >
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-white/[0.02] blur-md scale-110 opacity-70 group-hover:bg-white/[0.05] transition-all" aria-hidden />
            <div className="w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 relative z-10">
              <svg className="w-full h-full animate-[pulse_2.2s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="scrollOrbGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity="1" />
                    <stop offset="60%" stopColor="#6366f1" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="12" cy="12" r="10" fill="url(#scrollOrbGrad)" />
                <circle cx="12" cy="12" r="8" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.85" className="animate-[spin_7s_linear_infinite]" style={{ transformOrigin: 'center' }} />
                <circle cx="12" cy="12" r="5" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="0.85" className="animate-[spin_4s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }} />
                <circle cx="12" cy="12" r="3" fill="#ffffff" className="animate-[ping_2s_ease-in-out_infinite]" style={{ transformOrigin: 'center', animationDuration: '1.6s' }} />
                <circle cx="12" cy="12" r="1.8" fill="#ffffff" />
              </svg>
            </div>
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </button>
      )}


    </>
  );
};

export default ScrollToTop;
