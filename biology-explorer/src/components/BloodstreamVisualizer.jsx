import { useRef, useState } from 'react';
import gsap from 'gsap';

export default function BloodstreamVisualizer({ moduleData }) {
  const [activeHormone, setActiveHormone] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const hormoneRef = useRef(null);
  const receptorRef = useRef(null);
  const nucleusRef = useRef(null);
  const feedbackRef = useRef(null);

  const triggerHormone = (typeData) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveHormone(typeData);

    // Reset the animation states
    gsap.set(hormoneRef.current, { x: -50, y: 0, opacity: 1, scale: 1, backgroundColor: typeData.id === 'protein' ? '#f43f5e' : '#34d399' });
    gsap.set(receptorRef.current, { backgroundColor: '#e2e8f0', scale: 1 });
    gsap.set(nucleusRef.current, { backgroundColor: '#f8fafc', scale: 1 });
    gsap.set(feedbackRef.current, { opacity: 0, y: 10 });

    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    if (typeData.id === 'protein') {
      // PROTEIN: Travels to membrane, hits receptor, triggers secondary messenger
      tl.to(hormoneRef.current, { x: 150, duration: 1, ease: 'power2.out' })
        .to(receptorRef.current, { backgroundColor: '#f43f5e', scale: 1.2, duration: 0.3 })
        .to(feedbackRef.current, { opacity: 1, y: 0, duration: 0.3 })
        .to(nucleusRef.current, { backgroundColor: '#fecdd3', scale: 1.05, duration: 0.4, yoyo: true, repeat: 3 }, "+=0.2")
        .to(hormoneRef.current, { opacity: 0, duration: 0.5 }, "+=0.5");
    } else {
      // STEROID: Phases straight through the membrane into the nucleus
      tl.to(hormoneRef.current, { x: 300, y: 50, duration: 1.5, ease: 'power1.inOut' })
        .to(feedbackRef.current, { opacity: 1, y: 0, duration: 0.3 })
        .to(nucleusRef.current, { backgroundColor: '#d1fae5', scale: 1.1, duration: 0.5, yoyo: true, repeat: 3 })
        .to(hormoneRef.current, { opacity: 0, duration: 0.5 }, "+=0.5");
    }
  };

  return (
    <div className="bg-[#FCE1E4] border-2 border-rose-900 rounded-2xl p-8 shadow-[4px_4px_0px_#881337] mt-12">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black text-rose-950 mb-2">{moduleData.title}</h3>
        <p className="text-rose-900/80 font-medium">{moduleData.content}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Controls */}
        <div className="space-y-4">
          {moduleData.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => triggerHormone(opt)}
              disabled={isAnimating}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all shadow-[2px_2px_0px_currentColor] disabled:opacity-50 hover:enabled:-translate-y-1 ${
                opt.id === 'protein' ? 'bg-rose-100 border-rose-600 text-rose-900' : 'bg-emerald-100 border-emerald-600 text-emerald-900'
              }`}
            >
              <h4 className="font-black text-lg">{opt.name}</h4>
              <p className="font-medium text-sm mt-1 opacity-80">{opt.desc}</p>
            </button>
          ))}

          {/* Dynamic Feedback Text */}
          <div ref={feedbackRef} className="mt-6 p-4 bg-white border-2 border-slate-200 rounded-xl opacity-0">
            <p className="font-bold text-slate-800 text-sm">
              {activeHormone?.id === 'protein'
                ? "Secondary messenger cascade triggered! The signal is relayed to the nucleus."
                : "Direct entry! The hormone binds directly to DNA to alter gene expression."}
            </p>
          </div>
        </div>

        {/* Animation Canvas */}
        <div className="relative h-72 bg-white border-4 border-dashed border-rose-200 rounded-2xl overflow-hidden flex items-center">

          {/* The Bloodstream */}
          <div className="absolute left-0 top-0 w-32 h-full bg-rose-50 border-r-4 border-rose-100 flex items-center justify-center">
             <span className="rotate-270 -rotate-90 text-rose-300 font-black tracking-widest uppercase">Bloodstream</span>
          </div>

          {/* The Target Cell */}
          <div className="absolute right-4 w-56 h-56 bg-slate-50 border-4 border-slate-300 rounded-full flex items-center justify-center">

             {/* Surface Receptor */}
             <div
                ref={receptorRef}
                className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-12 rounded-l-full border-4 border-slate-300 z-10 transition-colors"
             ></div>

             {/* Nucleus */}
             <div
                ref={nucleusRef}
                className="w-24 h-24 rounded-full border-4 border-slate-300 flex items-center justify-center transition-colors"
             >
                <span className="text-xs font-black text-slate-400">DNA</span>
             </div>
          </div>

          {/* The Animated Hormone Particle */}
          <div
            ref={hormoneRef}
            className="absolute left-12 w-6 h-6 rounded-full border-2 border-white shadow-lg opacity-0 z-20"
          ></div>

        </div>
      </div>
    </div>
  );
}
