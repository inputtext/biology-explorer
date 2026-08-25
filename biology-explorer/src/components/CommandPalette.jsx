import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

// --- SOUND EFFECTS ---

// Open Sound: High pitch to Low pitch
const playUISound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (error) {
    console.warn("Audio context blocked by browser.");
  }
};

// Close Sound: Low pitch to High pitch
const playCloseSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, ctx.currentTime); // Starts low
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1); // Sweeps high

    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (error) {
    console.warn("Audio context blocked by browser.");
  }
};


export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedRoute, setSuggestedRoute] = useState(null);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const hasOpenedOnce = useRef(false); // Prevents the close sound from playing on page load
  const navigate = useNavigate();

  // Keyword routing map: Matches user words to specific Hub IDs
  const routeMap = {
    cell: { id: 'cellular-biology', name: 'Phase 2: Cellular Biology' },
    mitochondria: { id: 'cellular-biology', name: 'Phase 2: Cellular Biology' },
    dna: { id: 'genetics', name: 'Phase 4: Genetics' },
    gene: { id: 'genetics', name: 'Phase 4: Genetics' },
    heart: { id: 'physiology', name: 'Phase 5: Human Physiology' },
    plant: { id: 'botany', name: 'Phase 14: Plant Physiology' },
    evolution: { id: 'evolution', name: 'Phase 13: Evolution' }
  };

  // Listen for Cmd+K (Mac) or Ctrl+K (Windows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // GSAP Animation & Sound Triggers
  useEffect(() => {
    if (isOpen) {
      hasOpenedOnce.current = true; // Mark that the user has interacted with it
      playUISound(); // 🔊 Play Open Sound

      // 1. Fade and blur the background in smoothly
      gsap.fromTo(overlayRef.current,
        { opacity: 0, display: 'none', backdropFilter: 'blur(0px)' },
        { opacity: 1, display: 'flex', backdropFilter: 'blur(8px)', duration: 0.4, ease: 'power2.out' }
      );

      // 2. The After Effects 3D Reveal
      gsap.fromTo(modalRef.current,
        {
          scale: 0.85,
          opacity: 0,
          y: 40,
          rotationX: -15,
          transformPerspective: 1000,
          clipPath: 'inset(100% 0% 0% 0% round 16px)'
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotationX: 0,
          clipPath: 'inset(0% 0% 0% 0% round 16px)',
          duration: 0.7,
          ease: 'expo.out',
          onComplete: () => inputRef.current?.focus()
        }
      );
    } else {

      // 🔊 Play Close Sound (Only if it was actually opened first!)
      if (hasOpenedOnce.current) {
        playCloseSound();
      }

      // 3. Cinematic Close (Tilts up and fades away)
      gsap.to(modalRef.current, {
        scale: 0.95,
        opacity: 0,
        y: -20,
        rotationX: 10,
        duration: 0.25,
        ease: 'power3.in'
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        display: 'none',
        duration: 0.3,
        delay: 0.1,
        ease: 'power2.in'
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse('');
    setSuggestedRoute(null);

    // 1. Scan for routing keywords locally to surface the quick-link
    const lowercaseQuery = query.toLowerCase();
    for (const [keyword, routeData] of Object.entries(routeMap)) {
      if (lowercaseQuery.includes(keyword)) {
        setSuggestedRoute(routeData);
        break;
      }
    }

    try {
      const backendUrl = 'http://127.0.0.1:3001/api/command';

      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      const data = await res.json();
      setResponse(data.reply || "I couldn't process that right now.");
    } catch (error) {
      console.error("Backend connection failed:", error);
      setResponse("Secure backend connection unavailable. Ensure your Express server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteClick = () => {
    setIsOpen(false);
    navigate(`/hub/${suggestedRoute.id}`);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-[9999] hidden items-start justify-center pt-32 px-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FAF9F6] dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl shadow-[8px_8px_0px_rgba(15,23,42,1)] dark:shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col"
      >
        <form onSubmit={handleSubmit} className="flex items-center border-b-2 border-slate-900/10 dark:border-slate-700 p-4">
          <span className="text-2xl mr-4">✨</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about biology... (e.g. 'What is a mitochondria?')"
            className="flex-1 bg-transparent text-xl font-bold text-slate-900 dark:text-slate-50 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <span className="text-xs font-black bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-md ml-4">
            ESC to close
          </span>
        </form>

        {(isLoading || response) && (
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 min-h-[150px] max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex space-x-2 items-center text-slate-500 font-bold animate-pulse">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="ml-2">Synthesizing answer...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {response}
                </p>

                {suggestedRoute && (
                  <button
                    onClick={handleRouteClick}
                    className="w-full flex items-center justify-between p-4 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-600 dark:border-blue-400 rounded-xl text-blue-900 dark:text-blue-100 font-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#2563eb] transition-all"
                  >
                    <span>Jump to {suggestedRoute.name} ➔</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
