import React from 'react';

const ContactSection: React.FC = () => {
  const socials = [
    { 
      name: 'INSTAGRAM', 
      url: 'https://www.instagram.com/indra__visuals?igsh=MXRzeXZmeXh5d3Z3MA==',
      color: 'hover:text-white hover:border-[#E4405F] hover:bg-[#E4405F]/10 hover:shadow-[0_0_30px_rgba(228,64,95,0.3)]'
    },
    { 
      name: 'YOUTUBE', 
      url: 'https://yt.openinapp.co/1wd9z',
      color: 'hover:text-white hover:border-[#FF0000] hover:bg-[#FF0000]/10 hover:shadow-[0_0_30px_rgba(255,0,0,0.3)]'
    },
    { 
      name: 'EMAIL US', 
      url: 'mailto:indravisuals4858@gmail.com',
      color: 'border-indigo-500/40 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:border-indigo-400 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 bg-[length:200%_auto] animate-[gradientFlow_4s_linear_infinite,pulseGlow_3s_ease-in-out_infinite]',
      isSpecial: true
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <div className="max-w-5xl mx-auto glass rounded-[32px] md:rounded-[50px] overflow-hidden border border-white/5 shadow-2xl bg-zinc-950/20 backdrop-blur-3xl p-6 md:p-16 lg:p-24 relative group">
        
        {/* Decorative background effects */}
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-500/10 blur-[100px] md:blur-[140px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 blur-[100px] md:blur-[140px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <h2 className="syncopate text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tighter uppercase max-w-4xl mx-auto break-words reveal">
            LET'S START <br />
            SOMETHING <br />
            <span className="text-indigo-500">GREAT.</span>
          </h2>

          <p className="text-zinc-400 text-xs sm:text-base md:text-xl mb-10 md:mb-20 max-w-3xl mx-auto font-light leading-relaxed px-2 reveal">
            Ready to bring your ideas to life? Reach out through our dedicated channels or send a direct transmission to start the journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full max-w-3xl border-t border-white/5 pt-10 md:pt-16 mb-12 md:mb-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left reveal">
              <div className="text-[9px] font-bold tracking-[0.4em] text-indigo-400 uppercase mb-3 md:mb-6 flex items-center gap-2">
                <span className="w-4 md:w-8 h-[1px] bg-indigo-500/30"></span>
                Direct Communication
              </div>
              <a 
                href="mailto:indravisuals4858@gmail.com" 
                className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight hover:text-indigo-400 transition-colors duration-500 break-all uppercase"
              >
                indravisuals4858@gmail.com
              </a>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left reveal">
              <div className="text-[9px] font-bold tracking-[0.4em] text-indigo-400 uppercase mb-3 md:mb-6 flex items-center gap-2">
                <span className="w-4 md:w-8 h-[1px] bg-indigo-500/30"></span>
                Studio Base
              </div>
              <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white uppercase">
                Remote / Worldwide
              </div>
            </div>
          </div>

          <div className="w-full max-w-4xl flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-5 reveal">
            {socials.map((social) => (
              <a 
                key={social.name}
                href={social.url}
                target={social.name === 'EMAIL US' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={`flex-1 min-w-[140px] sm:min-w-[200px] px-6 sm:px-8 py-4 sm:py-6 glass border border-white/10 rounded-2xl text-[9px] sm:text-[11px] font-black tracking-[0.4em] text-zinc-500 transition-all duration-500 active:scale-95 text-center flex items-center justify-center gap-3 group/btn overflow-hidden relative ${social.color}`}
              >
                <span className="relative z-10">{social.name}</span>
                {social.name === 'EMAIL US' && (
                  <svg className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                )}
                <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
              </a>
            ))}
          </div>

          <div className="mt-12 md:mt-24 pt-8 border-t border-white/5 w-full reveal">
            <div className="flex justify-center gap-8">
               <div className="flex items-center gap-3 text-zinc-600 text-[9px] uppercase tracking-[0.4em] font-bold">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_#22c55e]"></span>
                 Available for new projects
               </div>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.2); }
          50% { box-shadow: 0 0 40px rgba(99,102,241,0.6); }
        }
      `}} />
    </div>
  );
};

export default ContactSection;