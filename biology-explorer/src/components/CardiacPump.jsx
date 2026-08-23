import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function CardiacPump({ moduleData }) {
  const [bpm, setBpm] = useState(60); // Default resting heart rate
  const heartRef = useRef(null);
  const pulseRef = useRef(null);
  const heartTl = useRef(null);
  const pulseTl = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. The Heartbeat Timeline (Systole and Diastole)
      heartTl.current = gsap.timeline({ repeat: -1 })
        .to(heartRef.current, { scale: 1.15, duration: 0.15, ease: "power1.inOut" }) // Lub
        .to(heartRef.current, { scale: 1, duration: 0.15, ease: "power1.inOut" })
        .to(heartRef.current, { scale: 1.1, duration: 0.15, ease: "power1.inOut", delay: 0.05 }) // Dub
        .to(heartRef.current, { scale: 1, duration: 0.3, ease: "power1.inOut" }); // Rest

      // 2. The Radiating Pulse Timeline
      pulseTl.current = gsap.timeline({ repeat: -1 })
        .fromTo(pulseRef.current,
          { scale: 1, opacity: 0.6 },
          { scale: 2.5, opacity: 0, duration: 0.8, ease: "power2.out" }
        );
    });

    return () => ctx.revert();
  }, []);

  // Watch the BPM state and scale the animation speed dynamically!
  useEffect(() => {
    if (heartTl.current && pulseTl.current) {
      // 60 BPM is our baseline 1x speed.
      // If BPM is 120, timeScale becomes 2x speed.
      const speed = bpm / 60;

      gsap.to([heartTl.current, pulseTl.current], {
        timeScale: speed,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [bpm]);

  return (
    <div className="bg-[#FCE1E4] border-2 border-rose-900 rounded-2xl p-8 shadow-[4px_4px_0px_#881337] mt-12">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-black text-rose-950 mb-2">{moduleData.title}</h3>
        <p className="text-rose-900/80 font-medium">{moduleData.content}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Visualizer Area */}
        <div className="relative h-64 flex items-center justify-center bg-white border-2 border-rose-900 rounded-xl shadow-inner overflow-hidden">
          {/* Glowing Pulse Ring */}
          <div
            ref={pulseRef}
            className="absolute w-24 h-24 bg-rose-400 rounded-full blur-sm"
          ></div>

          {/* SVG Heart */}
          <svg
            ref={heartRef}
            className="relative z-10 w-24 h-24 text-rose-600 drop-shadow-xl"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Control Panel Area */}
        <div className="bg-white/60 p-6 rounded-xl border-2 border-rose-900/20">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="block text-sm font-bold text-rose-900/60 uppercase tracking-widest mb-1">Current Output</span>
              <span className="text-5xl font-black text-rose-950 tabular-nums leading-none">{bpm}</span>
              <span className="text-lg font-bold text-rose-900 ml-2">BPM</span>
            </div>

            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 ${
              bpm < 70 ? 'bg-blue-100 text-blue-800 border-blue-800' :
              bpm < 120 ? 'bg-emerald-100 text-emerald-800 border-emerald-800' :
              'bg-rose-600 text-white border-rose-900 animate-pulse'
            }`}>
              {bpm < 70 ? 'Resting' : bpm < 120 ? 'Active' : 'Intense'}
            </div>
          </div>

          <label className="block text-sm font-bold text-slate-800 mb-4">
            Drag to adjust cardiac workload:
          </label>
          <input
            type="range"
            min="40"
            max="180"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            className="w-full h-3 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-700 hover:accent-rose-500 transition-all"
          />
          <div className="flex justify-between text-xs font-bold text-rose-900/60 mt-2">
            <span>40 (Deep Sleep)</span>
            <span>180 (Sprinting)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
