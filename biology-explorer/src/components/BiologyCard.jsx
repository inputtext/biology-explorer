import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function BiologyCard({ title, tag, color, description, chartDef, colSpan = "col-span-1" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('diagram');
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  // GSAP Expand/Collapse Animation
  useEffect(() => {
    if (isOpen) {
      gsap.to(contentRef.current, { height: 'auto', opacity: 1, duration: 0.5, ease: 'back.out(1.2)' });
      gsap.to(iconRef.current, { rotate: 45, duration: 0.3 });
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut' });
      gsap.to(iconRef.current, { rotate: 0, duration: 0.3 });
    }
  }, [isOpen]);

  // Dynamic color classes based on props
  const colorMap = {
    mint: 'bg-[#D4F0E4] border-emerald-900 text-emerald-950',
    lilac: 'bg-[#E8DFF5] border-purple-900 text-purple-950',
    peach: 'bg-[#FCE1E4] border-rose-900 text-rose-950',
    yellow: 'bg-[#FCF4DD] border-amber-900 text-amber-950',
  };

  return (
    <div
      ref={cardRef}
      className={`${colSpan} ${colorMap[color] || colorMap.mint} border-2 rounded-2xl p-6 shadow-[4px_4px_0px_#1e293b] hover:shadow-[6px_6px_0px_#1e293b] hover:-translate-y-1 transition-all duration-200 cursor-pointer h-fit`}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start" onClick={() => setIsOpen(!isOpen)}>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-white/80 border border-current rounded-full inline-block mb-3">
            {tag}
          </span>
          <h2 className="text-2xl font-black leading-tight">{title}</h2>
        </div>
        <button
          ref={iconRef}
          className="w-10 h-10 rounded-full bg-white border-2 border-current flex items-center justify-center text-xl font-bold shrink-0 ml-4"
        >
          +
        </button>
      </div>

      <p className="mt-3 text-sm font-medium opacity-80">{description}</p>

      {/* Expandable Section */}
      <div ref={contentRef} className="h-0 opacity-0 overflow-hidden">
        {/* Navigation Tabs inside expanded card */}
        <div className="flex gap-2 mt-6 mb-4 border-b-2 border-current/20 pb-2">
          <button
            onClick={(e) => { e.stopPropagation(); setActiveTab('diagram'); }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${activeTab === 'diagram' ? 'bg-slate-900 text-white' : 'bg-white/60'}`}
          >
            Diagram View
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveTab('summary'); }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${activeTab === 'summary' ? 'bg-slate-900 text-white' : 'bg-white/60'}`}
          >
            Key Notes
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'diagram' ? (
          <div className="bg-white p-4 rounded-xl border-2 border-slate-900 text-slate-800 text-sm overflow-x-auto">
            <pre className="font-mono text-xs">{chartDef}</pre>
          </div>
        ) : (
          <div className="bg-white/80 p-4 rounded-xl border-2 border-slate-900 text-slate-800 text-sm">
            <ul className="list-disc pl-5 space-y-2 font-medium">
              <li>Organisms are categorized into distinct kingdoms based on cellular makeup.</li>
              <li>Prokaryotes lack a membrane-bound nucleus (e.g., Monera).</li>
              <li>Eukaryotes contain complex cellular structures with distinct nuclei.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
