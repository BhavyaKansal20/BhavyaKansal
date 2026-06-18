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
          <div className="w-full h-full flex items-center justify-center relative bg-transparent rounded-full overflow-hidden">
            <img 
              src="/aagni-avatar.png" 
              alt="AAGNI AI" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 relative z-10"
            />
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
