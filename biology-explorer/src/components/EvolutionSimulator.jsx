import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

const POPULATION_SIZE = 20;

export default function EvolutionSimulator({ moduleData }) {
  const [generation, setGeneration] = useState(1);
  const [environment, setEnvironment] = useState('light'); // 'light' or 'dark'
  const [moths, setMoths] = useState([]);
  const arenaRef = useRef(null);

  // Initialize the first generation with a 50/50 split
  const initializePopulation = useCallback(() => {
    const initialMoths = Array.from({ length: POPULATION_SIZE }).map((_, i) => ({
      id: `moth-${Date.now()}-${i}`,
      type: i < POPULATION_SIZE / 2 ? 'light' : 'dark',
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 80 + 10,
    }));
    setMoths(initialMoths);
    setGeneration(1);
  }, []);

  useEffect(() => {
    initializePopulation();
  }, [initializePopulation]);

  // Hunt a moth (remove it from state with a quick GSAP animation)
  const huntMoth = (mothId, e) => {
    const el = e.currentTarget;

    // Quick shrink "chomp" animation before removing
    gsap.to(el, {
      scale: 0,
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        setMoths(prev => prev.filter(m => m.id !== mothId));
      }
    });
  };

  // Reproduce the survivors to form the next generation
  const nextGeneration = () => {
    if (moths.length === 0) {
      alert("You ate them all! Ecosystem collapsed. Resetting...");
      initializePopulation();
      return;
    }

    // Calculate genetics of survivors
    const lightSurvivors = moths.filter(m => m.type === 'light').length;
    const darkSurvivors = moths.filter(m => m.type === 'dark').length;
    const totalSurvivors = moths.length;

    const lightRatio = lightSurvivors / totalSurvivors;

    // Spawn new population based on survivor ratios
    const nextGen = Array.from({ length: POPULATION_SIZE }).map((_, i) => {
      // 5% mutation chance for realism, otherwise based on parents
      const isMutation = Math.random() < 0.05;
      const willBeLight = Math.random() < lightRatio;

      const type = isMutation ? (Math.random() > 0.5 ? 'light' : 'dark') : (willBeLight ? 'light' : 'dark');

      return {
        id: `moth-gen${generation + 1}-${i}`,
        type,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      };
    });

    // Animate the arena flash for time passing
    gsap.fromTo(arenaRef.current,
      { opacity: 0.5, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }
    );

    setMoths(nextGen);
    setGeneration(prev => prev + 1);
  };

  // Toggle tree color
  const toggleEnvironment = () => {
    setEnvironment(prev => prev === 'light' ? 'dark' : 'light');
  };

  const lightCount = moths.filter(m => m.type === 'light').length;
  const darkCount = moths.filter(m => m.type === 'dark').length;

  return (
    <div className="p-8 rounded-3xl border-2 border-amber-900 dark:border-amber-400 bg-[#FCF4DD] dark:bg-[#451a03] shadow-[6px_6px_0px_#78350f] dark:shadow-[6px_6px_0px_#fbbf24] transition-colors duration-0 space-y-6">

      {/* Header Info */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-300">
            Phase 14 • Natural Selection
          </span>
          <h3 className="text-2xl font-black text-amber-950 dark:text-amber-50 mt-1">
            {moduleData?.title || 'Evolution Simulator'}
          </h3>
          <p className="text-sm font-medium text-amber-900/80 dark:text-amber-200/80 mt-1 max-w-xl">
            You are the predator. Hunt the moths that are easiest to see. Then advance a generation and watch how the population's genetics shift based on survival.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleEnvironment}
            className="px-4 py-2 text-xs font-black rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 hover:scale-105 border border-amber-900/20 shadow-[2px_2px_0px_currentColor] transition-all"
          >
            {environment === 'light' ? '🏭 Pollute Forest' : '🌲 Clean Forest'}
          </button>
          <button
            onClick={nextGeneration}
            className="px-4 py-2 text-xs font-black rounded-xl bg-amber-900 dark:bg-amber-400 text-amber-50 dark:text-amber-950 hover:scale-105 shadow-[2px_2px_0px_currentColor] transition-all"
          >
            Advance Generation ➔
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-between p-4 bg-white/40 dark:bg-amber-950/40 rounded-xl border border-amber-900/20 dark:border-amber-400/20">
        <div className="text-center">
          <div className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase">Generation</div>
          <div className="text-2xl font-black text-amber-950 dark:text-amber-50">{generation}</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase">Light Moths</div>
          <div className="text-2xl font-black text-slate-500 dark:text-slate-300">{lightCount}</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase">Dark Moths</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-50">{darkCount}</div>
        </div>
      </div>

      {/* Hunting Arena */}
      <div
        ref={arenaRef}
        className={`relative w-full h-96 rounded-2xl border-4 overflow-hidden transition-colors duration-700 ease-in-out ${
          environment === 'light'
            ? 'bg-slate-200 border-slate-300' // Birch tree colors
            : 'bg-slate-800 border-slate-900' // Soot-covered tree colors
        }`}
      >
        {moths.map((moth) => (
          <button
            key={moth.id}
            onClick={(e) => huntMoth(moth.id, e)}
            // 'grab-zone' swaps the custom cursor to the open hand!
            className={`grab-zone absolute w-8 h-6 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform ${
              moth.type === 'light'
                ? 'bg-slate-100 border-2 border-slate-300 text-slate-400'
                : 'bg-slate-700 border-2 border-slate-900 text-slate-900'
            }`}
            style={{
              left: `${moth.x}%`,
              top: `${moth.y}%`,
              // Add a random slight rotation so they look organic
              transform: `rotate(${Math.random() * 90 - 45}deg)`
            }}
          >
            {/* Tiny wings pattern */}
            <span className="text-[10px] pointer-events-none font-black opacity-50">ƸӜƷ</span>
          </button>
        ))}

        {moths.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white mix-blend-difference">
            Extinction Event!
          </div>
        )}
      </div>
    </div>
  );
}
