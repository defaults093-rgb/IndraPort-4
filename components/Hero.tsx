
import React, { useState, useEffect, useRef } from 'react';

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
    }, 70); 

    return () => clearInterval(typingInterval);
  }, [started, text]);

  return (
    <span className={`${className} ${gradient ? 'gradient-text' : ''} inline-block relative`}>
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
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 relative px-4 sm:px-6 overflow-hidden">
      {/* Background Effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-[150px] rounded-full -z-10 animate-pulse pointer-events-none"
        style={{ transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))` }}
      ></div>

      <div className="text-center w-full max-w-6xl mx-auto relative z-10">
        <div className="mb-6 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
          <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 rounded-full border border-indigo-500/30 text-indigo-400 glass">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase tabular-nums">
              {formatTime(time)} • AVAILABLE FOR HIRE
            </span>
          </div>
        </div>
        
        <h1 className="syncopate text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-[1.1] mb-8 break-words">
          <TypingHeader text="WELCOME TO INDRA" delay={500} /><br />
          <TypingHeader text="VISUALS SOLUTION" delay={2000} gradient={true} className="mt-2" />
        </h1>

        <p className="max-w-2xl mx-auto text-base md:text-xl text-zinc-400 mb-10 md:mb-12 px-4 opacity-0 animate-[fadeIn_1s_ease-out_3.5s_forwards]">
          Elite 2D animation, cinematic illustration, and high-impact visual design. We turn abstract concepts into digital reality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-[fadeIn_1s_ease-out_4s_forwards] px-6">
          <button 
            onClick={() => scrollTo('work')}
            className="w-full sm:w-auto group relative px-8 md:px-10 py-4 md:py-5 bg-indigo-600 rounded-full font-bold transition-all flex items-center justify-center gap-2 overflow-hidden shadow-2xl shadow-indigo-500/20"
          >
            <span className="relative z-10 uppercase tracking-widest text-xs md:text-sm">Explore Archives</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
          
          <button 
            onClick={() => scrollTo('contact')}
            className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 glass border border-zinc-700 rounded-full font-bold transition-all flex items-center justify-center gap-2 hover:border-zinc-500 hover:bg-zinc-800/50"
          >
            <span className="uppercase tracking-widest text-xs md:text-sm">The Bridge</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default Hero;
