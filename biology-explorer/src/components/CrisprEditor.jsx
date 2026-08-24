import { useRef, useState } from 'react';
import gsap from 'gsap';

export default function CrisprEditor({ moduleData }) {
  const [isEditing, setIsEditing] = useState(false);

  const containerRef = useRef(null);
  const cas9Ref = useRef(null);
  const dnaLeftRef = useRef(null);
  const dnaRightRef = useRef(null);
  const newGeneRef = useRef(null);
  const feedbackRef = useRef(null);

  const triggerCRISPR = () => {
    if (isEditing) return;
    setIsEditing(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          // Reset timeline after 3 seconds so the user can play it again
          gsap.set([dnaLeftRef.current, dnaRightRef.current], { x: 0 });
          gsap.set(newGeneRef.current, { y: -50, opacity: 0, scale: 0.8 });
          gsap.set(cas9Ref.current, { x: 0, opacity: 0, scale: 0.8 });
          feedbackRef.current.innerText = "System ready. Awaiting target coordinates...";
          setIsEditing(false);
        }, 3000);
      }
    });

    // 1. Cas9 appears and scans the DNA
    tl.to(cas9Ref.current, { opacity: 1, scale: 1, duration: 0.4, onStart: () => { feedbackRef.current.innerText = "Cas9 deployed. Scanning for target sequence..."; } })
      .to(cas9Ref.current, { x: 180, duration: 1.5, ease: "power1.inOut" })

    // 2. Cleavage: Cas9 cuts the DNA and the strands pull apart
      .to(cas9Ref.current, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, onStart: () => { feedbackRef.current.innerText = "Target found! Initiating double-strand break..."; } })
      .to(dnaLeftRef.current, { x: -60, duration: 0.6, ease: "back.out(1.2)" }, "+=0.2")
      .to(dnaRightRef.current, { x: 60, duration: 0.6, ease: "back.out(1.2)" }, "<")

    // 3. Cas9 disengages
      .to(cas9Ref.current, { y: 50, opacity: 0, duration: 0.4 }, "-=0.2")

    // 4. Ligation: The new synthetic gene drops into place
      .to(newGeneRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "bounce.out", onStart: () => { feedbackRef.current.innerText = "Splicing successful. New gene inserted!"; } })

    // 5. The DNA strands close in to bond with the new gene
      .to(dnaLeftRef.current, { x: -45, duration: 0.3 }, "+=0.2")
      .to(dnaRightRef.current, { x: 45, duration: 0.3 }, "<");
  };

  return (
    <div className="bg-[#D4F0E4] border-2 border-emerald-900 rounded-2xl p-8 shadow-[4px_4px_0px_#064e3b] mt-12" ref={containerRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="max-w-xl">
          <h3 className="text-3xl font-black text-emerald-950 mb-2">{moduleData.title}</h3>
          <p className="text-emerald-900/80 font-medium">{moduleData.content}</p>
        </div>
        <button
          onClick={triggerCRISPR}
          disabled={isEditing}
          className="px-6 py-3 bg-emerald-900 text-white border-2 border-emerald-900 rounded-xl font-black shadow-[2px_2px_0px_#022c22] disabled:opacity-50 hover:enabled:-translate-y-1 transition-all shrink-0"
        >
          {isEditing ? 'Editing Genome...' : 'Initialize CRISPR ✂️'}
        </button>
      </div>

      <div className="bg-slate-900 border-4 border-slate-700 rounded-2xl p-8 relative overflow-hidden h-56 flex flex-col items-center justify-center font-mono shadow-inner">

        {/* The Cas9 Enzyme Blob */}
        <div
          ref={cas9Ref}
          className="absolute z-10 w-24 h-24 bg-rose-500/80 blur-sm rounded-full opacity-0 pointer-events-none"
          style={{ left: '20%', top: '35%' }}
        ></div>

        {/* The DNA Sequence Container */}
        <div className="relative z-20 flex items-center justify-center text-2xl font-bold tracking-[0.3em] w-full mt-4">

          {/* Left DNA Strand */}
          <div ref={dnaLeftRef} className="text-slate-300 flex">
            <span>A</span><span className="text-emerald-400">T</span><span>G</span><span>C</span><span>G</span><span>A</span>
          </div>

          {/* The Target Gap */}
          <div className="w-4 h-full relative mx-2">
             {/* The New Glowing Gene (Hidden initially) */}
             <div
               ref={newGeneRef}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400 font-black tracking-normal opacity-0 scale-50 whitespace-nowrap bg-yellow-400/20 px-2 py-1 rounded border border-yellow-400 shadow-[0_0_15px_#facc15]"
             >
               [ GFP ]
             </div>
          </div>

          {/* Right DNA Strand */}
          <div ref={dnaRightRef} className="text-slate-300 flex">
            <span>T</span><span>C</span><span className="text-rose-400">A</span><span>G</span><span>T</span><span>C</span>
          </div>

        </div>

        {/* Structural DNA Line underneath to make it look like a double helix strand */}
        <div className="absolute top-[60%] w-3/4 h-2 border-t-2 border-b-2 border-slate-600 opacity-30 pointer-events-none"></div>
      </div>

      {/* Terminal Feedback Output */}
      <div className="mt-6 bg-black text-emerald-400 p-4 rounded-xl font-mono text-sm shadow-inner">
        $ <span ref={feedbackRef}>System ready. Awaiting target coordinates...</span>
      </div>
    </div>
  );
}
