import { useRef } from "react";
import gsap from "gsap";

export default function Magnetic({
  children,
  strength = 0.25,
  radius = 120,
  className = "",
  disabled = false,
}) {
  const ref = useRef(null);

  const handleMove = (event) => {
    if (disabled || !ref.current) return;

    const element = ref.current;
    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance > radius) {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.35,
        ease: "power3.out",
      });

      return;
    }

    gsap.to(element, {
      x: distanceX * strength,
      y: distanceY * strength,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.35)",
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}
