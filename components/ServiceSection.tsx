
import React from 'react';
import { SERVICES } from './constants';

const ServiceSection: React.FC = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mb-20">
        <h2 className="syncopate text-4xl md:text-5xl font-bold mb-6">UNMATCHED <br /><span className="text-indigo-500">EXPERTISE</span></h2>
        <p className="text-zinc-400 text-xl">We combine technical mastery with artistic vision to create unforgettable brand experiences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SERVICES.map((service, idx) => (
          <div 
            key={idx}
            className="group glass p-10 rounded-3xl hover:bg-white/[0.05] transition-all duration-500 border-l-4 border-l-transparent hover:border-l-indigo-500"
          >
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={service.icon}></path>
              </svg>
            </div>

            <h3 className="syncopate text-2xl font-bold mb-4">{service.title}</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">{service.description}</p>

            <ul className="grid grid-cols-2 gap-3">
              {service.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Visual Accents */}
      <div className="mt-24 py-20 border-y border-white/5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-12 px-12">
              <span className="syncopate text-6xl md:text-8xl font-bold opacity-10 outline-text">ANIMATION</span>
              <span className="w-4 h-4 rounded-full bg-indigo-500 opacity-20"></span>
              <span className="syncopate text-6xl md:text-8xl font-bold opacity-10 outline-text">ILLUSTRATION</span>
              <span className="w-4 h-4 rounded-full bg-indigo-500 opacity-20"></span>
              <span className="syncopate text-6xl md:text-8xl font-bold opacity-10 outline-text">LOGO DESIGN</span>
              <span className="w-4 h-4 rounded-full bg-indigo-500 opacity-20"></span>
              <span className="syncopate text-6xl md:text-8xl font-bold opacity-10 outline-text">EDITING</span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
        .outline-text {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.2);
        }
      `}} />
    </div>
  );
};

export default ServiceSection;
