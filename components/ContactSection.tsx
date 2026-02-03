
import React from 'react';

const ContactSection: React.FC = () => {
  const socials = [
    { 
      name: 'INSTAGRAM', 
      url: 'https://www.instagram.com/indra_visuals?igsh=ZzU2ZWxybG1ldDRw',
      color: 'hover:text-white hover:border-[#E4405F] hover:bg-[#E4405F]/10 hover:shadow-[0_0_30px_rgba(228,64,95,0.3)]'
    },
    { 
      name: 'YOUTUBE', 
      url: 'https://yt.openinapp.co/1wd9z',
      color: 'hover:text-white hover:border-[#FF0000] hover:bg-[#FF0000]/10 hover:shadow-[0_0_30px_rgba(255,0,0,0.3)]'
    },
    { 
      name: 'TWITTER', 
      url: '#',
      color: 'hover:text-white hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:shadow-[0_0_30px_rgba(29,161,242,0.3)]'
    },
    { 
      name: 'LINKEDIN', 
      url: '#',
      color: 'hover:text-white hover:border-[#0077B5] hover:bg-[#0077B5]/10 hover:shadow-[0_0_30px_rgba(0,119,181,0.3)]'
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <div className="max-w-5xl mx-auto glass rounded-[40px] md:rounded-[50px] overflow-hidden border border-white/5 shadow-2xl bg-zinc-950/20 backdrop-blur-3xl p-8 md:p-16 lg:p-24 relative group">
        
        {/* Decorative background effects */}
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-500/10 blur-[100px] md:blur-[140px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 blur-[100px] md:blur-[140px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <h2 className="syncopate text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-10 leading-tight tracking-tighter uppercase max-w-4xl mx-auto break-words reveal">
            LET'S START <br />
            SOMETHING <br />
            <span className="text-indigo-500">GREAT.</span>
          </h2>

          <p className="text-zinc-400 text-sm md:text-lg lg:text-xl mb-12 md:mb-20 max-w-3xl mx-auto font-light leading-relaxed px-4 reveal">
            Ready to bring your ideas to life? Fill out the form or reach out through social channels to start a conversation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 w-full max-w-3xl border-t border-white/5 pt-12 md:pt-16 mb-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left reveal">
              <div className="text-[10px] font-bold tracking-[0.4em] text-indigo-400 uppercase mb-4 md:mb-6 flex items-center gap-3">
                <span className="w-6 md:w-8 h-[1px] bg-indigo-500/30"></span>
                Direct Communication
              </div>
              <a 
                href="mailto:defaults093@gmail.com" 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight hover:text-indigo-400 transition-colors duration-500 break-all uppercase"
              >
                defaults093@gmail.com
              </a>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left reveal">
              <div className="text-[10px] font-bold tracking-[0.4em] text-indigo-400 uppercase mb-4 md:mb-6 flex items-center gap-3">
                <span className="w-6 md:w-8 h-[1px] bg-indigo-500/30"></span>
                Studio Base
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white uppercase">
                Remote / Worldwide
              </div>
            </div>
          </div>

          <div className="w-full max-w-4xl flex flex-wrap justify-center gap-4 md:gap-5 reveal">
            {socials.map((social) => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 min-w-[150px] px-8 py-5 glass border border-white/10 rounded-2xl text-[11px] font-black tracking-[0.4em] text-zinc-500 transition-all duration-500 active:scale-95 text-center ${social.color}`}
              >
                {social.name}
              </a>
            ))}
          </div>

          <div className="mt-16 md:mt-24 pt-10 border-t border-white/5 w-full reveal">
            <div className="flex justify-center gap-8">
               <div className="flex items-center gap-4 text-zinc-600 text-[10px] uppercase tracking-[0.5em] font-bold">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_#22c55e]"></span>
                 Available for new projects
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
