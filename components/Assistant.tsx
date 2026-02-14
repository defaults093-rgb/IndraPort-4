import { GoogleGenAI, Chat } from '@google/genai';
import React, { useEffect, useRef, useState, useCallback } from 'react';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Welcome to Indra Visuals. I'm your creative concierge. How can I assist with your branding journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session with memory
  const initChat = useCallback(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const session = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are the Official AI Assistant for INDRA VISUALS.
          Studio Head: Indra.
          Contact Email: indravisuals4858@gmail.com
          
          CORE FOCUS: Premium Logo Design and Visual Identity.
          Our selection is exclusive and focused on the 'Store Logo' series, showcasing minimalist and professional brand identities.
          
          Other Services We Offer: 2D Animation, Digital Illustration, and Video Editing.
          
          Guidelines:
          - Be premium, intelligent, and concise (under 25 words).
          - Use the user's name if they provide it (Memory is enabled).
          - Direct all business inquiries to indravisuals4858@gmail.com.
          - If asked about prices, say: "Indra provides custom quotes per vision. Please reach out to indravisuals4858@gmail.com to begin."`
        }
      });
      setChatSession(session);
    } catch (e) {
      console.error("AI Initialization Failed:", e);
    }
  }, []);

  useEffect(() => {
    initChat();
  }, [initChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Safety check for session
    if (!chatSession) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const session = ai.chats.create({ model: 'gemini-3-flash-preview' });
      setChatSession(session);
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // We rely on the persistent session created in state
      const result = await chatSession!.sendMessage({ message: userMsg });
      const aiText = result.text || "My neural link is briefly interrupted. Please contact indravisuals4858@gmail.com.";
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sync lost. Please reach out to Indra at indravisuals4858@gmail.com!" }]);
      initChat(); // Re-init on failure
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60]">
      {isOpen ? (
        <div className="w-[calc(100vw-32px)] sm:w-[400px] h-[500px] md:h-[600px] glass rounded-[32px] flex flex-col shadow-2xl border border-white/10 overflow-hidden animate-[slideUp_0.4s_ease-out]">
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
          
          <div className="p-5 md:p-6 border-b border-white/5 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center font-bold shadow-inner border border-white/10 text-white text-sm">I</div>
              <div>
                <span className="block font-bold text-[11px] md:text-[12px] tracking-widest uppercase leading-none text-white">Indra Concierge</span>
                <span className="text-[8px] text-white/70 uppercase tracking-tighter">Memory Interface Active</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 bg-zinc-950/80 scroll-smooth custom-scrollbar">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-[13px] md:text-[14px] leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20 font-medium' : 'bg-zinc-900/60 border border-white/5 text-zinc-200 rounded-tl-none font-light'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900/60 px-5 py-4 rounded-2xl flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 md:p-5 border-t border-white/5 bg-zinc-950/90 shrink-0">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Message Indra AI..."
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 pr-14 outline-none focus:border-indigo-500/50 text-[13px] md:text-sm transition-all text-white placeholder:text-zinc-600"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all p-2 rounded-xl ${input.trim() ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-zinc-800'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all duration-300 group relative"
          aria-label="Open AI Assistant"
        >
          <svg className="w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#050505] rounded-full animate-bounce"></span>
        </button>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Assistant;