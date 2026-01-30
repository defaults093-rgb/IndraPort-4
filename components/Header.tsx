
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  activeSection: string;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onAdminClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Identity' },
    { id: 'work', label: 'Archives' },
    { id: 'services', label: 'Solutions' },
    { id: 'contact', label: 'Bridge' }
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${isScrolled ? 'py-3' : 'py-6 md:py-8'}`}>
      <div className={`
        relative glass rounded-full flex items-center justify-between transition-all duration-300
        w-[92vw] max-w-5xl px-4 md:px-8 py-2 md:py-3
        ${isScrolled ? 'shadow-2xl shadow-indigo-500/10' : ''}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => scrollTo('home')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-sm md:text-base">
            I
          </div>
          <span className="syncopate text-xs md:text-lg font-bold tracking-tighter hidden sm:inline whitespace-nowrap">INDRA VISUALS</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-4 md:gap-6 overflow-hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-[10px] md:text-sm font-medium transition-all duration-300 relative group py-1 px-1.5 md:px-3 rounded-md uppercase tracking-widest sm:normal-case sm:tracking-normal ${activeSection === item.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-indigo-500 transition-all duration-300 ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
        </nav>

        {/* Admin Link */}
        <button 
          onClick={onAdminClick}
          className="p-1.5 md:p-2 text-zinc-500 hover:text-indigo-400 transition-colors shrink-0"
          title="Admin Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
