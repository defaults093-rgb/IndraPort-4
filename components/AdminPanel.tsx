
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
    // Stringify is okay but we add a safety check for empty project list
    const rawString = JSON.stringify(projects);
    const sizeInBytes = projects.length > 0 ? new Blob([rawString]).size : 0;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    const percentage = (sizeInMB / TOTAL_CAPACITY_MB) * 100;
    
    return {
      total: projects.length,
      mbUsed: sizeInMB.toFixed(sizeInMB < 0.01 ? 3 : 2), // Show more precision if small
      percent: Math.min(percentage, 100).toFixed(1)
    };
  }, [projects]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict Validations for Browser Quotas
    const maxSize = type === 'video' ? 30 : 5; 
    const allowedTypes = type === 'image' 
      ? ['image/jpeg', 'image/png', 'image/webp'] 
      : ['video/mp4', 'video/webm'];

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size exceeds current browser limits (${maxSize}MB). Use a smaller file.`);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert(`Format not supported. Use MP4 for video or JPG/PNG for images.`);
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
      setIsUploading(null);
      setUploadProgress(0);
    };

    reader.onerror = () => {
      alert("Local data read failed.");
      setIsUploading(null);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.imageUrl) {
      alert("Title and Image are required for deployment.");
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

  const executePurge = async () => {
    if (!projectToPurge) return;
    const { id } = projectToPurge;
    setProjectToPurge(null);
    setDeletingId(id);
    setDeleteProgress(0);
    
    const interval = setInterval(() => {
      setDeleteProgress(prev => Math.min(prev + 10, 90));
    }, 50);

    try {
      await onDelete(id);
      setDeleteProgress(100);
    } finally {
      clearInterval(interval);
      setTimeout(() => setDeletingId(null), 300);
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
              <h1 className="syncopate text-2xl font-bold tracking-tighter text-white uppercase">Archive Manager</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 ml-12 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
              <span className="text-indigo-400">{stats.total} Projects</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
              <span>{stats.mbUsed} MB Index</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Storage Sync Active
              </span>
            </div>
          </div>
          <button onClick={onLogout} className="px-6 py-2 glass border border-red-500/30 text-red-500 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/10 cursor-pointer">Logout Session</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Add Project Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="glass p-8 rounded-[32px] border border-white/5 sticky top-12 bg-zinc-950/40">
              <h2 className="syncopate text-xs font-bold mb-8 tracking-[0.2em] text-white flex items-center gap-3 uppercase">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                New Deployment
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="w-full aspect-video rounded-2xl bg-zinc-900 overflow-hidden border border-zinc-800 flex items-center justify-center relative">
                    {newProject.imageUrl ? (
                      <img src={newProject.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 opacity-20 text-center">
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span className="text-[10px] uppercase font-black tracking-widest block">No Content Selected</span>
                      </div>
                    )}
                    
                    {isUploading && isUploading !== 'saving' && (
                      <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 z-10">
                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden mb-4">
                          <div className="h-full bg-indigo-500" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <span className="text-[10px] text-white uppercase tracking-widest">Processing: {uploadProgress}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Title</label>
                    <input type="text" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-sm text-white" required />
                  </div>

                  <div>
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Category</label>
                    <select value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value as Category})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-sm text-white">
                      <option value="Animation">Animation</option>
                      <option value="Illustration">Illustration</option>
                      <option value="Logo Design">Logo Design</option>
                      <option value="Editing">Editing</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="py-3 bg-white/5 border border-zinc-800 rounded-xl text-[9px] font-bold uppercase cursor-pointer">Image Cover</button>
                    <button type="button" onClick={() => videoInputRef.current?.click()} className="py-3 bg-white/5 border border-zinc-800 rounded-xl text-[9px] font-bold uppercase cursor-pointer">Video Clip</button>
                    <input type="file" ref={fileInputRef} onChange={e => handleFileChange(e, 'image')} className="hidden" accept="image/*" />
                    <input type="file" ref={videoInputRef} onChange={e => handleFileChange(e, 'video')} className="hidden" accept="video/*" />
                  </div>
                </div>

                <button type="submit" disabled={isUploading !== null} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all uppercase tracking-widest text-[10px] cursor-pointer shadow-lg disabled:opacity-50">Save to Archive</button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <h2 className="syncopate text-[10px] font-black mb-8 tracking-[0.4em] text-zinc-500 uppercase flex items-center gap-4">Archives Indexed</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="glass p-4 rounded-[24px] flex gap-4 items-center border border-white/5 relative overflow-hidden group">
                  {deletingId === project.id && (
                    <div className="absolute inset-0 bg-red-600/10 backdrop-blur-sm flex items-center justify-center z-20">
                      <div className="animate-pulse text-[10px] font-black text-red-500 uppercase tracking-widest">Purging...</div>
                    </div>
                  )}

                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
                    <img src={project.imageUrl} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <span className="text-[8px] font-black text-indigo-500 uppercase mb-0.5 block">{project.category}</span>
                    <h3 className="font-bold text-white text-xs uppercase truncate">{project.title}</h3>
                  </div>

                  <button 
                    onClick={() => setProjectToPurge({ id: project.id, title: project.title })}
                    className="p-3 text-zinc-600 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
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
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setProjectToPurge(null)}></div>
          <div className="relative glass p-8 rounded-[32px] border border-red-500/20 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="syncopate text-lg font-bold text-white mb-4 uppercase">Confirm Purge</h3>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Permanent deletion of <b>"{projectToPurge.title}"</b>. Are you sure?</p>
            <div className="flex gap-4">
              <button onClick={executePurge} className="flex-1 py-4 bg-red-600 text-white font-black rounded-xl uppercase tracking-widest text-[10px] cursor-pointer">Purge</button>
              <button onClick={() => setProjectToPurge(null)} className="flex-1 py-4 glass text-zinc-400 font-black rounded-xl uppercase tracking-widest text-[10px] cursor-pointer">Abort</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
