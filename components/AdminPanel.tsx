
import React, { useState, useRef, useMemo } from 'react';
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
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [projectToPurge, setProjectToPurge] = useState<{id: string, title: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const TOTAL_CAPACITY_MB = 100;

  const stats = useMemo(() => {
    const rawString = JSON.stringify(projects);
    const sizeInBytes = new Blob([rawString]).size;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    const percentage = (sizeInMB / TOTAL_CAPACITY_MB) * 100;
    
    return {
      total: projects.length,
      mbUsed: sizeInMB.toFixed(2),
      percent: Math.min(percentage, 100).toFixed(1)
    };
  }, [projects]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Robust Validation
    const maxSize = type === 'video' ? 40 : 4; 
    const allowedTypes = type === 'image' 
      ? ['image/jpeg', 'image/png', 'image/webp'] 
      : ['video/mp4', 'video/webm'];

    if (file.size > maxSize * 1024 * 1024) {
      alert(`Security Alert: File exceeds maximum payload of ${maxSize}MB.`);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert(`Invalid Format: Only ${type === 'image' ? 'JPG, PNG, WEBP' : 'MP4, WEBM'} supported.`);
      return;
    }

    setIsUploading(type);
    setUploadProgress(0);
    
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.onload = () => {
      setNewProject(prev => ({ 
        ...prev, 
        [type === 'image' ? 'imageUrl' : 'videoUrl']: reader.result as string 
      }));
      setIsUploading(null);
      setUploadProgress(0);
    };

    reader.onerror = () => {
      alert("Transfer interrupted. Please retry.");
      setIsUploading(null);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.imageUrl) {
      alert("System Error: Title and Thumbnail are required for indexing.");
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
    } finally {
      setIsUploading(null);
    }
  };

  const initiatePurge = (id: string, title: string) => {
    setProjectToPurge({ id, title });
  };

  const executePurge = async () => {
    if (!projectToPurge) return;
    
    const { id } = projectToPurge;
    setProjectToPurge(null); // Close modal
    setDeletingId(id);
    setDeleteProgress(0);
    
    // Simulate progress for visual feedback as DB operations are fast
    const interval = setInterval(() => {
      setDeleteProgress(prev => {
        if (prev >= 95) return prev;
        return prev + 5;
      });
    }, 40);

    try {
      await onDelete(id);
      setDeleteProgress(100);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setDeletingId(null);
        setDeleteProgress(0);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-12 text-zinc-300 font-['Space Grotesk']">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
              <h1 className="syncopate text-2xl font-bold tracking-tighter text-white uppercase">Command Center</h1>
            </div>
            <div className="flex items-center gap-4 ml-12 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
              <span className="text-indigo-400">{stats.total} Artifacts</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
              <span>{stats.mbUsed}MB Indexed</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
              <span className={Number(stats.percent) > 80 ? 'text-red-500' : 'text-zinc-500'}>{stats.percent}% Storage</span>
            </div>
          </div>
          <button onClick={onLogout} className="px-6 py-2 glass border border-red-500/30 text-red-500 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/10 cursor-pointer">De-authenticate</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Add Project Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="glass p-8 rounded-[32px] border border-white/5 sticky top-12 bg-zinc-950/40 shadow-2xl">
              <h2 className="syncopate text-xs font-bold mb-8 tracking-[0.2em] text-white flex items-center gap-3 uppercase">
                <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></div>
                Publish New Work
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="w-full aspect-video rounded-2xl bg-zinc-900 overflow-hidden border border-zinc-800 flex items-center justify-center relative">
                    {newProject.imageUrl ? (
                      <img src={newProject.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 opacity-20 text-center">
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span className="text-[10px] uppercase font-black tracking-widest block">No Media Found</span>
                      </div>
                    )}
                    
                    {/* Upload Progress Overlay */}
                    {isUploading && isUploading !== 'saving' && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden mb-4 max-w-[80%]">
                          <div 
                            className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_#6366f1]" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Processing: {uploadProgress}%</span>
                      </div>
                    )}

                    {isUploading === 'saving' && (
                      <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span className="text-[10px] text-white font-black uppercase tracking-widest">Syncing Archive...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 ml-1 mb-1 block">Project Title</label>
                    <input type="text" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-sm text-white" placeholder="e.g. Kinetic Identity V1" required />
                  </div>

                  <div>
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 ml-1 mb-1 block">Classification</label>
                    <select value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value as Category})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-sm text-white cursor-pointer">
                      <option value="Animation">Animation</option>
                      <option value="Illustration">Illustration</option>
                      <option value="Logo Design">Logo Design</option>
                      <option value="Editing">Editing</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="py-3 bg-white/5 border border-zinc-800 rounded-xl text-[9px] font-bold uppercase text-zinc-400 hover:bg-white/10 transition-colors cursor-pointer">Select Cover</button>
                    <button type="button" onClick={() => videoInputRef.current?.click()} className="py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] font-bold uppercase text-indigo-400 hover:bg-indigo-500/20 transition-colors cursor-pointer">Select Clip</button>
                    <input type="file" ref={fileInputRef} onChange={e => handleFileChange(e, 'image')} className="hidden" accept="image/jpeg,image/png,image/webp" />
                    <input type="file" ref={videoInputRef} onChange={e => handleFileChange(e, 'video')} className="hidden" accept="video/mp4,video/webm" />
                  </div>
                </div>

                <button type="submit" disabled={isUploading !== null} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Deploy Artifact</button>
              </form>
            </div>
          </div>

          {/* Existing Projects List */}
          <div className="lg:col-span-7 xl:col-span-8">
            <h2 className="syncopate text-[10px] font-black mb-8 tracking-[0.4em] text-zinc-500 uppercase flex items-center gap-4">
              Stored Archives 
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <div className="col-span-full py-24 text-center glass rounded-3xl border-dashed border-2 border-zinc-900 text-zinc-700">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Central Database Empty</span>
                </div>
              ) : [...projects].reverse().map((project) => (
                <div 
                  key={project.id} 
                  className={`glass p-4 rounded-[24px] flex gap-4 items-center group border border-white/5 hover:border-indigo-500/20 transition-all relative overflow-hidden`}
                >
                  {/* Deletion Progress Overlay */}
                  {deletingId === project.id && (
                    <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-3 max-w-[80%]">
                        <div 
                          className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
                          style={{ width: `${deleteProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <span className="text-[9px] text-red-500 font-black uppercase tracking-[0.3em]">Purging Archive: {deleteProgress}%</span>
                        <span className="text-[7px] text-zinc-600 uppercase tracking-widest animate-pulse">De-indexing sectors...</span>
                      </div>
                    </div>
                  )}

                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/5 relative">
                    <img src={project.imageUrl} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest block mb-0.5">{project.category}</span>
                    <h3 className="font-bold truncate text-white text-xs uppercase tracking-tight">{project.title}</h3>
                  </div>

                  <button 
                    onClick={() => initiatePurge(project.id, project.title)}
                    className={`p-3 transition-all rounded-xl cursor-pointer text-zinc-600 hover:text-red-500 hover:bg-red-500/5`}
                    disabled={deletingId !== null}
                    aria-label="Delete Archive"
                  >
                    <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {projectToPurge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#000]/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setProjectToPurge(null)}></div>
          <div className="relative glass p-8 md:p-12 rounded-[40px] border border-red-500/20 max-w-lg w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.1)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 className="syncopate text-xl font-bold text-white mb-4 uppercase tracking-tighter">Confirm Digital Purge</h3>
            <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-light">
              You are about to permanently erase <span className="text-red-400 font-bold uppercase">"{projectToPurge.title}"</span> from the archives. This action is irreversible and the digital asset will be destroyed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={executePurge}
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] cursor-pointer shadow-lg shadow-red-500/20"
              >
                Proceed with Purge
              </button>
              <button 
                onClick={() => setProjectToPurge(null)}
                className="flex-1 py-4 glass border border-zinc-800 text-zinc-400 font-black rounded-2xl hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest text-[10px] cursor-pointer"
              >
                Abort Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation: fadeIn 0.3s ease-out forwards; }
        .zoom-in-95 { transform: scale(0.95); }
        .slide-in-from-bottom-4 { transform: translateY(16px); }
      `}} />
    </div>
  );
};

export default AdminPanel;
