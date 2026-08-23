import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function OrganelleInspector({ moduleData }) {
  const [activeItem, setActiveItem] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (activeItem) {
      gsap.fromTo(panelRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeItem]);

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl p-8 shadow-[4px_4px_0px_#1e293b] mt-8">
      <h3 className="text-2xl font-black mb-2">{moduleData.title}</h3>
      <p className="text-slate-600 font-medium mb-6">{moduleData.content}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Interactive "Cell" Area */}
        <div className="bg-[#E8DFF5] border-2 border-slate-900 rounded-xl p-6 flex flex-col gap-3 justify-center">
          <p className="text-sm font-bold uppercase text-center mb-2 text-slate-800">Select an Organelle</p>
          {moduleData.dataPoints.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveItem(item)}
              className="bg-white border-2 border-slate-900 py-3 px-4 rounded-lg font-bold shadow-[2px_2px_0px_#1e293b] hover:-translate-y-1 transition-transform text-left flex justify-between items-center"
            >
              {item.name}
              <span className="text-xl leading-none">→</span>
            </button>
          ))}
        </div>

        {/* Data Display Panel */}
        <div className="bg-[#D4F0E4] border-2 border-slate-900 rounded-xl p-6 flex flex-col justify-center min-h-[200px]">
          {activeItem ? (
            <div ref={panelRef}>
              <h4 className="text-3xl font-black text-slate-900 mb-4">{activeItem.name}</h4>
              <p className="text-lg font-medium text-slate-800">{activeItem.function}</p>
            </div>
          ) : (
            <p className="text-slate-600 font-medium text-center italic">
              Awaiting selection...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
