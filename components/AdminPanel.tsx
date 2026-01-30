
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Project, Category } from '../types';

interface AdminPanelProps {
  projects: Project[];
  onLogout: () => void;
  onBack: () => void;
  onAdd: (project: Project) => void;
  onDelete: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ projects, onLogout, onBack, onAdd, onDelete }) => {
  const [newProject, setNewProject] = useState<Partial<Project>>({
    category: 'Animation',
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: ''
  });
  
  const [isUploading, setIsUploading] = useState<'image' | 'video' | 'saving' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [projectToPurge, setProjectToPurge] = useState<{id: string, title: string} | null>(null);
  const [previewMode, setPreviewMode] = useState<'image' | 'video'>('image');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const TOTAL_CAPACITY_MB = 100;

  // Sync preview mode based on available content
  useEffect(() => {
    if (newProject.videoUrl && !newProject.imageUrl) {
      setPreviewMode('video');
    } else if (newProject.imageUrl && !newProject.videoUrl) {
      setPreviewMode('image');
    }
  }, [newProject.imageUrl, newProject.videoUrl]);

  const stats = useMemo(() => {
    const rawString = JSON.stringify(projects);
    const sizeInBytes = projects.length > 0 ? new Blob([rawString]).size : 0;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    const percentage = (sizeInMB / TOTAL_CAPACITY_MB) * 100;
    
    return {
      total: projects.length,
      mbUsed: sizeInMB.toFixed(sizeInMB < 0.01 ? 3 : 2),
      percent: Math.min(percentage, 100).toFixed(1)
    };
  }, [projects]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = type === 'video' ? 50 : 10; 
    const allowedTypes = type === 'image' 
      ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] 
      : ['video/mp4', 'video/webm', 'video/ogg'];

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File exceeds current threshold (${maxSize}MB). Large assets should be hosted externally and linked via URL.`);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert(`Invalid format. Supported: ${allowedTypes.join(', ')}`);
      return;
    }

    setIsUploading(type);
    setUploadProgress(0);
    
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    reader.onload = () => {
      setNewProject(prev => ({ 
        ...prev, 
        [type === 'image' ? 'imageUrl' : 'videoUrl']: reader.result as string 
      }));
      setPreviewMode(type);
      setIsUploading(null);
      setUploadProgress(0);
    };

    reader.onerror = () => {
      alert("System failed to read local data.");
      setIsUploading(null);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.imageUrl) {
      alert("A Title and Cover Image are mandatory for project indexing.");
      return;
    }

    setIsUploading('saving');
    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      category: (newProject.category as Category) || 'Animation',
      description: newProject.description || '',
      imageUrl: newProject.imageUrl,
      videoUrl: newProject.videoUrl
    };

    try {
      await onAdd(project);
      setNewProject({ category: 'Animation', title: '', description: '', imageUrl: '', videoUrl: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (videoInputRef.current) videoInputRef.current.value = '';
    } finally {
      setIsUploading(null);
    }
  };

  const executePurge = async () => {
    if (!projectToPurge) return;
    const { id } = projectToPurge;
    setProjectToPurge(null);
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-12 text-zinc-300 font-['Space Grotesk']">
      <div className="max-w-7xl mx-auto">
        {/* Header Branding */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <div>
              <h1 className="syncopate text-2xl md:text-3xl font-bold tracking-tighter text-white uppercase">ARCHIVE TERMINAL</h1>
              <div className="flex items-center gap-4 mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                <span className="text-indigo-400">{stats.total} Projects</span>
                <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                <span>{stats.mbUsed} MB Index Size</span>
              </div>
            </div>
          </div>
          <button onClick={onLogout} className="px-8 py-3 glass border border-red-500/20 text-red-500 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-all cursor-pointer">End Session</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Side */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="glass p-8 rounded-[40px] border border-white/5 sticky top-12 bg-zinc-950/40 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="syncopate text-[10px] font-bold tracking-[0.3em] text-white uppercase">Create Manifest</h2>
                <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">V.2.1 Sync</div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Visual Previewer */}
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-[24px] bg-zinc-900 overflow-hidden border border-white/5 shadow-2xl group">
                    {previewMode === 'image' ? (
                      newProject.imageUrl ? (
                        <img src={newProject.imageUrl} className="w-full h-full object-cover animate-in fade-in duration-500" alt="Cover Preview" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 gap-3">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          <span className="text-[8px] font-black uppercase tracking-[0.4em]">No Cover Visual</span>
                        </div>
                      )
                    ) : (
                      newProject.videoUrl ? (
                        <video src={newProject.videoUrl} className="w-full h-full object-cover animate-in fade-in duration-500" controls muted />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 gap-3">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                          <span className="text-[8px] font-black uppercase tracking-[0.4em]">No Video Data</span>
                        </div>
                      )
                    )}

                    {isUploading && isUploading !== 'saving' && (
                      <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 z-20">
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
                          <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Encoding Sector: {uploadProgress}%</span>
                      </div>
                    )}

                    {/* Preview Toggle Buttons */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button type="button" onClick={() => setPreviewMode('image')} className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${previewMode === 'image' ? 'bg-white text-black' : 'bg-black/50 backdrop-blur text-white hover:bg-black/70'}`}>Preview Image</button>
                      <button type="button" onClick={() => setPreviewMode('video')} className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${previewMode === 'video' ? 'bg-white text-black' : 'bg-black/50 backdrop-blur text-white hover:bg-black/70'}`}>Preview Video</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Basic Metadata */}
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 block group-focus-within:text-indigo-400 transition-colors">Manifest Title</label>
                      <input 
                        type="text" 
                        value={newProject.title} 
                        onChange={e => setNewProject({...newProject, title: e.target.value})} 
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 text-sm text-white transition-all placeholder:text-zinc-700" 
                        placeholder="Study of Fluid Dynamics"
                        required 
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 block">Classification</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Animation', 'Illustration', 'Logo Design', 'Editing'].map(cat => (
                          <button 
                            key={cat}
                            type="button"
                            onClick={() => setNewProject({...newProject, category: cat as Category})}
                            className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${newProject.category === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-900/50 border border-white/5 text-zinc-600 hover:text-zinc-400'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 block group-focus-within:text-indigo-400 transition-colors">Creative Narrative</label>
                      <textarea 
                        value={newProject.description} 
                        onChange={e => setNewProject({...newProject, description: e.target.value})} 
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 text-sm text-white h-32 resize-none transition-all custom-scrollbar placeholder:text-zinc-700" 
                        placeholder="Detail the technical hurdles and artistic inspiration..."
                      />
                    </div>
                  </div>

                  {/* Remote Connectivity */}
                  <div className="p-6 rounded-[28px] border border-white/5 bg-zinc-900/20 space-y-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Network Source Links</span>
                    </div>
                    
                    <div>
                      <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 mb-1.5 block">Image CDN URL</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={newProject.imageUrl} 
                          onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} 
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 outline-none focus:border-indigo-500/30 text-[11px] text-zinc-400 font-mono placeholder:text-zinc-800" 
                          placeholder="https://cdn.indra.visuals/img.webp" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                           <button type="button" onClick={() => fileInputRef.current?.click()} className="text-zinc-700 hover:text-white transition-colors" title="Upload Local Image">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                           </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 mb-1.5 block">Video Resource URL (Optional)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={newProject.videoUrl} 
                          onChange={e => setNewProject({...newProject, videoUrl: e.target.value})} 
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 outline-none focus:border-indigo-500/30 text-[11px] text-zinc-400 font-mono placeholder:text-zinc-800" 
                          placeholder="https://vimeo.com/indra/clip.mp4" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                           <button type="button" onClick={() => videoInputRef.current?.click()} className="text-zinc-700 hover:text-white transition-colors" title="Upload Local Video">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                           </button>
                        </div>
                      </div>
                    </div>

                    <input type="file" ref={fileInputRef} onChange={e => handleFileChange(e, 'image')} className="hidden" accept="image/*" />
                    <input type="file" ref={videoInputRef} onChange={e => handleFileChange(e, 'video')} className="hidden" accept="video/*" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isUploading !== null} 
                  className="w-full py-5 bg-white text-black font-black rounded-2xl transition-all uppercase tracking-[0.4em] text-[10px] cursor-pointer shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-zinc-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading === 'saving' ? 'Synchronizing...' : 'Deploy Manifest'}
                </button>
              </form>
            </div>
          </div>

          {/* Records Display Side */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="syncopate text-[10px] font-black tracking-[0.5em] text-zinc-500 uppercase">Archive Recordset</h2>
              <div className="h-px bg-white/5 flex-1 mx-8 hidden md:block"></div>
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{projects.length} Total Nodes</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <div className="col-span-full py-32 text-center glass rounded-[40px] border-dashed border-2 border-zinc-900 flex flex-col items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center text-zinc-800">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">Terminal Awaiting Data Inflow</span>
                </div>
              ) : [...projects].reverse().map((project) => (
                <div key={project.id} className="glass p-5 rounded-[32px] flex gap-5 items-center border border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition-all hover:-translate-y-1">
                  {deletingId === project.id && (
                    <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center z-20">
                      <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-red-600 animate-[loading_1s_ease-in-out_infinite]"></div>
                      </div>
                      <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Purging Sector...</span>
                    </div>
                  )}

                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 flex-shrink-0 shadow-lg">
                    <img src={project.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-black text-indigo-500 uppercase mb-1 block tracking-[0.2em]">{project.category}</span>
                    <h3 className="font-bold text-white text-sm uppercase truncate tracking-tight">{project.title}</h3>
                    <p className="text-[10px] text-zinc-600 truncate mt-1.5 font-light">{project.description || 'Null narrative data.'}</p>
                    {project.videoUrl && (
                      <div className="mt-2 flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 bg-green-500/40 rounded-full"></div>
                         <span className="text-[7px] text-zinc-700 uppercase font-black tracking-widest">Video Stream Ready</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setProjectToPurge({ id: project.id, title: project.title })}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/5 text-zinc-800 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Overlay */}
      {projectToPurge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setProjectToPurge(null)}></div>
          <div className="relative glass p-10 rounded-[48px] border border-red-500/20 max-w-md w-full text-center shadow-3xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </div>
            <h3 className="syncopate text-xl font-bold text-white mb-4 uppercase tracking-tighter">Initiate Purge?</h3>
            <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-light px-4">Permanent erasure of record <b>"{projectToPurge.title}"</b>. This visual artifact will be removed from all global indices.</p>
            <div className="flex flex-col gap-3">
              <button onClick={executePurge} className="w-full py-5 bg-red-600 text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] cursor-pointer hover:bg-red-700 transition-colors shadow-2xl shadow-red-600/20">Purge Record</button>
              <button onClick={() => setProjectToPurge(null)} className="w-full py-5 glass text-zinc-400 font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] cursor-pointer hover:text-white transition-colors">Abort Mission</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AdminPanel;
