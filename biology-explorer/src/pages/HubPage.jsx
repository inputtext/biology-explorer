import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import bioData from '../data/biologyData.json';
import FoodWebWeaver from '../components/FoodWebWeaver';
import EvolutionSimulator from '../components/EvolutionSimulator';
/* import EvolutionSimulator from '../components/EvolutionSimulator'; */
import PhotosynthesisEngine from '../components/PhotosynthesisEngine';
// All of your hard-earned modules
import OrganelleInspector from '../components/OrganelleInspector';
import MitosisStepper from '../components/MitosisStepper';
import DnaUnzipper from '../components/DnaUnzipper';
import TaxonomyTree from '../components/TaxonomyTree';
import LevelsOfOrganization from '../components/LevelsOfOrganization';
import IsItAlive from '../components/IsItAlive';
import CardiacPump from '../components/CardiacPump';
import QuizArena from '../components/QuizArena';
import AnimatedFlowchart from '../components/AnimatedFlowchart';
import MermaidFlowchart from '../components/MermaidFlowchart';
import SynapticTransmission from '../components/SynapticTransmission';
import BloodstreamVisualizer from '../components/BloodstreamVisualizer';
import PhagocytosisBattlefield from '../components/PhagocytosisBattlefield';
import CrisprEditor from '../components/CrisprEditor';
import AiTutor from '../components/AiTutor';

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
    tl.fromTo(headerRef.current,
      { y: 60, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power4.out' }
    );

    // 2. 3D Flip Cascade for every single module on the page
    if (modulesContainerRef.current && modulesContainerRef.current.children.length > 0) {
      tl.fromTo(modulesContainerRef.current.children,
        { y: 150, opacity: 0, rotationX: 25, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          transformPerspective: 1200
        },
        "-=0.6"
      );
    }
  }, [hubId]);

  if (!hub) return <div className="p-24 text-center font-black text-4xl dark:text-slate-50">Hub not found.</div>;

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto min-h-screen relative overflow-hidden transition-colors duration-0">

      {/* FIXED: Added dark:text-slate-300 for the back button */}
      <Link to="/" className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2 mb-8 relative z-10 text-slate-900 dark:text-slate-300">
        ← Back to Dashboard
      </Link>

      <header className="mb-16" ref={headerRef}>
        {/* FIXED: Added dark:text-slate-50 */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-slate-50 transition-colors duration-0">
          {hub.title}
        </h1>
        {/* FIXED: Added dark:text-slate-400 */}
        <p className="text-xl font-medium text-slate-600 dark:text-slate-400 transition-colors duration-0">
          {hub.description}
        </p>
      </header>

      <div className="space-y-16 pb-32 perspective-[2000px]" ref={modulesContainerRef}>
        {hub.modules.map(module => {
          if (module.type === 'interactive-svg') return <OrganelleInspector key={module.id} moduleData={module} />;
          if (module.type === 'timeline-stepper') return <MitosisStepper key={module.id} moduleData={module} />;
          if (module.type === 'scroll-reveal') return <DnaUnzipper key={module.id} moduleData={module} />;
          if (module.type === 'hierarchy-tree') return <TaxonomyTree key={module.id} moduleData={module} />;
          if (module.type === 'depth-zoom') return <LevelsOfOrganization key={module.id} moduleData={module} />;
          if (module.type === 'drag-drop-sorter') return <IsItAlive key={module.id} moduleData={module} />;
          if (module.type === 'interactive-slider') return <CardiacPump key={module.id} moduleData={module} />;
          if (module.type === 'gamified-quiz') return <QuizArena key={module.id} moduleData={module} />;
          if (module.type === 'animated-flowchart') return <AnimatedFlowchart key={module.id} moduleData={module} />;
          if (module.type === 'mermaid-diagram') return <MermaidFlowchart key={module.id} moduleData={module} />;
          if (module.type === 'interactive-synapse') return <SynapticTransmission key={module.id} moduleData={module} />;
          if (module.type === 'interactive-bloodstream') return <BloodstreamVisualizer key={module.id} moduleData={module} />;
          if (module.type === 'interactive-macrophage') return <PhagocytosisBattlefield key={module.id} moduleData={module} />;
          if (module.type === 'interactive-crispr') return <CrisprEditor key={module.id} moduleData={module} />;
          if (module.type === 'interactive-foodweb') return <FoodWebWeaver key={module.id} moduleData={module} />;
          if (module.type === 'natural-selection-sim') return <EvolutionSimulator key={module.id} moduleData={module} />;
          if (module.type === 'photosynthesis-engine') return <PhotosynthesisEngine key={module.id} moduleData={module} />;
         /*  if (module.type === 'natural-selection-sim') return <EvolutionSimulator key={module.id} moduleData={module} />; */
          if (module.type === 'natural-selection-sim') return <EvolutionSimulator key={module.id} moduleData={module} />;
          if (module.type === 'photosynthesis-engine') return <PhotosynthesisEngine key={module.id} moduleData={module} />;
          return null;
        })}
      </div>

      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#1e3a8a] hover:-translate-y-1 hover:shadow-[4px_6px_0px_#1e3a8a] transition-all z-40 group"
      >
        <span className="text-3xl group-hover:rotate-90 transition-transform duration-500 ease-out animate-pulse">✦</span>
      </button>

      <AiTutor isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} currentModule={hub.modules[0]} />
    </div>
  );
}
