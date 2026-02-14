import React, { useState, useEffect } from 'react';

const TypingHeader: React.FC<{ text: string; delay?: number; className?: string; gradient?: boolean }> = ({ text, delay = 0, className = "", gradient = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 60); 

    return () => clearInterval(typingInterval);
  }, [started, text]);

  return (
    <span className={`${className} ${gradient ? 'gradient-text' : ''} inline-block relative max-w-full break-words`}>
      {displayedText}
      <span className={`inline-block w-[2px] h-[0.8em] bg-indigo-500 ml-1 translate-y-1 animate-pulse ${displayedText === text ? 'hidden' : ''}`}></span>
    </span>
  );
};

const Hero: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 relative px-4 sm:px-6 overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-square bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-[80px] md:blur-[160px] rounded-full -z-10 pointer-events-none"
        style={{ transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))` }}
      ></div>

      <div className="text-center w-full max-w-7xl mx-auto relative z-10">
        <div className="mb-10 md:mb-12 reveal">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-indigo-500/20 text-indigo-400 glass">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase tabular-nums">
              {formatTime(time)} • CREATIVE TRANSMISSION ACTIVE
            </span>
          </div>
        </div>
        
        <h1 className="syncopate text-3xl sm:text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.95] sm:leading-[0.9] mb-12 md:mb-16 break-words reveal px-2 uppercase">
          <TypingHeader text="WELCOME TO INDRA" delay={400} /><br />
          <TypingHeader text="VISUAL SOLUTIONS" delay={1800} gradient={true} className="mt-4" />
        </h1>

        <p className="max-w-2xl mx-auto text-[12px] sm:text-lg md:text-2xl text-zinc-400 mb-12 md:mb-16 px-6 reveal font-light leading-relaxed tracking-wide">
          Crafting elite 2D animation, cinematic illustration, and high-impact visual systems. We turn abstract vision into digital legacy.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 md:gap-6 justify-center items-center px-6 reveal w-full max-w-2xl mx-auto">
          <button 
            onClick={() => scrollTo('work')}
            className="w-full sm:w-auto group relative px-10 md:px-14 py-5 md:py-6 bg-indigo-600 rounded-full font-bold transition-all flex items-center justify-center gap-3 overflow-hidden shadow-2xl shadow-indigo-500/30 active:scale-95"
          >
            <span className="relative z-10 uppercase tracking-[0.2em] text-[11px] md:text-sm">Enter Archives</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
          
          <button 
            onClick={() => scrollTo('contact')}
            className="w-full sm:w-auto px-10 md:px-14 py-5 md:py-6 glass border border-zinc-800 rounded-full font-bold transition-all flex items-center justify-center gap-3 hover:border-zinc-500 hover:bg-zinc-800/50 active:scale-95"
          >
            <span className="uppercase tracking-[0.2em] text-[11px] md:text-sm">Contact Bridge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;