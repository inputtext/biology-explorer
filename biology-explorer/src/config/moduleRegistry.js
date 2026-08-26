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
import FoodWebWeaver from '../components/FoodWebWeaver';
import EvolutionSimulator from '../components/EvolutionSimulator';
import PhotosynthesisEngine from '../components/PhotosynthesisEngine';
import KrebsCycle from '../components/KrebsCycle';
import ScientificMethodLab from '../components/ScientificMethodLab';

export const moduleRegistry = {
  'interactive-svg': OrganelleInspector,
  'timeline-stepper': MitosisStepper,
  'scroll-animation': MitosisStepper,
  'interactive-timeline': DnaUnzipper,
  'hierarchy-tree': TaxonomyTree,
  'depth-zoom': LevelsOfOrganization,
  'drag-drop-sorter': IsItAlive,
  'interactive-slider': CardiacPump,
  'gamified-quiz': QuizArena,
  'animated-flowchart': AnimatedFlowchart,
  'mermaid-diagram': MermaidFlowchart,
  'interactive-synapse': SynapticTransmission,
  'interactive-bloodstream': BloodstreamVisualizer,
  'interactive-macrophage': PhagocytosisBattlefield,
  'interactive-crispr': CrisprEditor,
  'interactive-foodweb': FoodWebWeaver,
  'natural-selection-sim': EvolutionSimulator,
  'photosynthesis-engine': PhotosynthesisEngine,
  'krebs-cycle': KrebsCycle,
  'scientific-method-lab': ScientificMethodLab,
};

export function getModuleComponent(type) {
  return moduleRegistry[type] || null;
}
