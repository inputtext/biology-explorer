import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import bioData from '../data/biologyData.json';
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
import AiTutor from '../components/AiTutor'; // <-- NEW IMPORT

export default function HubPage() {
  const { hubId } = useParams();
  const [isAiOpen, setIsAiOpen] = useState(false); // <-- NEW STATE

  const hub = bioData.hubs.find(h => h.id === hubId);

  if (!hub) return <div className="p-24 text-center font-black text-4xl">Hub not found.</div>;

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto min-h-screen relative">
      <Link to="/" className="text-sm font-bold opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2 mb-8">
        ← Back to Dashboard
      </Link>

      <header className="mb-16">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">{hub.title}</h1>
        <p className="text-xl font-medium opacity-80">{hub.description}</p>
      </header>

      <div className="space-y-16 pb-32">
        {hub.modules.map(module => {
          if (module.type === 'interactive-svg') {
            return <OrganelleInspector key={module.id} moduleData={module} />;
          }
          if (module.type === 'timeline-stepper') {
            return <MitosisStepper key={module.id} moduleData={module} />;
          }
          if (module.type === 'scroll-reveal') {
            return <DnaUnzipper key={module.id} moduleData={module} />;
          }
          if (module.type === 'hierarchy-tree') {
            return <TaxonomyTree key={module.id} moduleData={module} />;
          }
          if (module.type === 'depth-zoom') {
            return <LevelsOfOrganization key={module.id} moduleData={module} />;
          }
          if (module.type === 'drag-drop-sorter') {
            return <IsItAlive key={module.id} moduleData={module} />;
          }
          if (module.type === 'interactive-slider') {
            return <CardiacPump key={module.id} moduleData={module} />;
          }
          if (module.type === 'gamified-quiz') {
            return <QuizArena key={module.id} moduleData={module} />;
          }
          if (module.type === 'animated-flowchart') {
            return <AnimatedFlowchart key={module.id} moduleData={module} />;
          }
          if (module.type === 'mermaid-diagram') {
            return <MermaidFlowchart key={module.id} moduleData={module} />;
          }
          if (module.type === 'interactive-synapse') {
            return <SynapticTransmission key={module.id} moduleData={module} />;
          }
          if (module.type === 'interactive-bloodstream') {
            return <BloodstreamVisualizer key={module.id} moduleData={module} />;
          }
          if (module.type === 'interactive-macrophage') {
            return <PhagocytosisBattlefield key={module.id} moduleData={module} />;
          }
          if (module.type === 'interactive-crispr') {
            return <CrisprEditor key={module.id} moduleData={module} />;
          }
          return null;
        })}
      </div>

      {/* NEW: Floating Action Button */}
{/* Enhanced Floating Action Button */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-blue-400 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#1e3a8a] hover:-translate-y-2 hover:shadow-[4px_8px_0px_#1e3a8a] transition-all z-40 group border-2 border-blue-900"
      >
        <span className="text-3xl group-hover:rotate-90 transition-transform duration-500 ease-out animate-pulse">✦</span>
        {/* Subtle glowing ring behind the icon */}
        <span className="absolute inset-0 rounded-2xl bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity"></span>
      </button>

      {/* NEW: The AI Drawer Component */}
      {/* We pass the FIRST module of the hub as the context for now, so it knows what page it is on */}
      <AiTutor
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentModule={hub.modules[0]}
      />
    </div>
  );
}
