import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const location = useLocation();
  const contentRef = useRef(null);
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (!contentRef.current) return;

    const isInitialLoad =
      previousPath.current === location.pathname;

    const ctx = gsap.context(() => {
      // IMPORTANT:
      // Do not animate y/x/scale here.
      // Those create CSS transforms and can break
      // position: fixed elements inside the route.

      gsap.fromTo(
        contentRef.current,
        {
          opacity: 0,
          clipPath: 'inset(4% 0 0 0)',
        },
        {
          opacity: 1,
          clipPath: 'inset(0% 0 0 0)',
          duration: isInitialLoad ? 0.55 : 0.65,
          ease: 'power3.out',
          clearProps: 'clipPath',
        }
      );
    }, contentRef);

    previousPath.current = location.pathname;

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div ref={contentRef}>
      {children}
    </div>
  );
}
