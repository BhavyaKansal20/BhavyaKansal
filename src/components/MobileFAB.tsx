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
        aria-label="Open command palette"
        onClick={handleClick}
        id="mobile-fab"
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 overflow-hidden p-0 group"
        style={{
          animation: showGlow ? 'fabGlow 2.6s ease-in-out infinite' : 'none',
          willChange: 'transform, box-shadow'
        }}
      >
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-white/10 blur-lg scale-125 opacity-70 animate-pulse" aria-hidden />
          <img 
            src="/sparkles.gif" 
            alt="" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            aria-hidden
          />
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="fixed bottom-8 right-20 md:bottom-10 md:right-24 z-50 bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm border border-white/10 max-w-[200px] text-center"
          style={{
            animation: 'tooltipAppear 0.5s ease-out, tooltipFadeOut 0.5s ease-in 7.5s forwards',
            animationFillMode: 'both'
          }}
        >
          Try the AI assistant to explore my work
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-black/90" />
        </div>
      )}

      <style>{`
        @keyframes fabGlow {
          0% { box-shadow: 0 4px 18px rgba(147, 51, 234, 0.24), 0 0 0 rgba(147, 51, 234, 0); }
          50% { box-shadow: 0 10px 42px rgba(147, 51, 234, 0.62), 0 0 70px rgba(147, 51, 234, 0.44); }
          100% { box-shadow: 0 4px 18px rgba(147, 51, 234, 0.24), 0 0 0 rgba(147, 51, 234, 0); }
        }
        
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
