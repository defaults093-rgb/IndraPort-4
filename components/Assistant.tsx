
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
        contents: `Context: You are the AI Portfolio Assistant for INDRA VISUALS. 
        Owner: Indra.
        Specialties: 2D Animation (frame-by-frame, rigging), Cinematic Illustration, Minimalist Logo Design, Dynamic Video Editing.
        Style: High-end, futuristic, creative, professional.
        Goal: Convert visitors into clients and answer questions about Indra's work.
        User Query: ${userMsg}`,
        config: {
          systemInstruction: "Keep responses under 2 sentences. Use elegant and inspiring language. If asked about contact, mention the 'Bridge' section."
        }
      });

      const aiText = response.text || "My creative intuition is briefly offline. Let's connect via the contact form!";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "A brief interference in the creative flow. Please try again or reach out directly!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-[320px] sm:w-[400px] h-[520px] glass rounded-[32px] flex flex-col shadow-2xl border border-indigo-500/30 overflow-hidden animate-[slideUp_0.4s_ease-out]">
          <div className="p-5 border-b border-white/5 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold shadow-inner">I</div>
              <div>
                <span className="block font-bold text-sm tracking-widest uppercase leading-none">Indra AI</span>
                <span className="text-[10px] text-white/60 uppercase tracking-tighter">Creative Concierge</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-950/80 scrollbar-hide">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20' : 'glass text-zinc-200 rounded-tl-none border-zinc-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="glass px-4 py-3 rounded-2xl flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-white/5 bg-zinc-950">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about animation or design..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 pr-12 outline-none focus:border-indigo-500/50 text-sm transition-all focus:ring-1 focus:ring-indigo-500/20"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all ${input.trim() ? 'text-indigo-500 scale-110' : 'text-zinc-700'}`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group relative ring-4 ring-indigo-500/10"
        >
          <div className="absolute -top-12 right-0 glass px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-xl">
            Inquire within
          </div>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-4 border-zinc-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
          </span>
        </button>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Assistant;
