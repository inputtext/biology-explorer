import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    // GSAP quickTo creates a highly optimized, lag-free follower
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });

    const moveCursor = (e) => {
      // Offset by 16px (half the width/height of our 32px cursor) to center it on the mouse
      xTo(e.clientX - 16);
      yTo(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
    />
  );
}
