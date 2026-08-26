import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import bioData from '../data/biologyData.json';
import AiTutor from '../components/AiTutor';
import { getModuleComponent } from '../config/moduleRegistry';

export default function HubPage() {
  const { hubId } = useParams();
  const [isAiOpen, setIsAiOpen] = useState(false);

  const headerRef = useRef(null);
  const modulesContainerRef = useRef(null);

  const hub = bioData.hubs.find(h => h.id === hubId);

  useEffect(() => {
    if (!hub) return;

    const tl = gsap.timeline();

    // 1. Cinematic wipe-up for the Header
    tl.fromTo(
      headerRef.current,
      { y: 60, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      {
        y: 0,
        opacity: 1,
        clipPath: 'inset(0% 0 0 0)',
        duration: 1,
        ease: 'power4.out',
      }
    );

    // 2. 3D Flip Cascade for every module
    if (
      modulesContainerRef.current &&
      modulesContainerRef.current.children.length > 0
    ) {
      tl.fromTo(
        modulesContainerRef.current.children,
        { y: 150, opacity: 0, rotationX: 25, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          transformPerspective: 1200,
        },
        '-=0.6'
      );
    }

    return () => {
      tl.kill();
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
      <Link
        to="/"
        className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2 mb-8 relative z-10 text-slate-900 dark:text-slate-300"
      >
        ← Back to Dashboard
      </Link>

      <header className="mb-16" ref={headerRef}>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-slate-50 transition-colors duration-0">
          {hub.title}
        </h1>

        <p className="text-xl font-medium text-slate-600 dark:text-slate-400 transition-colors duration-0">
          {hub.description}
        </p>
      </header>

      <div
        className="space-y-16 pb-32 perspective-[2000px]"
        ref={modulesContainerRef}
      >
        {hub.modules.map(module => {
          const ModuleComponent = getModuleComponent(module.type);

          if (!ModuleComponent) {
            console.warn(
              `Unknown Biology Explorer module type: ${module.type}`
            );
            return null;
          }

          return (
            <ModuleComponent
              key={module.id}
              moduleData={module}
            />
          );
        })}
      </div>

      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#1e3a8a] hover:-translate-y-1 hover:shadow-[4px_6px_0px_#1e3a8a] transition-all z-40 group"
      >
        <span className="text-3xl group-hover:rotate-90 transition-transform duration-500 ease-out animate-pulse">
          ✦
        </span>
      </button>

      <AiTutor
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentModule={hub.modules[0]}
      />
    </div>
  );
}
