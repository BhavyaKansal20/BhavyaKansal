import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const MobileFAB: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('aagni-welcome-shown')) {
        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem('aagni-welcome-shown', 'true');
        }, 5000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
    setShowTooltip(false);
  };

  return (
    <>
      <button
        aria-label="Open AI chatbot"
        onClick={handleClick}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 bg-foreground text-background rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {showTooltip && (
        <div className="fixed bottom-24 right-6 md:right-8 z-50 max-w-[200px] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-card border border-border text-foreground px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
            Ask me anything about Bhavya's work.
          </div>
        </div>
      )}
    </>
  );
};
export default MobileFAB;
