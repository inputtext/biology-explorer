import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API (using Vite's environment variable syntax)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Animated Message Component
const AnimatedMessage = ({ msg }) => {
  const bubbleRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(bubbleRef.current,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)" }
    );
  }, []);

  return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        ref={bubbleRef}
        className={`max-w-[85%] p-4 text-sm font-medium leading-relaxed shadow-sm ${
          msg.role === 'user'
            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-[2px_2px_0px_#1e3a8a]'
            : 'bg-white border-2 border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm'
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
};

export default function AiTutor({ isOpen, onClose, currentModule }) {
  const drawerRef = useRef(null);
  const headerRef = useRef(null);
  const chatAreaRef = useRef(null);
  const inputRef = useRef(null);
  const iconRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your BioExplorer AI. I can see what you're studying. Ask me anything about this topic!" }
  ]);

  // Cinematic Iris Reveal & Pastel Rainbow Glow
  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();

      tl.fromTo(drawerRef.current,
        { clipPath: 'circle(0% at 90% 90%)', boxShadow: 'none' },
        { clipPath: 'circle(150% at 90% 90%)', duration: 0.8, ease: 'power3.inOut', boxShadow: '-15px 0 40px rgba(0,0,0,0.15)' }
      );

      tl.fromTo([headerRef.current, chatAreaRef.current, inputRef.current],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' },
        "-=0.4"
      );

      const rainbowTl = gsap.timeline({ delay: 0.6 });
      rainbowTl.to(drawerRef.current, { boxShadow: '-10px 0 40px 10px rgba(255, 182, 193, 0.6)', duration: 0.4 })
               .to(drawerRef.current, { boxShadow: '-10px 0 40px 10px rgba(253, 253, 150, 0.6)', duration: 0.4 })
               .to(drawerRef.current, { boxShadow: '-10px 0 40px 10px rgba(119, 221, 119, 0.6)', duration: 0.4 })
               .to(drawerRef.current, { boxShadow: '-10px 0 40px 10px rgba(174, 198, 207, 0.6)', duration: 0.4 })
               .to(drawerRef.current, { boxShadow: '-10px 0 40px 10px rgba(203, 153, 201, 0.6)', duration: 0.4 })
               .to(drawerRef.current, { boxShadow: '-15px 0 40px rgba(0,0,0,0.15)', duration: 0.8 });

    } else {
      gsap.killTweensOf(drawerRef.current);
      gsap.to(drawerRef.current, { clipPath: 'circle(0% at 90% 90%)', duration: 0.6, ease: 'power3.inOut', boxShadow: 'none' });
    }
  }, [isOpen]);

  useEffect(() => {
    gsap.to(iconRef.current, { rotation: 360, duration: 10, repeat: -1, ease: "linear" });
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Choose the fast, intelligent Gemini model
     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      // 2. Build a highly specific context prompt
      const prompt = `
        You are a highly intelligent, encouraging biology tutor built directly into an interactive web platform.
        Keep your answers concise, accurate, and easy to read for a student.

        The user is currently studying a module titled: "${currentModule?.title || 'Biology Overview'}".
        The content of this module is: "${currentModule?.content || 'General biological concepts'}".

        User's Question: ${userText}
      `;

      // 3. Fire the request to the brain
      const result = await model.generateContent(prompt);
      const aiResponseText = result.response.text();

      // 4. Update the chat with the real answer
      setMessages(prev => [...prev, { role: 'ai', text: aiResponseText }]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Whoops! My neural pathways are misfiring. Check your API key or internet connection and try again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div ref={drawerRef} className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-[#FAF9F6] border-l-2 border-slate-900 z-50 flex flex-col clip-path-circle-0">
      {/* Header */}
      <div ref={headerRef} className="p-6 border-b-2 border-slate-900 flex justify-between items-center bg-white">
        <div>
          <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3">
            <span ref={iconRef} className="text-blue-600 inline-block origin-center">✦</span>
            AI Tutor
          </h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
            Context: {currentModule?.title || 'General'}
          </p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-transparent flex items-center justify-center text-slate-900 hover:bg-rose-100 hover:border-rose-900 hover:text-rose-900 hover:-translate-y-0.5 transition-all font-black">
          ✕
        </button>
      </div>

      {/* Chat History */}
      <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <AnimatedMessage key={idx} msg={msg} />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-slate-200 p-4 rounded-2xl rounded-tl-sm flex gap-2 items-center shadow-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div ref={inputRef} className="p-6 border-t-2 border-slate-900 bg-white">
        <form onSubmit={handleSend} className="relative flex items-center rounded-xl bg-slate-50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-transparent border-2 border-slate-300 rounded-xl py-4 pl-4 pr-16 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner relative z-10"
          />
          <button type="submit" disabled={!input.trim() || isTyping} className="absolute right-2 w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold disabled:opacity-50 hover:enabled:-translate-y-0.5 hover:enabled:bg-blue-600 transition-all shadow-[2px_2px_0px_currentColor] z-20">
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}
