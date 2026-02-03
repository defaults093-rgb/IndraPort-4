
import React from 'react';

const Footer: React.FC = () => {
  const socials = [
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/indra_visuals?igsh=ZzU2ZWxybG1ldDRw',
      brandColor: 'hover:border-[#E4405F] hover:shadow-[0_0_20px_rgba(228,64,95,0.4)]',
      glowColor: 'bg-[#E4405F]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2"></line>
        </svg>
      )
    },
    { 
      name: 'YouTube', 
      url: 'https://yt.openinapp.co/1wd9z',
      brandColor: 'hover:border-[#FF0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]',
      glowColor: 'bg-[#FF0000]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z" strokeWidth="2"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
        </svg>
      )
    },
    { 
      name: 'Email', 
      url: 'mailto:indravisuals4858@gmail.com',
      brandColor: 'hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]',
      glowColor: 'bg-indigo-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )
    }
  ];

  return (
    <footer className="py-12 md:py-20 border-t border-white/5 bg-zinc-950/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-16 md:mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 md:mb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-lg md:text-xl shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                I
              </div>
              <span className="syncopate text-xl md:text-2xl font-bold tracking-tighter">INDRA VISUALS</span>
            </div>
            <p className="text-zinc-500 max-w-sm mb-8 md:mb-10 leading-relaxed font-light text-sm">
              A creative laboratory pushing the boundaries of visual communication through animation and design excellence.
            </p>
            
            <div className="flex flex-wrap gap-4 md:gap-5">
              {socials.map((social) => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target={social.name === 'Email' ? '_self' : '_blank'} 
                  rel="noopener noreferrer"
                  className={`group relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl glass border border-white/10 transition-all duration-500 ${social.brandColor} hover:-translate-y-2`}
                  title={social.name}
                >
                  <div className="text-zinc-400 group-hover:text-white transition-colors duration-300 relative z-10">
                    {social.icon}
                  </div>
                  
                  <div className={`absolute inset-0 rounded-2xl ${social.glowColor} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}></div>
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-500 ${social.glowColor}`}></div>
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white mb-8">Navigation</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li><a href="#home" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 transition-all"></span>Identity</a></li>
              <li><a href="#work" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 transition-all"></span>Archives</a></li>
              <li><a href="#services" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 transition-all"></span>Solutions</a></li>
              <li><a href="#contact" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 transition-all"></span>Bridge</a></li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white mb-8">Capabilities</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li className="flex items-center gap-3"><span className="w-1 h-1 rounded-full bg-indigo-500"></span> 2D Animation</li>
              <li className="flex items-center gap-3"><span className="w-1 h-1 rounded-full bg-indigo-500"></span> Frame-by-frame</li>
              <li className="flex items-center gap-3"><span className="w-1 h-1 rounded-full bg-indigo-500"></span> Logo Design</li>
              <li className="flex items-center gap-3"><span className="w-1 h-1 rounded-full bg-indigo-500"></span> Visual Identity</li>
              <li className="flex items-center gap-3"><span className="w-1 h-1 rounded-full bg-indigo-500"></span> Creative Editing</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 md:pt-12 border-t border-white/5 gap-4 md:gap-6">
          <p className="text-zinc-600 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-center md:text-left">© {new Date().getFullYear()} Indra Visuals. Precision Engineered.</p>
          <div className="flex gap-6 md:gap-8 text-zinc-600 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Engagement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
