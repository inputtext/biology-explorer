import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Configure the visual theme
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

export default function MermaidFlowchart({ moduleData }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && moduleData.chartDef) {

      // FIX: Generate a truly random ID every render to survive React's Strict Mode double-firing
      const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

      const renderChart = async () => {
        try {
          // Clear any previous failed renders
          chartRef.current.innerHTML = '';

          // Await the new async render method
          const { svg } = await mermaid.render(uniqueId, moduleData.chartDef);

          // Inject the successful SVG into the DOM
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
  }, [moduleData.chartDef]);

  return (
    <div className="bg-[#E8DFF5] border-2 border-purple-900 rounded-2xl p-8 shadow-[4px_4px_0px_#581c87] mt-12">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black text-purple-950 mb-2">{moduleData.title}</h3>
        <p className="text-purple-900/80 font-medium">{moduleData.content}</p>
      </div>

      <div className="flex justify-center bg-white p-8 rounded-xl border-2 border-purple-900/20 shadow-inner overflow-x-auto">
        <div ref={chartRef} className="mermaid-container flex justify-center w-full min-w-[600px]" />
      </div>
    </div>
  );
}
