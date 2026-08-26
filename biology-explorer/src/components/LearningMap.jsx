import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import bioData from "../data/biologyData.json";

const phaseStyles = [
  {
    bg: "bg-amber-100 dark:bg-amber-950",
    border: "border-amber-900 dark:border-amber-400",
    text: "text-amber-950 dark:text-amber-50",
    accent: "bg-amber-400",
  },
  {
    bg: "bg-emerald-100 dark:bg-emerald-950",
    border: "border-emerald-900 dark:border-emerald-400",
    text: "text-emerald-950 dark:text-emerald-50",
    accent: "bg-emerald-400",
  },
  {
    bg: "bg-purple-100 dark:bg-purple-950",
    border: "border-purple-900 dark:border-purple-400",
    text: "text-purple-950 dark:text-purple-50",
    accent: "bg-purple-400",
  },
  {
    bg: "bg-rose-100 dark:bg-rose-950",
    border: "border-rose-900 dark:border-rose-400",
    text: "text-rose-950 dark:text-rose-50",
    accent: "bg-rose-400",
  },
];

export default function LearningMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const nodes = mapRef.current.querySelectorAll("[data-learning-node]");
    const lines = mapRef.current.querySelectorAll("[data-learning-line]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        nodes,
        {
          opacity: 0,
          y: 35,
          scale: 0.94,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "back.out(1.4)",
        },
      );

      gsap.fromTo(
        lines,
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.12,
          delay: 0.25,
          ease: "power3.out",
        },
      );
    }, mapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={mapRef}
      className="mt-20"
      aria-labelledby="learning-map-title"
    >
      {/* Section heading */}
      <div className="mb-10">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Explore the curriculum
        </span>

        <h2
          id="learning-map-title"
          className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl"
        >
          Biology Learning Map
        </h2>

        <p className="mt-3 max-w-2xl text-lg font-medium text-slate-600 dark:text-slate-400">
          Follow the journey from the foundations of life to advanced biological
          systems.
        </p>
      </div>

      {/* Map */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-slate-900 bg-[#F8F7F2] p-5 shadow-[6px_6px_0px_#0f172a] dark:border-slate-300 dark:bg-slate-950 dark:shadow-[6px_6px_0px_#94a3b8] md:p-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20">
          <div className="absolute left-[10%] top-[20%] h-40 w-40 rounded-full bg-emerald-200 blur-3xl dark:bg-emerald-900" />
          <div className="absolute right-[10%] top-[45%] h-52 w-52 rounded-full bg-purple-200 blur-3xl dark:bg-purple-900" />
          <div className="absolute bottom-[10%] left-[40%] h-44 w-44 rounded-full bg-amber-200 blur-3xl dark:bg-amber-900" />
        </div>

        {/* Header */}
        <div className="relative z-10 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Learning journey
            </div>

            <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
              {bioData.hubs.length} phases
            </div>
          </div>

          <div className="rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-xs font-black text-slate-900 dark:border-slate-300 dark:bg-slate-900 dark:text-white">
            START → EXPLORE → MASTER
          </div>
        </div>

        {/* Desktop map */}
        <div className="relative z-10 hidden md:block">
          <div className="grid grid-cols-3 gap-5">
            {bioData.hubs.map((hub, index) => {
              const style = phaseStyles[index % phaseStyles.length];

              return (
                <div
                  key={hub.id}
                  data-learning-node
                  className={`group relative rounded-2xl border-2 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_currentColor] ${style.bg} ${style.border} ${style.text}`}
                >
                  <Link
                    to={`/hub/${hub.id}`}
                    className="absolute inset-0 z-20 rounded-2xl"
                    aria-label={`Open ${hub.title}`}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-widest opacity-60">
                      Phase {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`h-3 w-3 rounded-full border-2 border-current ${style.accent}`}
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-black leading-tight">
                    {hub.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm font-medium opacity-70">
                    {hub.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-xs font-black uppercase tracking-wider opacity-60">
                    <span>{hub.modules?.length || 0} modules</span>

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      Explore →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connection lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            {Array.from({
              length: Math.max(0, bioData.hubs.length - 1),
            }).map((_, index) => {
              const row = Math.floor(index / 3);
              const column = index % 3;

              if (column === 2) return null;

              return (
                <div
                  key={index}
                  data-learning-line
                  className="absolute h-1 rounded-full bg-slate-300 dark:bg-slate-700"
                  style={{
                    left: `${32 + column * 33}%`,
                    top: `${12 + row * 33}%`,
                    width: "6%",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Mobile map */}
        <div className="relative z-10 space-y-4 md:hidden">
          {bioData.hubs.map((hub, index) => {
            const style = phaseStyles[index % phaseStyles.length];

            return (
              <Link
                key={hub.id}
                to={`/hub/${hub.id}`}
                data-learning-node
                className={`block rounded-2xl border-2 p-5 transition-all active:translate-y-0 ${style.bg} ${style.border} ${style.text}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-black uppercase tracking-widest opacity-60">
                    Phase {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-sm font-black">→</span>
                </div>

                <h3 className="mt-4 text-xl font-black">{hub.title}</h3>

                <p className="mt-2 text-sm font-medium opacity-70">
                  {hub.description}
                </p>

                <div className="mt-4 text-xs font-black uppercase tracking-widest opacity-60">
                  {hub.modules?.length || 0} modules
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-4 border-t-2 border-slate-200 pt-5 dark:border-slate-800">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400">
            <span className="h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400 dark:border-slate-300" />
            Available to explore
          </div>

          <div className="text-xs font-black uppercase tracking-widest text-slate-400">
            Your journey starts here
          </div>
        </div>
      </div>
    </section>
  );
}
