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
          className="fixed bottom-8 right-8 z-40 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-transparent p-0 group hidden sm:flex items-center justify-center cursor-pointer aagni-float"
        >
          <div className="w-full h-full rounded-full overflow-hidden relative aagni-glow-blink">
            <img 
              src="/aagni-avatar.png" 
              alt="AAGNI AI" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 relative z-10"
            />
          </div>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
