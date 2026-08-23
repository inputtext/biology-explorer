import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Configure the visual theme of the flowcharts to match our UI
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
      // We generate a unique ID so Mermaid doesn't get confused if multiple charts are on one page
      const uniqueId = `mermaid-${moduleData.id.replace(/[^a-zA-Z0-9]/g, '')}`;

      mermaid.render(uniqueId, moduleData.chartDef).then((result) => {
        chartRef.current.innerHTML = result.svg;
      }).catch((error) => {
        console.error("Mermaid syntax error:", error);
      });
    }
  }, [moduleData.chartDef, moduleData.id]);

  return (
    <div className="bg-[#E8DFF5] border-2 border-purple-900 rounded-2xl p-8 shadow-[4px_4px_0px_#581c87] mt-12">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black text-purple-950 mb-2">{moduleData.title}</h3>
        <p className="text-purple-900/80 font-medium">{moduleData.content}</p>
      </div>

      <div className="flex justify-center bg-white p-8 rounded-xl border-2 border-purple-900/20 shadow-inner overflow-x-auto">
        {/* The SVG will be injected right here */}
        <div ref={chartRef} className="mermaid-container flex justify-center w-full min-w-[600px]" />
      </div>
    </div>
  );
}
