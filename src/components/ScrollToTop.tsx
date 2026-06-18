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
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-[#0c0d12]/80 backdrop-blur-md border border-white/10 text-white shadow-[0_4px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_30px_rgba(99,102,241,0.55)] hover:border-white/20 transform transition-all duration-300 overflow-hidden p-0 group hidden sm:flex items-center justify-center"
        >
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Conically rotating border line wrapper */}
            <div 
              className="absolute inset-[-50%] pointer-events-none z-0 opacity-80 animate-[spin_8s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 40%, #6366f1 50%, #c084fc 65%, transparent 70%)',
              }}
            />
            {/* Solid inner glass cover */}
            <div className="absolute inset-[1.5px] rounded-full bg-[#0c0d12] flex items-center justify-center overflow-hidden z-10">
              <img 
                src="/aagni-avatar.png" 
                alt="AAGNI AI" 
                className="w-11 h-11 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 relative z-10"
              />
            </div>
          </div>
        </button>
      )}



    </>
  );
};

export default ScrollToTop;
