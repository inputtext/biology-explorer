import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PhotosynthesisEngine({ moduleData }) {
  const [sunlight, setSunlight] = useState(50);
  const [water, setWater] = useState(50);
  const [co2, setCo2] = useState(50);
  const [glucose, setGlucose] = useState(0);

  const engineRef = useRef(null);
  const dropRef = useRef(null);

  // Calculate the efficiency of the photosynthesis reaction (0 to 100%)
  // All three resources are required to produce glucose efficiently.
  const efficiency = Math.round((sunlight * water * co2) / 10000);

  useEffect(() => {
    // Animate the "Chloroplast Engine" based on efficiency
    const pulseSpeed = efficiency > 0 ? 2 - (efficiency / 100) * 1.5 : 0;

    if (pulseSpeed > 0) {
      gsap.to(engineRef.current, {
        scale: 1 + (efficiency / 100) * 0.1,
        rotation: efficiency / 10, // slight rotation for "working" effect
        duration: pulseSpeed,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    } else {
      gsap.killTweensOf(engineRef.current);
      gsap.to(engineRef.current, { scale: 1, rotation: 0, duration: 0.5 });
    }
  }, [efficiency]);

  // Real-time Glucose Production loop
  useEffect(() => {
    if (efficiency === 0) return;

    const productionInterval = setInterval(() => {
      setGlucose(prev => prev + Math.ceil(efficiency / 10));

      // Pop a little sugar cube out of the engine
      if (dropRef.current) {
        gsap.fromTo(dropRef.current,
          { y: 0, opacity: 1, scale: 1 },
          { y: 60, opacity: 0, scale: 0.5, duration: 0.8, ease: "power2.out" }
        );
      }
    }, 1000); // Ticks every 1 second

    return () => clearInterval(productionInterval);
  }, [efficiency]);

  return (
    <div className="p-8 rounded-3xl border-2 border-rose-900 dark:border-rose-400 bg-[#FCE1E4] dark:bg-[#4c0519] shadow-[6px_6px_0px_#881337] dark:shadow-[6px_6px_0px_#fb7185] transition-colors duration-0">

      {/* Header Info */}
      <div className="mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-rose-800 dark:text-rose-300">
          Biochemical Engine
        </span>
        <h3 className="text-2xl font-black text-rose-950 dark:text-rose-50 mt-1">
          {moduleData?.title || 'Photosynthesis Simulator'}
        </h3>
        <p className="text-sm font-medium text-rose-900/80 dark:text-rose-200/80 mt-1 max-w-xl">
          Plants are the planet's solar panels. Balance Sunlight, H₂O, and CO₂ to maximize the chloroplast's glucose production.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Controls / Sliders */}
        <div className="space-y-6 bg-white/40 dark:bg-rose-950/40 p-6 rounded-2xl border border-rose-900/20 dark:border-rose-400/20">

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-black text-rose-950 dark:text-rose-50">
              <span>☀️ Sunlight Intensity</span>
              <span>{sunlight}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={sunlight} onChange={(e) => setSunlight(e.target.value)}
              className="w-full accent-rose-600 dark:accent-rose-400 grab-zone"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-black text-rose-950 dark:text-rose-50">
              <span>💧 Water (H₂O)</span>
              <span>{water}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={water} onChange={(e) => setWater(e.target.value)}
              className="w-full accent-blue-500 dark:accent-blue-400 grab-zone"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-black text-rose-950 dark:text-rose-50">
              <span>💨 Carbon Dioxide (CO₂)</span>
              <span>{co2}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={co2} onChange={(e) => setCo2(e.target.value)}
              className="w-full accent-slate-600 dark:accent-slate-400 grab-zone"
            />
          </div>

        </div>

        {/* Visual Engine Display */}
        <div className="flex flex-col items-center justify-center relative min-h-[250px]">

          {/* Reaction Efficiency Gauge */}
          <div className="absolute top-0 right-0 text-right">
            <div className="text-xs font-black uppercase text-rose-800 dark:text-rose-300">Efficiency</div>
            <div className={`text-3xl font-black ${efficiency > 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-950 dark:text-rose-50'}`}>
              {efficiency}%
            </div>
          </div>

          {/* The Chloroplast Graphic */}
          <div
            ref={engineRef}
            className="w-32 h-32 rounded-full border-4 border-emerald-600 dark:border-emerald-400 bg-emerald-100 dark:bg-emerald-950 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(5,150,105,0.3)] relative z-10"
          >
            <span className="text-4xl pointer-events-none">🌿</span>
          </div>

          {/* Animated Sugar Drop */}
          <div ref={dropRef} className="absolute top-1/2 mt-8 opacity-0">
            <span className="text-2xl">🧊</span>
          </div>

          {/* Total Output Tracker */}
          <div className="absolute bottom-0 bg-rose-900 dark:bg-rose-300 text-rose-50 dark:text-rose-950 px-6 py-2 rounded-xl font-black shadow-[4px_4px_0px_currentColor]">
            Total Glucose: {glucose}g
          </div>

        </div>
      </div>
    </div>
  );
}
