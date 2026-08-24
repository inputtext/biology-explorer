import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

export default function PhagocytosisBattlefield({ moduleData }) {
  const [isDeployed, setIsDeployed] = useState(false);

  const containerRef = useRef(null);
  const macrophageRef = useRef(null);
  const pathogenRef = useRef(null);
  const feedbackRef = useRef(null);

  // Floating idle animation for the pathogen
  useEffect(() => {
    if (!isDeployed && pathogenRef.current) {
      gsap.to(pathogenRef.current, {
        y: "+=15",
        x: "-=10",
        rotation: 15,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  }, [isDeployed]);

  const deployMacrophage = () => {
    if (isDeployed) return;
    setIsDeployed(true);

    // Stop the idle animation
    gsap.killTweensOf(pathogenRef.current);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          // Reset the battlefield after 2 seconds
          gsap.set(macrophageRef.current, { x: 0, y: 0, scale: 1, backgroundColor: '#f8fafc' });
          gsap.set(pathogenRef.current, { x: 0, y: 0, scale: 1, opacity: 1 });
          feedbackRef.current.innerText = "Battlefield clear. Waiting for threats...";
          setIsDeployed(false);
        }, 2000);
      }
    });

    feedbackRef.current.innerText = "Target acquired. Moving to intercept...";

    // 1. Macrophage moves to the pathogen
    tl.to(macrophageRef.current, {
      x: 200,
      duration: 1.2,
      ease: "power2.inOut"
    })

    // 2. Macrophage engulfs the pathogen (expands and turns slightly green/active)
    .to(macrophageRef.current, {
      scale: 1.5,
      backgroundColor: '#d1fae5',
      duration: 0.5,
      onStart: () => { feedbackRef.current.innerText = "Engulfing pathogen (Phagocytosis)..."; }
    })

    // 3. Pathogen is dragged "inside" and digested (shrinks and fades)
    .to(pathogenRef.current, {
      x: -50,
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "power3.in",
      onStart: () => { feedbackRef.current.innerText = "Enzymes breaking down the threat!"; }
    }, "<")

    // 4. Macrophage returns to normal size
    .to(macrophageRef.current, {
      scale: 1.1,
      duration: 0.5
    });
  };

  return (
    <div className="bg-[#D4F0E4] border-2 border-emerald-900 rounded-2xl p-8 shadow-[4px_4px_0px_#064e3b] mt-12" ref={containerRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div className="max-w-xl">
          <h3 className="text-3xl font-black text-emerald-950 mb-2">{moduleData.title}</h3>
          <p className="text-emerald-900/80 font-medium">{moduleData.content}</p>
        </div>
        <button
          onClick={deployMacrophage}
          disabled={isDeployed}
          className="px-6 py-3 bg-emerald-900 text-white border-2 border-emerald-900 rounded-xl font-black shadow-[2px_2px_0px_#022c22] disabled:opacity-50 hover:enabled:-translate-y-1 transition-all shrink-0"
        >
          {isDeployed ? 'Combat in Progress ⚔️' : 'Deploy Macrophage 🛡️'}
        </button>
      </div>

      <div className="bg-white border-4 border-dashed border-emerald-200 rounded-2xl p-6 relative overflow-hidden h-64 flex items-center justify-between">

        {/* The Macrophage (Hero) */}
        <div
          ref={macrophageRef}
          className="w-24 h-24 bg-slate-50 border-4 border-emerald-400 rounded-full shadow-lg flex items-center justify-center z-20 relative"
          style={{ borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%' }} // Blobby organic shape
        >
          <span className="text-xs font-black text-emerald-700">WBC</span>
        </div>

        {/* The Pathogen (Enemy) */}
        <div
          ref={pathogenRef}
          className="w-12 h-12 bg-rose-500 border-2 border-rose-900 rounded-full flex items-center justify-center z-10 relative mr-12"
          style={{ boxShadow: '0 0 15px rgba(244, 63, 94, 0.6)' }}
        >
           {/* Spikes on the virus */}
           <div className="absolute w-full h-1 bg-rose-900 rotate-0"></div>
           <div className="absolute w-full h-1 bg-rose-900 rotate-45"></div>
           <div className="absolute w-full h-1 bg-rose-900 rotate-90"></div>
           <div className="absolute w-full h-1 bg-rose-900 -rotate-45"></div>
        </div>

      </div>

      {/* Live Feedback Console */}
      <div className="mt-6 bg-emerald-950 text-emerald-400 p-4 rounded-xl font-mono text-sm shadow-inner">
     <span ref={feedbackRef}>Battlefield clear. Waiting for threats...</span>
      </div>
    </div>
  );
}
