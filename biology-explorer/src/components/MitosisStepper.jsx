import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MitosisStepper({ moduleData }) {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    // gsap.context ensures all ScrollTriggers are killed when the component unmounts
    let ctx = gsap.context(() => {

      // 1. Animate the center line scrubbing down
      gsap.fromTo(lineRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true, // Ties the animation directly to the scrollbar
          }
        }
      );

      // 2. Animate each card snapping into focus
      stepsRef.current.forEach((step, index) => {
        // Alternate cards left and right
        const xOffset = index % 2 === 0 ? -50 : 50;

        gsap.fromTo(step,
          { opacity: 0.2, scale: 0.9, x: xOffset },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.6,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: step,
              start: "top 65%", // Triggers when the top of the card hits 65% down the viewport
              end: "bottom 35%",
              toggleActions: "play reverse play reverse", // Fades out when scrolling past
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div className="mt-24 mb-32" ref={containerRef}>
      <div className="text-center mb-16">
        <h3 className="text-4xl font-black mb-4">{moduleData.title}</h3>
        <p className="text-xl text-slate-600 font-medium">{moduleData.content}</p>
      </div>

      <div className="relative max-w-3xl mx-auto py-10">
        {/* Background Track Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-slate-200 -translate-x-1/2 rounded-full"></div>

        {/* Animated Fill Line */}
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 w-2 bg-slate-900 -translate-x-1/2 rounded-full origin-top"
        ></div>

        {/* Phase Cards */}
        <div className="space-y-24 relative z-10">
          {moduleData.phases.map((phase, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                ref={(el) => (stepsRef.current[index] = el)}
                className={`flex items-center w-full ${isEven ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`w-5/12 bg-[#FCF4DD] border-2 border-amber-900 p-6 rounded-2xl shadow-[4px_4px_0px_#78350f] ${isEven ? 'mr-auto text-right' : 'ml-auto text-left'}`}>
                  <h4 className="text-2xl font-black text-amber-950 mb-2">{phase.title}</h4>
                  <p className="text-amber-900/80 font-medium">{phase.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
