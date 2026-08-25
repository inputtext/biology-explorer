import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Configure the visual theme specifically for this cycle
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#E8DFF5',
    primaryBorderColor: '#581c87',
    primaryTextColor: '#3b0764',
    lineColor: '#581c87',
    fontFamily: 'inherit',
  }
});

// Hardcode the specific Krebs Cycle graph here so it never breaks!
const KREBS_CHART_DEF = `
graph TD
    AcetylCoA[Acetyl-CoA] -->|Enters Cycle| Citrate(Citrate)
    Citrate --> Isocitrate(Isocitrate)
    Isocitrate -->|Produces NADH & CO2| AlphaKG(Alpha-Ketoglutarate)
    AlphaKG -->|Produces NADH & CO2| SuccinylCoA(Succinyl-CoA)
    SuccinylCoA -->|Produces ATP| Succinate(Succinate)
    Succinate -->|Produces FADH2| Fumarate(Fumarate)
    Fumarate --> Malate(Malate)
    Malate -->|Produces NADH| Oxaloacetate(Oxaloacetate)
    Oxaloacetate -->|Binds with Acetyl-CoA| Citrate
`;

export default function KrebsCycle({ moduleData }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Generate a truly random ID every render to survive React's Strict Mode
      const uniqueId = `krebs-${Math.random().toString(36).substr(2, 9)}`;

      const renderChart = async () => {
        try {
          chartRef.current.innerHTML = '';
          const { svg } = await mermaid.render(uniqueId, KREBS_CHART_DEF);

          if (chartRef.current) {
            chartRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error("Mermaid syntax error:", error);
          if (chartRef.current) {
             chartRef.current.innerHTML = `<p class="text-red-500 font-bold">Chart rendering failed. Check console for syntax errors.</p>`;
          }
        }
      };

      renderChart();
    }
  }, []); // Empty dependency array means this only runs on mount

  return (
    <div className="bg-[#E8DFF5] dark:bg-[#3b0764] border-2 border-purple-900 dark:border-purple-400 rounded-3xl p-8 shadow-[6px_6px_0px_#581c87] dark:shadow-[6px_6px_0px_#c084fc] mt-12 transition-colors duration-0">

      <div className="text-center mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-purple-800 dark:text-purple-300">
          Metabolic Pathway
        </span>
        <h3 className="text-3xl font-black text-purple-950 dark:text-purple-50 mt-2 mb-2">
          {moduleData?.title || 'The Krebs Cycle'}
        </h3>
        <p className="text-purple-900/80 dark:text-purple-200/80 font-medium max-w-2xl mx-auto">
          {moduleData?.content || 'Follow the carbon atoms as they are oxidized to produce ATP, NADH, and FADH2 in the mitochondrial matrix.'}
        </p>
      </div>

      <div className="flex justify-center bg-white dark:bg-slate-900 p-8 rounded-xl border-2 border-purple-900/20 dark:border-purple-400/40 shadow-inner overflow-x-auto">
        <div ref={chartRef} className="mermaid-container flex justify-center w-full min-w-[600px] hover:scale-[1.02] transition-transform duration-300 cursor-crosshair" />
      </div>
    </div>
  );
}
