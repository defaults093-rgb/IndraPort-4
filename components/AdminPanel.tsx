
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

  const stats = useMemo(() => {
    const rawString = JSON.stringify(projects);
    const sizeInBytes = projects.length > 0 ? new Blob([rawString]).size : 0;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    return {
      total: projects.length,
      mbUsed: sizeInMB.toFixed(2)
    };
  }, [projects]);

  useEffect(() => {
    if (newProject.videoUrl && !newProject.imageUrl) {
      setPreviewMode('video');
    } else if (newProject.imageUrl && !newProject.videoUrl) {
      setPreviewMode('image');
    }
  }, [newProject.imageUrl, newProject.videoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = type === 'video' ? 60 : 15; 
    const allowedTypes = type === 'image' 
      ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] 
      : ['video/mp4', 'video/webm', 'video/ogg'];

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File too large. Maximum for ${type} is ${maxSize}MB.`);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert(`Invalid ${type} format.`);
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

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.imageUrl) {
      alert("Title and Cover Image are required.");
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
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-12 text-zinc-300 font-['Space Grotesk']">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white cursor-pointer active:scale-90">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <div>
              <h1 className="syncopate text-2xl md:text-3xl font-bold tracking-tighter text-white uppercase">CREATIVE TERMINAL</h1>
              <div className="flex items-center gap-4 mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <span className="text-indigo-400">{stats.total} Projects</span>
                <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                <span>{stats.mbUsed} MB Metadata</span>
              </div>
            </div>
          </div>
          <button onClick={onLogout} className="px-8 py-3 glass border border-red-500/20 text-red-500 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-all cursor-pointer">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Intake Column */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="glass p-8 rounded-[40px] border border-white/5 bg-zinc-950/40 shadow-2xl">
              <h2 className="syncopate text-[11px] font-bold tracking-[0.4em] text-white uppercase mb-8">Archival Intake</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative aspect-video rounded-[24px] bg-zinc-900 overflow-hidden border border-white/5 shadow-inner">
                    {previewMode === 'image' ? (
                      newProject.imageUrl ? (
                        <img src={newProject.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1"></path></svg>
                        </div>
                      )
                    ) : (
                      newProject.videoUrl ? (
                        <video src={newProject.videoUrl} className="w-full h-full object-cover" controls muted />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="1"></path></svg>
                        </div>
                      )
                    )}
                    {isUploading && isUploading !== 'saving' && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 z-30">
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-3">
                          <div className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_#6366f1]" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Processing: {uploadProgress}%</span>
                      </div>
                    )}
                </div>

                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={newProject.title} 
                    onChange={e => setNewProject({...newProject, title: e.target.value})} 
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 text-xs text-white" 
                    placeholder="Identification Title"
                    required 
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    {['Animation', 'Illustration', 'Logo Design', 'Editing'].map(cat => (
                      <button 
                        key={cat}
                        type="button"
                        onClick={() => setNewProject({...newProject, category: cat as Category})}
                        className={`py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${newProject.category === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-900 border border-white/5 text-zinc-600'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <textarea 
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 text-xs text-white h-20 resize-none"
                    placeholder="Technical/Visual Brief"
                  />

                  <div className="flex gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 glass border border-white/5 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Add Visual</button>
                    <button type="button" onClick={() => videoInputRef.current?.click()} className="flex-1 py-3 glass border border-white/5 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Add Motion</button>
                  </div>

                  <input type="file" ref={fileInputRef} onChange={e => handleFileChange(e, 'image')} className="hidden" accept="image/*" />
                  <input type="file" ref={videoInputRef} onChange={e => handleFileChange(e, 'video')} className="hidden" accept="video/*" />

                  <button 
                    type="submit" 
                    disabled={isUploading !== null} 
                    className="w-full py-4 bg-white text-black font-black rounded-2xl transition-all uppercase tracking-[0.4em] text-[10px] hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
                  >
                    {isUploading === 'saving' ? 'Archiving...' : 'Publish to Recordset'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="syncopate text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase">Archive Management</h2>
              <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">{projects.length} Entries</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <div className="col-span-full py-32 text-center glass rounded-[40px] border-dashed border-2 border-zinc-900">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">Sector Empty.</span>
                </div>
              ) : [...projects].reverse().map((project) => (
                <div key={project.id} className="glass p-5 rounded-[32px] flex gap-5 items-center border border-white/5 relative group hover:border-indigo-500/30 transition-all">
                  {deletingId === project.id && (
                    <div className="absolute inset-0 bg-[#020202]/95 backdrop-blur-md flex items-center justify-center z-20 text-red-500 text-[8px] font-black uppercase tracking-widest">
                      Purging Data...
                    </div>
                  )}

                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-900 flex-shrink-0">
                    <img src={project.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-black text-indigo-500 uppercase mb-1 block tracking-widest">{project.category}</span>
                    <h3 className="font-bold text-white text-sm uppercase truncate">{project.title}</h3>
                  </div>

                  <button 
                    onClick={() => setProjectToPurge({ id: project.id, title: project.title })}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/5 text-zinc-800 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer active:scale-90"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Purge Confirmation */}
      {projectToPurge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setProjectToPurge(null)}></div>
          <div className="relative glass p-10 rounded-[48px] border border-red-500/20 max-w-sm w-full text-center animate-in zoom-in-95 duration-300">
            <h3 className="syncopate text-lg font-bold text-white mb-4 uppercase">Initiate Purge?</h3>
            <p className="text-zinc-500 text-[11px] mb-10">Confirm deletion of draft <b>"{projectToPurge.title}"</b> from local storage.</p>
            <div className="flex flex-col gap-3">
              <button onClick={executePurge} className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase tracking-widest text-[9px] active:scale-95 cursor-pointer">Confirm Purge</button>
              <button onClick={() => setProjectToPurge(null)} className="w-full py-4 glass text-zinc-400 font-black rounded-2xl uppercase tracking-widest text-[9px] active:scale-95 cursor-pointer">Abort</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AdminPanel;
