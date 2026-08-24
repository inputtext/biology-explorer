import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function AmbientBackground() {
  const bgRef = useRef(null);

  useEffect(() => {
    const elements = bgRef.current.children;

    // Target every floating "cell" and apply a parallax speed based on its data attribute
    gsap.utils.toArray(elements).forEach((el) => {
      const speed = el.getAttribute('data-speed') || 1;

      gsap.to(el, {
        y: () => -150 * speed, // Moves upward as you scroll down
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5 // Adds a smooth, floating delay to the scroll
        }
      });
    });
  }, []);

  return (
    <div ref={bgRef} className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-[#FAF9F6]">
      {/* Microscopic Out-of-Focus Cell 1 */}
      <div data-speed="1.5" className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] bg-blue-200/30 rounded-full blur-3xl" />

      {/* Microscopic Out-of-Focus Cell 2 */}
      <div data-speed="3" className="absolute top-[40%] right-[10%] w-[40rem] h-[40rem] bg-emerald-200/20 rounded-full blur-3xl" />

      {/* Abstract DNA/Helix Line Art */}
      <svg data-speed="2" className="absolute top-[60%] left-[20%] w-64 h-64 opacity-20 stroke-slate-400" viewBox="0 0 100 100" fill="none" strokeWidth="1.5">
         <path d="M10,50 Q25,20 50,50 T90,50" />
         <path d="M10,50 Q25,80 50,50 T90,50" />
         <line x1="30" y1="35" x2="30" y2="65" />
         <line x1="50" y1="50" x2="50" y2="50" />
         <line x1="70" y1="35" x2="70" y2="65" />
      </svg>

      {/* Microscopic Out-of-Focus Cell 3 */}
      <div data-speed="4" className="absolute bottom-[-10%] right-[30%] w-[25rem] h-[25rem] bg-purple-200/30 rounded-full blur-3xl" />
    </div>
  );
}
