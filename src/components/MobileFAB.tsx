import React, { useState, useEffect, useRef } from 'react';


const MobileFAB: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if welcome popup has been shown before
    const popupShown = localStorage.getItem('aagni-welcome-shown');
    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowTooltip(true);

        // Auto dismiss after 8 seconds
        setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem('aagni-welcome-shown', 'true');
        }, 8000);
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
      fabRef.current.style.transform = `translate(${targetX}px, ${targetY}px)`;
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
        fabRef.current.style.transform = 'translate(0px, 0px)';
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
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 w-[68px] h-[68px] rounded-full p-0 group flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-foreground/10 to-foreground/5 backdrop-blur-xl pointer-events-none" />
        <div className="absolute inset-[1px] rounded-full bg-background/90 z-0" />
        <div className="absolute inset-0 rounded-full border border-border/50 z-10" />
        
        <div className="w-[85%] h-[85%] rounded-full overflow-hidden relative z-20 shadow-inner bg-card">
          <img 
            src="/aagni-avatar.png" 
            alt="AAGNI AI" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Ambient glow behind button */}
        <div className="absolute inset-[-20%] rounded-full bg-primary/20 blur-[20px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>

      {/* Welcome speech bubble */}
      {showTooltip && (
        <div 
          className="fixed bottom-[100px] right-6 md:bottom-[116px] md:right-10 z-50 max-w-[240px] animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="bg-background/80 backdrop-blur-xl border border-border/50 text-foreground px-5 py-4 rounded-2xl rounded-br-sm shadow-2xl">
            <p className="text-sm leading-relaxed font-medium">
              <span className="text-base mr-2">✨</span> 
              Hello! I'm <strong className="text-primary font-bold">AAGNI AI</strong>. Ask me anything about Bhavya's work or experience.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFAB;
