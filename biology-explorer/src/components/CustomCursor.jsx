import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const imgRef = useRef(null);
  const rippleRef = useRef(null); // NEW: Controls the click ripple ring

  useEffect(() => {
    const cursor = cursorRef.current;
    const img = imgRef.current;
    const ripple = rippleRef.current;

    gsap.set(cursor, { opacity: 1, scale: 1 });
    gsap.set(ripple, { scale: 0, opacity: 0 }); // Hide the ripple initially

    // Slightly increased duration (0.15) for an even smoother glide
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });

    const onMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseDown = () => {
      // 1. Squeeze the hand down quickly
      gsap.to(cursor, { scale: 0.75, duration: 0.15, ease: "power2.out" });

      // 2. Fire the Tactile Click Ripple!
      // It starts small and opaque, then explodes outward while fading away
      gsap.fromTo(ripple,
        { scale: 0.1, opacity: 0.6, borderWidth: '4px' },
        { scale: 2.5, opacity: 0, borderWidth: '0px', duration: 0.5, ease: "power3.out" }
      );
    };

    const onMouseUp = () => {
      // UPGRADE: Uses "elastic.out" so the hand jiggles/bounces slightly when releasing a click
      gsap.to(cursor, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    const onMouseOver = (e) => {
      if (e.target.closest('.grab-zone, [data-cursor="grab"]')) {
        img.src = '/openhand.svg';
        gsap.to(cursor, {
          scale: 1.15,
          rotate: 0,
          duration: 0.4,
          ease: "back.out(1.5)" // UPGRADE: Bouncy "pop" when entering a grab zone
        });
      }
      else if (e.target.closest('button, a, input, [role="button"]')) {
        img.src = '/pointinghand.svg';
        gsap.to(cursor, {
          scale: 1.5,
          rotate: -15,
          duration: 0.5,
          ease: "back.out(1.5)" // UPGRADE: Bouncy tilt for buttons
        });
      }
    };

    const onMouseOut = (e) => {
      if (e.target.closest('button, a, input, [role="button"], .grab-zone, [data-cursor="grab"]')) {
        img.src = '/pointinghand.svg';
        gsap.to(cursor, {
          scale: 1,
          rotate: 0,
          duration: 0.4,
          ease: "power3.out"
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

 return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-9999 flex items-center justify-center"
      style={{ transformOrigin: 'top left' }}
    >
      {/* THE CLICK RIPPLE */}
      <div
        ref={rippleRef}
        className="absolute top-0 left-0 w-8 h-8 rounded-full border-slate-900 border-solid pointer-events-none"
        style={{ marginLeft: '-16px', marginTop: '-16px' }} // Centered ripple
      />

      {/* THE HAND */}
      <img
        ref={imgRef}
        src="/pointinghand.svg"
        alt="cursor"
        className="w-20 h-20 object-contain drop-shadow-md relative z-10"
        // ADJUST THESE TWO VALUES:
        // Increase negative marginLeft to push the hand further left
        // Increase negative marginTop to push the hand further up
        style={{ marginLeft: '-37px', marginTop: '-37px' }}
      />

      {/* CALIBRATION DOT: This shows exactly where the computer thinks you are clicking */}

    </div>
  );
}
