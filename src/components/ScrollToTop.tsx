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
              className="absolute inset-[-50%] pointer-events-none z-0 opacity-100 animate-[spin_8s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 40%, #06b6d4 50%, #3b82f6 65%, transparent 70%)',
              }}
            />
            {/* Solid inner glass cover (Only robot image is seen inside the glow!) */}
            <div 
              className="absolute inset-[2.5px] rounded-full flex items-center justify-center overflow-hidden z-10"
              style={{ backgroundColor: 'transparent' }}
            >
              <img 
                src="/aagni-avatar.png" 
                alt="AAGNI AI" 
                className="w-full h-full object-cover scale-[1.7] transition-transform duration-300 group-hover:scale-[1.8] relative z-10 mix-blend-screen"
                style={{ filter: 'brightness(1.3) contrast(1.2)' }}
              />
            </div>
          </div>
        </button>
      )}

      <style>{`
        @keyframes neonPulse {
          0% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.4), 0 0 30px rgba(59, 130, 246, 0.2); }
          50% { box-shadow: 0 0 42px rgba(6, 182, 212, 0.95), 0 0 68px rgba(59, 130, 246, 0.65); }
          100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.4), 0 0 30px rgba(59, 130, 246, 0.2); }
        }
      `}</style>
    </>
  );
};

export default ScrollToTop;
