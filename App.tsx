
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGallery from './components/ProjectGallery';
import ServiceSection from './components/ServiceSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import Assistant from './components/Assistant';
import { PROJECTS as INITIAL_PROJECTS } from './components/constants';
import { Project } from './types';
import { getAllProjects, saveProject, deleteProjectFromDB, initDB } from './db';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [view, setView] = useState<'public' | 'login' | 'admin'>('public');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    try {
      const stored = await getAllProjects();
      setProjects([...stored]);
      return stored;
    } catch (err) {
      console.error("Database Retrieval Failed:", err);
      return [];
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const startup = async () => {
      try {
        // 1. Initialize DB
        await initDB(); 
        
        // 2. Initial Fetch
        const storedProjects = await refreshProjects();
        
        if (!mounted) return;

        // 3. Force Seed if database is empty (Resilient to Netlify/Vercel state resets)
        if (storedProjects.length === 0) {
          console.log("Archive Empty. Seeding initial artifacts...");
          // We save them one by one to ensure transactions complete
          for (const p of INITIAL_PROJECTS) {
            try {
              await saveProject(p);
            } catch (e) {
              console.warn(`Seed failed for project ${p.id}:`, e);
            }
          }
          await refreshProjects();
        }
      } catch (err) {
        console.error("Hardware Failure:", err);
        if (mounted) setErrorState("Critical Engine Error: Database access was denied. Ensure you are not in a highly restrictive Private/Incognito window.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    const auth = localStorage.getItem('indra_auth');
    if (auth === 'true') setIsLoggedIn(true);

    startup();

    return () => { mounted = false; };
  }, [refreshProjects]);

  // Reveal Animation Intersection Observer
  useEffect(() => {
    if (isLoading || errorState) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.05 });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [view, isLoading, projects, errorState]);

  // Scroll Tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.scrollY > 600);

      if (view !== 'public') return;
      
      const scrollPosition = window.scrollY;
      const sections = ['home', 'work', 'services', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop - 300 && scrollPosition < offsetTop + offsetHeight - 300) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const handleAddProject = async (p: Project) => {
    try {
      await saveProject(p);
      await refreshProjects();
    } catch (err) {
      console.error("Save Error:", err);
      alert("System Overload: Storage limit reached or write access denied by browser.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProjectFromDB(id);
      await refreshProjects();
    } catch (err) {
      console.error("Purge Error:", err);
      alert("Protocol Error: Memory sector could not be cleared.");
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('indra_auth', 'true');
    setView('admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('indra_auth');
    setView('public');
  };

  if (errorState) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h2 className="syncopate text-xl font-bold text-white mb-4 uppercase">System Link Failure</h2>
        <p className="text-zinc-500 text-sm max-w-md mb-8 leading-relaxed font-light">{errorState}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-indigo-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all cursor-pointer"
        >
          Retry Calibration
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-2xl animate-pulse shadow-[0_0_30px_#6366f1]">I</div>
          <div className="absolute inset-0 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black">Syncing Visual Engine</span>
          <span className="text-[7px] text-zinc-700 uppercase tracking-widest animate-pulse">Allocating sectors...</span>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return <LoginPage onLogin={handleLogin} onCancel={() => setView('public')} />;
  }

  if (view === 'admin' && isLoggedIn) {
    return (
      <AdminPanel 
        projects={projects} 
        onLogout={handleLogout} 
        onAdd={handleAddProject} 
        onDelete={handleDeleteProject} 
        onBack={() => setView('public')} 
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505]">
      <div className="fixed top-0 left-0 w-full h-1 z-[110] bg-zinc-900/50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.6)]" 
          style={{ width: `${scrollProgress}%`, backgroundSize: '200% 100%' }}
        ></div>
      </div>

      <Header activeSection={activeSection} onAdminClick={() => setView(isLoggedIn ? 'admin' : 'login')} />
      
      <main className="relative z-10">
        <section id="home"><Hero /></section>
        <section id="work" className="py-16 md:py-24 reveal">
          <ProjectGallery projects={projects} />
        </section>
        <section id="services" className="py-16 md:py-24 reveal"><ServiceSection /></section>
        <section id="contact" className="py-16 md:py-24 reveal"><ContactSection /></section>
      </main>

      <Footer />
      <Assistant />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 glass rounded-full flex items-center justify-center transition-all duration-500 hover:bg-indigo-600/20 group z-50 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default App;
