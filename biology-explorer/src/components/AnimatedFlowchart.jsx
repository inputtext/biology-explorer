import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

export default function AnimatedFlowchart({ moduleData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const nodesRef = useRef([]);
  const linesRef = useRef([]);
  const pulsesRef = useRef([]);
  const containerRef = useRef(null);

  const handleStartFlow = () => {
    if (isPlaying) return;
    setIsPlaying(true);

    const tl = gsap.timeline();

    // Reset everything first
    gsap.set(nodesRef.current, { opacity: 0.3, scale: 0.95 });
    gsap.set(linesRef.current, { strokeDasharray: 200, strokeDashoffset: 200 });
    gsap.set(pulsesRef.current, { opacity: 0, x: -50 });

    // 1. Light up Node 1
    tl.to(nodesRef.current[0], { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" });

    // 2. Draw Line 1 and fire pulse 1
    tl.to(linesRef.current[0], { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, "+=0.2");
    tl.to(pulsesRef.current[0], { opacity: 1, duration: 0.1 }, "<");
    tl.to(pulsesRef.current[0], { x: 100, opacity: 0, duration: 0.6, ease: "power2.in" }, "<");

    // 3. Light up Node 2
    tl.to(nodesRef.current[1], { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" });

    // 4. Draw Line 2 and fire pulse 2
    tl.to(linesRef.current[1], { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, "+=0.2");
    tl.to(pulsesRef.current[1], { opacity: 1, duration: 0.1 }, "<");
    tl.to(pulsesRef.current[1], { x: 100, opacity: 0, duration: 0.6, ease: "power2.in" }, "<");

    // 5. Light up Node 3
    tl.to(nodesRef.current[2], { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" });

    // Allow replay after it finishes
    tl.eventCallback("onComplete", () => setIsPlaying(false));
  };

  return (
    <div className="bg-[#FCF4DD] border-2 border-amber-900 rounded-2xl p-8 shadow-[4px_4px_0px_#78350f] mt-12" ref={containerRef}>
      <div className="flex justify-between items-end mb-12">
        <div className="max-w-2xl">
          <h3 className="text-3xl font-black text-amber-950 mb-2">{moduleData.title}</h3>
          <p className="text-amber-900/80 font-medium">{moduleData.content}</p>
        </div>
        <button
          onClick={handleStartFlow}
          disabled={isPlaying}
          className="px-6 py-3 bg-amber-900 text-white border-2 border-amber-900 rounded-xl font-black shadow-[2px_2px_0px_#451a03] disabled:opacity-50 hover:enabled:-translate-y-1 transition-all shrink-0"
        >
          {isPlaying ? 'Reaction in Progress...' : 'Trigger Reaction ⚡'}
        </button>
      </div>

      {/* The Flowchart Pipeline */}
      <div className="relative flex flex-col md:flex-row justify-between items-center gap-4 py-8">

        {moduleData.steps.map((step, index) => (
          <div key={index} className="flex items-center relative w-full md:w-1/3">

            {/* The Node */}
            <div
              ref={el => nodesRef.current[index] = el}
              className="bg-white border-2 border-amber-900 p-6 rounded-2xl shadow-inner w-full relative z-10 opacity-30 scale-95"
            >
              <h4 className="text-xl font-black text-amber-950 mb-2">{step.title}</h4>
              <p className="text-sm font-medium text-amber-900/80">{step.desc}</p>
            </div>

            {/* The Connecting Arrow (Only render if not the last node) */}
            {index < moduleData.steps.length - 1 && (
              <div className="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-8 z-0">
                {/* SVG Line that draws itself */}
                <svg className="w-full h-full overflow-visible">
                  <line
                    ref={el => linesRef.current[index] = el}
                    x1="0" y1="16" x2="64" y2="16"
                    stroke="#78350f"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                  />
                  <polygon points="56,8 64,16 56,24" fill="#78350f" />
                </svg>

                {/* The glowing energy pulse that flies across the line */}
                <div
                  ref={el => pulsesRef.current[index] = el}
                  className="absolute top-[12px] left-0 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15] opacity-0"
                ></div>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}
