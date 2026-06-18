import React, { useState, useEffect, useRef } from 'react';


const MobileFAB: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef<number | null>(null);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    // Show FAB immediately
    setShowGlow(true);
    
    // Check if tooltip message has been shown before
    const tooltipShown = localStorage.getItem('fab-tooltip-shown');
    if (!tooltipShown) {
      // Show tooltip after page load
      const timer = setTimeout(() => {
        setShowTooltip(true);
        
        // Auto fade out tooltip after 8 seconds
        setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem('fab-tooltip-shown', 'true');
        }, 10000);  // ← 8000ms = 8 seconds
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktopPointer) return;

    let targetX = 0;
    let targetY = 0;

    const applyTransform = () => {
      if (!fabRef.current) return;
      fabRef.current.style.transform = `translate(${targetX}px, ${targetY}px) scale(1)`;
      rafRef.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!fabRef.current) return;
      
      const fabRect = fabRef.current.getBoundingClientRect();
      const fabCenterX = fabRect.left + fabRect.width / 2;
      const fabCenterY = fabRect.top + fabRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - fabCenterX, 2) + Math.pow(e.clientY - fabCenterY, 2)
      );
      
      // Magnet effect within 100px radius
      if (distance < 100) {
        const attraction = Math.max(0, (100 - distance) / 100);
        targetX = (e.clientX - fabCenterX) * attraction * 0.15;
        targetY = (e.clientY - fabCenterY) * attraction * 0.15;
      } else {
        targetX = 0;
        targetY = 0;
      }

      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(applyTransform);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (fabRef.current) {
        fabRef.current.style.transform = 'translate(0px, 0px) scale(1)';
      }
    };
  }, []);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
    setShowTooltip(false);
  };

  return (
    <>
      <button
        ref={fabRef}
        aria-label="Open AI chatbot"
        onClick={handleClick}
        id="mobile-fab"
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-40 w-16 h-16 md:w-20 md:h-20 rounded-full bg-transparent transform transition-all duration-300 overflow-hidden p-0 group flex items-center justify-center cursor-pointer shadow-xl hover:scale-105"
      >
        <div className="w-full h-full flex items-center justify-center relative bg-transparent rounded-full overflow-hidden">
          <img 
            src="/aagni-avatar.png" 
            alt="AAGNI AI" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 relative z-10"
          />
        </div>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="fixed bottom-10 right-24 md:bottom-12 md:right-32 z-50 bg-black/95 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm border border-white/10 max-w-[200px] text-center"
          style={{
            animation: 'tooltipAppear 0.5s ease-out, tooltipFadeOut 0.5s ease-in 7.5s forwards',
            animationFillMode: 'both'
          }}
        >
          Try the AI assistant to explore my work
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-black/95" />
        </div>
      )}

      <style>{`
        @keyframes tooltipAppear {
          0% { opacity: 0; transform: translateY(10px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes tooltipFadeOut {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.8); }
        }
      `}</style>

    </>
  );
};

export default MobileFAB;
