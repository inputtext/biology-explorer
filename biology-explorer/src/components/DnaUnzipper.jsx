import { useRef, useState } from 'react';
import gsap from 'gsap';

export default function DnaUnzipper({ moduleData }) {
  const [isUnzipped, setIsUnzipped] = useState(false);
  const containerRef = useRef(null);
  const leftStrands = useRef([]);
  const rightStrands = useRef([]);
  const bonds = useRef([]);

  const handleUnzip = () => {
    if (isUnzipped) return; // Prevent double clicks
    setIsUnzipped(true);

    const tl = gsap.timeline();

    // 1. Break the hydrogen bonds (fade out the middle connectors)
    tl.to(bonds.current, {
      opacity: 0,
      scaleX: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.in"
    }, 0);

    // 2. Pull the left and right strands apart
    tl.to(leftStrands.current, {
      x: -80,
      opacity: 0.7,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.2)"
    }, 0.2);

    tl.to(rightStrands.current, {
      x: 80,
      opacity: 0.7,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.2)"
    }, 0.2);
  };

  const handleReset = () => {
    setIsUnzipped(false);
    gsap.to([leftStrands.current, rightStrands.current], { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
    gsap.to(bonds.current, { opacity: 1, scaleX: 1, duration: 0.6, delay: 0.3, ease: "power3.out" });
  };

  return (
    <div className="bg-[#FCE1E4] border-2 border-rose-900 rounded-2xl p-8 shadow-[4px_4px_0px_#881337] mt-12" ref={containerRef}>
      <div className="flex justify-between items-end mb-12">
        <div>
          <h3 className="text-3xl font-black text-rose-950 mb-2">{moduleData.title}</h3>
          <p className="text-rose-900/80 font-medium">{moduleData.content}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            disabled={!isUnzipped}
            className="px-4 py-2 bg-white border-2 border-rose-900 rounded-lg font-bold shadow-[2px_2px_0px_#881337] disabled:opacity-50 transition-all hover:enabled:-translate-y-1"
          >
            Reset
          </button>
          <button
            onClick={handleUnzip}
            disabled={isUnzipped}
            className="px-6 py-2 bg-rose-900 text-white border-2 border-rose-900 rounded-lg font-black shadow-[2px_2px_0px_#4c0519] disabled:opacity-50 transition-all hover:enabled:-translate-y-1"
          >
            Inject Helicase
          </button>
        </div>
      </div>

      {/* DNA Visualizer */}
      <div className="flex flex-col items-center gap-4 py-8 overflow-hidden">
        {moduleData.sequence.map((pair, index) => (
          <div key={index} className="flex items-center justify-center relative w-64 h-12">
            {/* Left Base (Adenine / Cytosine) */}
            <div
              ref={(el) => leftStrands.current[index] = el}
              className="absolute left-0 w-24 h-full bg-white border-2 border-rose-900 rounded-l-full flex items-center justify-center font-black text-xl shadow-sm z-10"
            >
              {pair.left}
            </div>

            {/* Hydrogen Bond (Connector) */}
            <div
              ref={(el) => bonds.current[index] = el}
              className="w-16 h-2 bg-rose-300 origin-center"
            ></div>

            {/* Right Base (Thymine / Guanine) */}
            <div
              ref={(el) => rightStrands.current[index] = el}
              className="absolute right-0 w-24 h-full bg-rose-900 text-white border-2 border-rose-900 rounded-r-full flex items-center justify-center font-black text-xl shadow-sm z-10"
            >
              {pair.right}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
