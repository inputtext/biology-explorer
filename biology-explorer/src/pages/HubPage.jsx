import { useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

import bioData from '../data/biologyData.json';
import AiTutor from '../components/AiTutor';
import Breadcrumbs from '../components/Breadcrumbs';
import { getModuleComponent } from '../config/moduleRegistry';
import { useProgress } from '../context/ProgressContext';
import ModuleStatusBadge from '../components/ModuleStatusBadge';

export default function HubPage() {
  const { hubId } = useParams();

  const [isAiOpen, setIsAiOpen] = useState(false);

  const titleRef = useRef(null);
  const headerRef = useRef(null);
  const modulesContainerRef = useRef(null);

  const {
    startModule,
    completeModule,
    getModuleProgress,
  } = useProgress();

  const hub = bioData.hubs.find(
    (h) => h.id === hubId
  );

  /*
   * Calculate overall hub progress.
   */
  const hubProgress = hub
    ? (() => {
        if (!hub.modules.length) return 0;

        const total = hub.modules.reduce(
          (sum, module) =>
            sum + getModuleProgress(module.id).progress,
          0
        );

        return Math.round(
          total / hub.modules.length
        );
      })()
    : 0;

  const completedModules = hub
    ? hub.modules.filter(
        (module) =>
          getModuleProgress(module.id).status ===
          'completed'
      ).length
    : 0;

  useEffect(() => {
    if (!hub) return;

    // 1. Split the title text into characters
    let splitTitle;
    if (titleRef.current) {
      splitTitle = new SplitType(titleRef.current, { types: 'chars' });
    }

    const tl = gsap.timeline();

    // 2. Cinematic Character Reveal
    if (splitTitle && splitTitle.chars) {
      tl.from(splitTitle.chars, {
        y: 50,
        opacity: 0,
        rotationX: -90,
        stagger: 0.03, // Delays each letter slightly for a wave effect
        duration: 0.8,
        ease: 'back.out(1.5)',
        transformOrigin: 'bottom center'
      });
    }

    // 3. Header fade in (description and progress bar)
    if (headerRef.current) {
      tl.fromTo(headerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );
    }

    // 4. Module cascade (Your existing animation)
    if (modulesContainerRef.current && modulesContainerRef.current.children.length > 0) {
      tl.fromTo(modulesContainerRef.current.children,
        { y: 150, opacity: 0, rotationX: 25, scale: 0.95 },
        { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.9, stagger: 0.15, ease: 'back.out(1.2)', transformPerspective: 1200 },
        '-=0.6'
      );
    }

    return () => {
      tl.kill();
      if (splitTitle) splitTitle.revert(); // Essential cleanup
    };
  }, [hubId, hub]);

  if (!hub) {
    return (
      <div className="p-24 text-center font-black text-4xl dark:text-slate-50">
        Hub not found.
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto min-h-screen relative overflow-hidden transition-colors duration-0">
      <Breadcrumbs />

      {/* =====================================================
          HUB HEADER
      ====================================================== */}
      <header className="mb-12">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-slate-50 relative [perspective:1000px]"
        >
          {hub.title}
        </h1>

        {/* We moved headerRef here so it doesn't hide the <h1> animation! */}
        <div ref={headerRef}>
          <p className="text-xl font-medium text-slate-600 dark:text-slate-400">
            {hub.description}
          </p>

          {/* Overall progress */}
          <div className="mt-8 rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_#0f172a] dark:border-slate-300 dark:bg-slate-950 dark:shadow-[4px_4px_0px_#94a3b8]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Hub Progress
                </div>

                <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                  {hubProgress}% complete
                </div>
              </div>

              <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {completedModules} / {hub.modules.length}{' '}
                modules completed
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-4 overflow-hidden rounded-full border-2 border-slate-900 bg-slate-100 dark:border-slate-300 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                style={{
                  width: `${hubProgress}%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MODULES
      ====================================================== */}
      <div
        className="space-y-16 pb-32 perspective-[2000px]"
        ref={modulesContainerRef}
      >
        {hub.modules.map((module, index) => {
          const ModuleComponent = getModuleComponent(module.type);

          if (!ModuleComponent) {
            console.warn(`Unknown Biology Explorer module type: ${module.type}`);
            return null;
          }

          const moduleProgress = getModuleProgress(module.id);
          const isCompleted = moduleProgress.status === 'completed';
          const isStarted = moduleProgress.status === 'in-progress';

          return (
            <section
              key={module.id}
              className="relative"
              aria-labelledby={`module-${module.id}`}
            >
              {/* Module progress header */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Module {String(index + 1).padStart(2, '0')}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${
                      isCompleted
                        ? 'border-emerald-700 bg-emerald-100 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300'
                        : isStarted
                          ? 'border-amber-700 bg-amber-100 text-amber-800 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-300'
                          : 'border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓ Completed' : isStarted ? '◐ In Progress' : '○ Not Started'}
                  </span>

                  {/* THE LOTTIE BADGE */}
                  <ModuleStatusBadge status={moduleProgress.status} />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-500 dark:text-slate-400">
                    {moduleProgress.progress}%
                  </span>

                  {!isCompleted && (
                    <button
                      onClick={() => {
                        if (!isStarted) {
                          startModule(module.id);
                        }
                        completeModule(module.id);
                      }}
                      className="rounded-lg border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-300 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                    >
                      {isStarted ? 'Mark Complete' : 'Start & Complete'}
                    </button>
                  )}
                </div>
              </div>

              {/* Individual progress bar */}
              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${moduleProgress.progress}%` }}
                />
              </div>

              {/* Actual learning module */}
              <ModuleComponent moduleData={module} />
            </section>
          );
        })}
      </div>

      {/* =====================================================
          AI TUTOR
      ====================================================== */}
      <button
        onClick={() => setIsAiOpen(true)}
        aria-label="Open AI Biology Tutor"
        className="
          bio-ai-orb
          fixed bottom-8 right-8
          w-16 h-16
          bg-blue-600
          text-white
          rounded-2xl
          flex items-center justify-center
          border-2 border-blue-950
          shadow-[4px_4px_0px_#1e3a8a]
          hover:shadow-[6px_6px_0px_#1e3a8a]
          transition-shadow duration-300
          z-40
          group
        "
      >
        <span
          className="
            relative z-10
            text-3xl
            group-hover:rotate-90
            group-hover:scale-110
            transition-transform
            duration-500
            ease-out
          "
        >
          ✦
        </span>

        <span className="bio-ai-orb-ring" />
        <span className="bio-ai-orb-glow" />
      </button>

      <AiTutor
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentModule={hub.modules[0]}
      />
    </div>
  );
}
