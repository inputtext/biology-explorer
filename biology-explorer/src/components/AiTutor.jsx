import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function AiTutor({ isOpen, onClose, currentModule }) {
  const drawerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your BioExplorer AI. I see you're looking at the material for this phase. What questions do you have?" }
  ]);

  // Handle the GSAP Slide In/Out
  useEffect(() => {
    if (isOpen) {
      gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: 'power3.out', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' });
    } else {
      gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in', boxShadow: 'none' });
    }
  }, [isOpen]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add user message to UI
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // 2. THIS IS WHERE YOU WILL CALL YOUR API IN PRODUCTION
    // For now, we simulate a network delay and generate a context-aware response
    setTimeout(() => {
      const aiResponse = {
        role: 'ai',
        text: `I can certainly help with that! Since we are currently focusing on "${currentModule?.title || 'this topic'}", it's important to remember that ${currentModule?.content?.toLowerCase() || 'these systems are highly complex'}. Let me know if you want to dive deeper into specific details!`
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div
      ref={drawerRef}
      className="fixed top-0 right-0 w-full md:w-[400px] h-screen bg-white/80 backdrop-blur-xl border-l-2 border-slate-200 z-50 flex flex-col translate-x-full"
    >
      {/* Header */}
      <div className="p-6 border-b-2 border-slate-200 flex justify-between items-center bg-white/50">
        <div>
          <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
            <span className="text-blue-600">✦</span> AI Tutor
          </h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Context: {currentModule?.title || 'General'}</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-colors font-bold"
        >
          ✕
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-slate-100 text-slate-800 border-2 border-slate-200 rounded-tl-sm shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 border-2 border-slate-200 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-6 border-t-2 border-slate-200 bg-white/50">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this module..."
            className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl py-4 pl-4 pr-16 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold disabled:opacity-50 hover:enabled:-translate-y-0.5 transition-all shadow-[2px_2px_0px_#1e3a8a]"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}
