import { useState, useRef } from 'react';
import gsap from 'gsap';

export default function LevelsOfOrganization({ moduleData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const contentRef = useRef(null);
  const { levels } = moduleData;

  const currentLevel = levels[currentIndex];

  const animateTransition = (newIndex, direction) => {
    const tl = gsap.timeline();

    // If zooming IN, the old element scales UP (comes toward you) and fades out
    // If zooming OUT, the old element scales DOWN (moves away) and fades out
    const scaleTo = direction === "in" ? 1.5 : 0.5;
    const scaleFrom = direction === "in" ? 0.5 : 1.5;

    tl.to(contentRef.current, {
      scale: scaleTo,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setCurrentIndex(newIndex);
        gsap.fromTo(contentRef.current,
          { scale: scaleFrom, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
        );
      }
    });
  };

  const handleZoomIn = () => {
    if (currentIndex < levels.length - 1) {
      animateTransition(currentIndex + 1, "in");
    }
  };

  const handleZoomOut = () => {
    if (currentIndex > 0) {
      animateTransition(currentIndex - 1, "out");
    }
  };

  return (
    <div className="bg-[#FCF4DD] border-2 border-amber-900 rounded-2xl p-8 shadow-[4px_4px_0px_#78350f] mt-12">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black text-amber-950 mb-2">{moduleData.title}</h3>
        <p className="text-amber-900/80 font-medium">{moduleData.content}</p>
      </div>

      {/* Viewport / Microscope Lens */}
      <div className="relative bg-white border-4 border-amber-900 rounded-full w-72 h-72 mx-auto flex items-center justify-center overflow-hidden shadow-inner mb-8">
        <div ref={contentRef} className="text-center p-6 w-full">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 block mb-2">
            Level {currentLevel.depth} / 8
          </span>
          <h4 className="text-3xl font-black text-slate-900 mb-3">{currentLevel.title}</h4>
          <p className="text-sm font-medium text-slate-600 leading-tight">
            {currentLevel.desc}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleZoomOut}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-white border-2 border-amber-900 rounded-xl font-bold text-amber-950 shadow-[2px_2px_0px_#78350f] disabled:opacity-50 transition-all hover:enabled:-translate-y-1"
        >
          🔍 Zoom Out
        </button>
        <button
          onClick={handleZoomIn}
          disabled={currentIndex === levels.length - 1}
          className="px-8 py-3 bg-amber-900 text-white border-2 border-amber-900 rounded-xl font-black shadow-[2px_2px_0px_#451a03] disabled:opacity-50 transition-all hover:enabled:-translate-y-1"
        >
          Magnify deeper 🔬
        </button>
      </div>
    </div>
  );
}
