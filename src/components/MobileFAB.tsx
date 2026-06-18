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
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-40 w-16 h-16 md:w-20 md:h-20 rounded-full bg-transparent p-0 group flex items-center justify-center cursor-pointer aagni-float"
      >
        <div className="w-full h-full rounded-full overflow-hidden relative aagni-glow-blink">
          <img 
            src="/aagni-avatar.png" 
            alt="AAGNI AI" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 relative z-10"
          />
        </div>
      </button>

      {/* Welcome speech bubble */}
      {showTooltip && (
        <div 
          className="fixed bottom-24 right-4 md:bottom-32 md:right-8 z-50 max-w-[220px] aagni-popup-appear"
        >
          <div className="bg-[#111b21] border border-[#2a3942] text-[#e9edef] px-4 py-3 rounded-2xl rounded-br-sm text-sm shadow-2xl">
            <span className="text-base mr-1">👋</span> Hey! I'm <strong className="text-cyan-400">AAGNI AI</strong> — ask me anything about Bhavya!
          </div>
        </div>
      )}

      <style>{`
        @keyframes aagniFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes aagniGlowBlink {
          0%, 100% { box-shadow: 0 0 0px rgba(6, 182, 212, 0), 0 0 0px rgba(59, 130, 246, 0); }
          50% { box-shadow: 0 0 14px rgba(6, 182, 212, 0.6), 0 0 28px rgba(59, 130, 246, 0.3); }
        }

        @keyframes aagniPopupAppear {
          0% { opacity: 0; transform: translateY(12px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes aagniPopupFade {
          0% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-8px) scale(0.95); }
        }

        .aagni-float {
          animation: aagniFloat 3s ease-in-out infinite;
        }

        .aagni-glow-blink {
          animation: aagniGlowBlink 2.5s ease-in-out infinite;
          border-radius: 9999px;
        }

        .aagni-popup-appear {
          animation: aagniPopupAppear 0.4s ease-out, aagniPopupFade 0.5s ease-in 7.5s forwards;
          animation-fill-mode: both;
        }
      `}</style>
    </>
  );
};

export default MobileFAB;
