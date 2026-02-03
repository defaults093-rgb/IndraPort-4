
import React, { useState, useMemo } from 'react';
import { Project, Category } from '../types';

interface ProjectGalleryProps {
  projects: Project[];
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projects }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');

  const categories: (Category | 'All')[] = ['All', 'Animation', 'Illustration', 'Logo Design', 'Editing'];

  const filteredProjects = useMemo(() => {
    let list = filter === 'All' 
      ? [...projects]
      : projects.filter(p => p.category === filter);

    // Pinning Logic: Ensure 'thumbnail-editing' is always at index 0 if it exists in the current list
    const pinnedId = 'thumbnail-editing';
    const pinnedIndex = list.findIndex(p => p.id === pinnedId);
    
    if (pinnedIndex > -1) {
      const pinnedItem = list[pinnedIndex];
      const otherItems = list.filter((_, i) => i !== pinnedIndex);
      return [pinnedItem, ...otherItems];
    }
    
    return list;
  }, [projects, filter]);

  return (
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 reveal">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            className="group relative flex flex-col reveal"
          >
            <div 
              className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-zinc-950 border border-white/5 transition-all duration-700 hover:border-indigo-500/20 shadow-2xl"
            >
              <img 
                src={project.imageUrl} 
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-indigo-400 text-[9px] font-black tracking-[0.4em] uppercase mb-2">
                  {project.category}
                </span>
                <h3 className="syncopate text-xl font-bold text-white uppercase tracking-tighter mb-1">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-[10px] font-light leading-relaxed max-w-[85%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                  {project.description}
                </p>
              </div>

              {/* Status Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                {project.id === 'thumbnail-editing' ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse"></div>
                    <span className="text-[7px] font-black text-amber-400 tracking-widest uppercase">FEATURED</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
                    <span className="text-[7px] font-black text-white/60 tracking-widest uppercase">ARCHIVED</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-40 text-center reveal">
          <span className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">No entries found in this sector.</span>
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;
