
import { GoogleGenAI } from '@google/genai';
import React, { useEffect, useRef, useState } from 'react';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Welcome to Indra Visuals. I'm your creative concierge. How can I assist with your vision today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ text: userMsg }] },
        config: {
          systemInstruction: `You are the AI Portfolio Assistant for INDRA VISUALS. 
          Studio Founder: Indra.
          PRIORITY FEATURE: Our primary archived work is THUMBNAIL (Editing), which is pinned at the start of our archive.
          
          Featured Work: 
          1. THUMBNAIL (High-end video editing & high-retention thumbnails)
          2. FENIX ILLUSTRATION (Cinematic digital painting of a fox)
          3. CAT ILLUSTRATION (Stylized, expressive cat artwork)
          4. STORE LOGO IDENTITY (Minimalist branding solutions)
          
          Services provided: 2D Animation, Digital Illustration, Logo Design, and Video Editing.
          Tone: Premium, futuristic, inspiring, and very concise. 
          Goal: Act as a concierge. Convert interest into inquiries. Keep answers under 25 words. 
          If asked about pricing or starting a project, direct them to the 'Bridge' section or the 'EMAIL US' button.`
        }
      });

      const aiText = response.text || "My neural link is momentarily unstable. Let's connect via the 'Bridge' section below!";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("Assistant Fault:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "A brief interference in the creative flow. Please reach out directly through our contact bridge!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60]">
      {isOpen ? (
        <div className="w-[calc(100vw-32px)] sm:w-[400px] h-[520px] glass rounded-[32px] flex flex-col shadow-2xl border border-white/10 overflow-hidden animate-[slideUp_0.4s_ease-out]">
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
          <div className="p-4 md:p-5 border-b border-white/5 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/20 flex items-center justify-center font-bold shadow-inner border border-white/10 text-white text-sm">I</div>
              <div>
                <span className="block font-bold text-[10px] md:text-[11px] tracking-widest uppercase leading-none text-white">Indra Assistant</span>
                <span className="text-[8px] md:text-[9px] text-white/60 uppercase tracking-tighter">Visual Intelligence</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-zinc-950/80">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[12px] md:text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20' : 'bg-zinc-900/50 border border-white/5 text-zinc-200 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900/50 px-4 py-3 rounded-2xl flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 md:p-4 border-t border-white/5 bg-zinc-950/90">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Message Indra AI..."
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-5 py-3 md:py-3.5 pr-12 outline-none focus:border-indigo-500/50 text-xs md:text-sm transition-all focus:ring-1 focus:ring-indigo-500/20 text-white placeholder:text-zinc-600"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all p-1.5 md:p-2 rounded-xl ${input.trim() ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-zinc-800'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 hover:scale-110 transition-all duration-300 group relative"
          aria-label="Open Assistant"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-[#020202] rounded-full animate-bounce"></span>
        </button>
      )}
    </div>
  );
};

export default Assistant;
