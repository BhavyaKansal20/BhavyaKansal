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
          className="fixed bottom-8 right-8 z-40 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-transparent transform transition-all duration-300 overflow-hidden p-0 group hidden sm:flex items-center justify-center cursor-pointer"
          style={{
            animation: 'neonPulse 3s ease-in-out infinite',
            willChange: 'transform, box-shadow'
          }}
        >
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Conically rotating border line wrapper */}
            <div 
              className="absolute inset-[-50%] pointer-events-none z-0 opacity-90 animate-[spin_8s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 40%, #6366f1 50%, #06b6d4 65%, transparent 70%)',
              }}
            />
            {/* Solid inner glass cover (Only robot image is seen inside the glow!) */}
            <div className="absolute inset-[3px] rounded-full bg-[#0c0d12] flex items-center justify-center overflow-hidden z-10">
              <img 
                src="/aagni-avatar.png" 
                alt="AAGNI AI" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 relative z-10"
              />
            </div>
          </div>
        </button>
      )}

      <style>{`
        @keyframes neonPulse {
          0% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.4), 0 0 25px rgba(6, 182, 212, 0.2); }
          50% { box-shadow: 0 0 32px rgba(99, 102, 241, 0.8), 0 0 55px rgba(6, 182, 212, 0.5); }
          100% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.4), 0 0 25px rgba(6, 182, 212, 0.2); }
        }
      `}</style>
    </>
  );
};

export default ScrollToTop;
