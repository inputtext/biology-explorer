import { useState, useRef } from 'react';
import gsap from 'gsap';

export default function CinematicDarkToggle() {
  const [isDark, setIsDark] = useState(false);
  const wipeRef = useRef(null);
  const buttonRef = useRef(null);

  const handleToggle = (e) => {
    // Grab the exact pixel coordinates of the mouse click
    const x = e.clientX;
    const y = e.clientY;

    // The color the wipe circle will be (the theme we are transitioning TO)
    const targetColor = isDark ? '#FAF9F6' : '#050505';

    // 1. Position the hidden curtain exactly at the mouse click as a tiny dot
    gsap.set(wipeRef.current, {
      backgroundColor: targetColor,
      clipPath: `circle(0px at ${x}px ${y}px)`,
      display: 'block',
      zIndex: 9998 // Just below your custom cartoon hand!
    });

    // 2. Animate the button spinning with a nice physical bounce
    gsap.to(buttonRef.current, {
      rotate: isDark ? -180 : 180,
      duration: 0.8,
      ease: "back.out(1.5)"
    });

    // 3. The After Effects Iris Wipe
    gsap.to(wipeRef.current, {
      // 250vh guarantees it covers the corners even if clicked at the very edge of the screen
      clipPath: `circle(250vh at ${x}px ${y}px)`,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        // Swap the real Tailwind classes underneath while the screen is completely covered
        if (isDark) {
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
        }

        setIsDark(!isDark);

        // Instantly hide the curtain so the newly themed site shows through
        gsap.set(wipeRef.current, { display: 'none' });
      }
    });
  };

  return (
    <>
      {/* The Animated Wipe Overlay */}
      <div ref={wipeRef} className="fixed inset-0 pointer-events-none hidden" />

      {/* The Toggle Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="fixed bottom-8 left-8 z-[9999] w-14 h-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:scale-110 shadow-[4px_4px_0px_currentColor] transition-all"
      >
        {/* pointer-events-none ensures the click registers on the button, not the emoji */}
        <span className="text-2xl pointer-events-none">{isDark ? '☀️' : '🌙'}</span>
      </button>
    </>
  );
}
