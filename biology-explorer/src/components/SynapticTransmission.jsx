import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

export default function SynapticTransmission({ moduleData }) {
  const [isFiring, setIsFiring] = useState(false);
  const containerRef = useRef(null);

  // Element Refs for GSAP
  const actionPotentialRef = useRef(null);
  const vesiclesRef = useRef([]);
  const transmittersRef = useRef([]);
  const postSignalRef = useRef(null);

  const fireImpulse = () => {
    if (isFiring) return;
    setIsFiring(true);

    const tl = gsap.timeline({
      onComplete: () => {
        // Reset everything after 1 second so they can fire it again
        setTimeout(() => {
          gsap.set(actionPotentialRef.current, { y: -100, opacity: 0 });
          gsap.set(vesiclesRef.current, { y: 0, opacity: 1, scale: 1 });
          gsap.set(transmittersRef.current, { y: 0, opacity: 0, scale: 0.5 });
          gsap.set(postSignalRef.current, { opacity: 0, scale: 0.8 });
          setIsFiring(false);
        }, 1500);
      }
    });

    // 1. Electrical signal shoots down the axon
    tl.to(actionPotentialRef.current, { y: 120, opacity: 1, duration: 0.4, ease: "power2.in" })
      .to(actionPotentialRef.current, { opacity: 0, duration: 0.1 });

    // 2. Vesicles move down and fuse with the membrane
    tl.to(vesiclesRef.current, {
      y: 60,
      scaleX: 1.5,
      scaleY: 0.5,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.in"
    });

    // 3. Neurotransmitters burst across the synaptic cleft
    tl.to(transmittersRef.current, {
      y: 80,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: { amount: 0.3, from: "random" },
      ease: "power1.out"
    }, "-=0.3");

    // 4. Post-synaptic neuron fires its own electrical signal
    tl.to(postSignalRef.current, {
      opacity: 1,
      scale: 1.1,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 3
    })
    .to(transmittersRef.current, { opacity: 0, duration: 0.3 }, "<"); // Transmitters degrade/reuptake
  };

  return (
    <div className="bg-[#E8DFF5] border-2 border-purple-900 rounded-2xl p-8 shadow-[4px_4px_0px_#581c87] mt-12" ref={containerRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="max-w-xl">
          <h3 className="text-3xl font-black text-purple-950 mb-2">{moduleData.title}</h3>
          <p className="text-purple-900/80 font-medium">{moduleData.content}</p>
        </div>
        <button
          onClick={fireImpulse}
          disabled={isFiring}
          className="px-6 py-3 bg-purple-900 text-white border-2 border-purple-900 rounded-xl font-black shadow-[2px_2px_0px_#3b0764] disabled:opacity-50 hover:enabled:-translate-y-1 transition-all shrink-0"
        >
          {isFiring ? 'Transmitting...' : 'Fire Action Potential ⚡'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-xl border-2 border-purple-900/20 shadow-inner">

        {/* The Legend / Steps */}
        <div className="space-y-4">
          <h4 className="font-black text-purple-900 uppercase tracking-widest text-sm mb-4 border-b-2 border-purple-100 pb-2">Sequence of Events</h4>
          {moduleData.steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs shrink-0">
                {idx + 1}
              </div>
              <p className="text-slate-700 font-medium text-sm">{step}</p>
            </div>
          ))}
        </div>

        {/* The Synapse Animation Canvas */}
        <div className="relative h-80 flex flex-col items-center justify-between border-4 border-dashed border-purple-200 rounded-2xl overflow-hidden bg-slate-50">

          {/* Pre-Synaptic Terminal (Top Neuron) */}
          <div className="relative w-48 h-24 bg-purple-200 border-b-4 border-purple-900 rounded-b-[3rem] flex justify-center z-10">
            {/* Action Potential Bolt */}
            <div
              ref={actionPotentialRef}
              className="absolute -top-12 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] opacity-0 -translate-y-full"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>

            {/* Vesicles */}
            <div className="absolute bottom-4 flex gap-4">
              {[1, 2, 3].map((v) => (
                <div
                  key={v}
                  ref={el => vesiclesRef.current[v] = el}
                  className="w-8 h-8 rounded-full border-2 border-purple-900 bg-purple-100 flex items-center justify-center shadow-inner"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Synaptic Cleft (The Gap) & Neurotransmitters */}
          <div className="relative w-full h-32 z-20 pointer-events-none">
             {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  ref={el => transmittersRef.current[i] = el}
                  className="absolute w-3 h-3 bg-purple-600 rounded-full shadow-[0_0_5px_#9333ea] opacity-0"
                  style={{
                    left: `${30 + (i * 3.5)}%`,
                    top: '10px'
                  }}
                ></div>
             ))}
          </div>

          {/* Post-Synaptic Dendrite (Bottom Neuron) */}
          <div className="relative w-64 h-16 bg-emerald-100 border-t-4 border-emerald-900 rounded-t-3xl flex justify-center items-start pt-2">
            {/* Receptors */}
            <div className="flex gap-6">
              {[1, 2, 3, 4].map(r => (
                <div key={r} className="w-6 h-4 border-b-4 border-l-4 border-r-4 border-emerald-900 rounded-b-md"></div>
              ))}
            </div>

            {/* Post-Synaptic Flash */}
            <div
              ref={postSignalRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-300 opacity-0 mix-blend-overlay rounded-t-3xl pointer-events-none"
            ></div>
          </div>

        </div>
      </div>
    </div>
  );
}
