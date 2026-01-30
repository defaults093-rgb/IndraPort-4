
import React, { useState, useEffect, useMemo } from 'react';
import { Project, Category } from '../types';

interface ProjectGalleryProps {
  projects: Project[];
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projects }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories: (Category | 'All')[] = ['All', 'Animation', 'Illustration', 'Logo Design', 'Editing'];

  const filteredProjects = useMemo(() => {
    return filter === 'All' 
      ? projects 
      : projects.filter(p => p.category === filter);
  }, [projects, filter]);

  // Close modal on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProject]);

  return (
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h2 className="syncopate text-4xl md:text-5xl font-bold mb-4 tracking-tighter uppercase">SELECTED ARCHIVES</h2>
          <p className="text-zinc-400 max-w-lg font-light leading-relaxed">A curated collection of visual storytelling across motion, design, and art.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-500 cursor-pointer ${filter === cat ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'glass text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, idx) => (
          <div 
            key={project.id}
            className="group relative flex flex-col reveal"
            style={{ transitionDelay: `${Math.min(idx * 50, 400)}ms` }}
          >
            {/* Image Container - Clickable and Touch-responsive */}
            <div 
              onClick={() => setSelectedProject(project)}
              className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-zinc-950 border border-white/5 transition-all duration-500 group-hover:border-indigo-500/30 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] cursor-pointer touch-manipulation"
            >
              <img 
                src={project.imageUrl} 
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105 opacity-40 group-hover:opacity-100"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-40 transition-opacity duration-500"></div>

              {/* Hover Overlay Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out pointer-events-none">
                <span className="text-indigo-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">
                  {project.category}
                </span>
                <h3 className="syncopate text-xl md:text-2xl font-bold mb-6 text-white uppercase tracking-tighter">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* ACTION BUTTON UNDER IMAGE */}
            <div className="mt-4 px-1">
               <button 
                  onClick={() => setSelectedProject(project)}
                  className="w-full py-4 glass border border-white/5 rounded-2xl flex items-center justify-center gap-3 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all duration-500 active:scale-[0.98] cursor-pointer"
               >
                  <span className="text-[10px] font-black tracking-[0.4em] text-zinc-400 group-hover:text-white uppercase transition-colors">VIEW WORK</span>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full group-hover:animate-pulse"></div>
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cinematic Modal Viewer */}
      {selectedProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-[#050505]/98 backdrop-blur-2xl animate-[fadeIn_0.3s_ease-out]" onClick={() => setSelectedProject(null)}></div>
          
          <div className="relative w-full max-w-6xl h-full max-h-[92vh] flex flex-col glass rounded-[40px] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,1)] animate-[modalEnter_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black flex flex-col items-center">
              
              {/* Media Section - The Centerpiece */}
              <div className="w-full max-w-5xl px-4 md:px-12 pt-12 md:pt-20 flex flex-col items-center">
                <div className="w-full flex items-center justify-center relative group min-h-[40vh] bg-zinc-950 rounded-2xl overflow-hidden">
                  {selectedProject.videoUrl ? (
                    <video 
                      src={selectedProject.videoUrl} 
                      controls 
                      autoPlay 
                      className="max-w-full max-h-[60vh] rounded-2xl shadow-2xl border border-white/10 object-contain z-10"
                    />
                  ) : (
                    <img 
                      src={selectedProject.imageUrl} 
                      alt={selectedProject.title} 
                      className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-2xl border border-white/10 z-10"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-20 h-20 border-2 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500"></div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center text-center animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                  <span className="text-indigo-500 text-[8px] font-black tracking-[0.6em] uppercase mb-1">
                     {selectedProject.category}
                  </span>
                  <h3 className="syncopate text-2xl md:text-5xl font-bold tracking-tighter text-white uppercase mb-8">
                    {selectedProject.title}
                  </h3>

                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="px-16 py-5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-zinc-200 transition-all flex items-center gap-4 active:scale-95 shadow-2xl cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    CLOSE & RETURN
                  </button>
                </div>
              </div>

              {/* Context Section */}
              <div className="w-full px-8 pb-16 md:px-16 md:pb-24 mt-16">
                <div className="max-w-4xl mx-auto border-t border-white/5 pt-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                      <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-4">The Narrative</h4>
                      <p className="text-zinc-400 text-base leading-relaxed font-light italic">
                        "{selectedProject.description || "A conceptual exploration of visual dynamics, meticulously engineered to challenge traditional perspectives and evoke deeper emotional resonance."}"
                      </p>
                    </div>
                    <div className="flex justify-between md:justify-end gap-12 border-l border-white/5 pl-8 hidden sm:flex">
                       <div>
                          <span className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.3em] block mb-2">Year</span>
                          <span className="text-white font-bold text-lg tabular-nums">2025</span>
                       </div>
                       <div>
                          <span className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.3em] block mb-2">Creator</span>
                          <span className="text-white font-bold text-lg">Indra</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exit Shortcut (X) */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white z-[130] cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalEnter {
          from { opacity: 0; transform: scale(0.98) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default ProjectGallery;
