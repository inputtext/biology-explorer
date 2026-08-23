import { useParams, Link } from 'react-router-dom';
import bioData from '../data/biologyData.json';
import OrganelleInspector from '../components/OrganelleInspector';
import MitosisStepper from '../components/MitosisStepper'; // Added import here
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

export default function HubPage() {
  const { hubId } = useParams();
  const hub = bioData.hubs.find((h) => h.id === hubId);

  if (!hub) {
    return (
      <div className="pt-32 text-center min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Hub Data Not Found</h2>
        <Link to="/" className="text-blue-600 font-bold underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto min-h-screen">
      <Link to="/" className="text-sm font-bold uppercase tracking-wider mb-8 inline-block border-b-2 border-slate-900 hover:opacity-70 transition-opacity">
        ← Back to Dashboard
      </Link>

      <header className="mb-12">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
          {hub.title}
        </h1>
        <p className="text-xl font-medium text-slate-600 max-w-2xl">
          {hub.description}
        </p>
      </header>

      {/* Render Modules Dynamically */}
      <main className="space-y-12">
        {hub.modules.map((module) => {
          if (module.type === 'interactive-svg') {
            return <OrganelleInspector key={module.id} moduleData={module} />;
          }


          if (module.type === 'scroll-animation') {
            return <MitosisStepper key={module.id} moduleData={module} />;
          }

          if (module.type === 'interactive-timeline') {
            return <DnaUnzipper key={module.id} moduleData={module} />;
          }

          if (module.type === 'hierarchy-tree') {
            return <TaxonomyTree key={module.id} moduleData={module} />;
          }
          // Add this block for Chapter 1!
          if (module.type === 'depth-zoom') {
            return <LevelsOfOrganization key={module.id} moduleData={module} />;
          }
          // Add this drag-and-drop block
        if (module.type === 'drag-drop-sorter') {
         return <IsItAlive key={module.id} moduleData={module} />;
        }
        // Add this block for Phase 5!
          if (module.type === 'interactive-slider') {
            return <CardiacPump key={module.id} moduleData={module} />;
          }
          // Add this block for Phase 6!
          if (module.type === 'gamified-quiz') {
            return <QuizArena key={module.id} moduleData={module} />;
          }
          // Add this block for Phase 7 flowcharts!
       if (module.type === 'animated-flowchart') {
         return <AnimatedFlowchart key={module.id} moduleData={module} />;
       }
       // Add this block for Mermaid Flowcharts
       if (module.type === 'mermaid-diagram') {
         return <MermaidFlowchart key={module.id} moduleData={module} />;
       }
       // Add this block for the Synapse animation!
       if (module.type === 'interactive-synapse') {
         return <SynapticTransmission key={module.id} moduleData={module} />;
       }
       // Add this block for Phase 9!
       if (module.type === 'interactive-bloodstream') {
         return <BloodstreamVisualizer key={module.id} moduleData={module} />;
       }

          return null;
        })}
      </main>
    </div>
  );
}
