import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGallery from './components/ProjectGallery';
import ServiceSection from './components/ServiceSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
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

  const seedDatabase = async (pList: Project[]) => {
    try {
      const existing = await getAllProjects();
      for (const item of existing) {
        await deleteProjectFromDB(item.id);
      }
      for (const p of pList) {
        await saveProject(p);
      }
    } catch (e) {
      console.error("Initial Seed Fault:", e);
    }
  };

  useEffect(() => {
    let mounted = true;

    const startup = async () => {
      try {
        await initDB(); 
        const storedProjects = await refreshProjects();

        if (!mounted) return;

        // Force re-sync to show only the logo work if non-logo IDs exist
        const hasLegacyProjects = storedProjects.some(p => !['store-logo-v1', 'store-logo-v2', 'store-logo-v3'].includes(p.id));
        const needsSync = storedProjects.length === 0 || hasLegacyProjects;

        if (needsSync) {
          console.log(`[Visual Engine] Syncing exclusively Store Logo archives...`);
          await seedDatabase(INITIAL_PROJECTS);
          await refreshProjects();
        }
      } catch (err) {
        console.error("Storage Failure:", err);
        if (mounted) setErrorState("Critical Engine Error: Persistent storage link unavailable.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    const auth = localStorage.getItem('indra_auth');
    if (auth === 'true') setIsLoggedIn(true);

    startup();

    return () => { mounted = false; };
  }, [refreshProjects]);

  useEffect(() => {
    if (isLoading || errorState || view !== 'public') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [view, isLoading, projects, errorState]);

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
      console.error("Local Archive Write Failed:", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProjectFromDB(id);
      await refreshProjects();
    } catch (err) {
      console.error("Archive Purge Fault:", err);
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
        <h2 className="syncopate text-xl font-bold text-white mb-4 uppercase">System Link Failure</h2>
        <p className="text-zinc-500 text-sm max-w-md mb-8">{errorState}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-4 bg-indigo-600 text-white rounded-full uppercase tracking-widest hover:bg-indigo-700 transition-all cursor-pointer">Retry Calibration</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-2xl animate-pulse shadow-[0_0_40px_rgba(99,102,241,0.3)]">I</div>
          <div className="absolute inset-0 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <span className="syncopate text-[8px] font-black uppercase tracking-[0.6em] text-zinc-700 animate-pulse">Establishing Neural Link</span>
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
        <section id="work" className="py-20 md:py-32">
          <ProjectGallery projects={projects} />
        </section>
        <section id="services" className="py-20 md:py-32"><ServiceSection /></section>
        <section id="contact" className="py-20 md:py-32"><ContactSection /></section>
      </main>

      <Footer />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 md:bottom-10 md:right-10 w-14 h-14 glass rounded-full flex items-center justify-center transition-all duration-500 hover:bg-indigo-600/20 group z-50 ${showScrollTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'}`}
        aria-label="Back to Top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default App;