import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export default function IsItAlive({ moduleData }) {
  const containerRef = useRef(null);
  const [feedback, setFeedback] = useState("Drag an item into a zone to test it.");
  const [completedItems, setCompletedItems] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      Draggable.create(".draggable-item", {
        type: "x,y",
        bounds: containerRef.current,
        edgeResistance: 0.65,
        onRelease: function () {
          const itemElement = this.target;
          const itemId = itemElement.dataset.id;
          const isAlive = itemElement.dataset.isalive === "true";
          const itemData = moduleData.items.find(i => i.id === itemId);

          // Check if dropped in Living Zone
          if (this.hitTest("#living-zone", "50%")) {
            handleDrop(itemElement, itemData, isAlive, true);
          }
          // Check if dropped in Non-Living Zone
          else if (this.hitTest("#non-living-zone", "50%")) {
            handleDrop(itemElement, itemData, isAlive, false);
          }
          // Dropped nowhere, snap back
          else {
            gsap.to(itemElement, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [moduleData]);

  const handleDrop = (element, itemData, actualIsAlive, droppedZone) => {
    if (actualIsAlive === droppedZone) {
      // Correct Match!
      setFeedback(itemData.reason);
      setCompletedItems(prev => prev + 1);

      // Suck the item into the box
      gsap.to(element, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "back.in(1.5)",
        onComplete: () => element.style.display = 'none'
      });
    } else {
      // Wrong Match - Error Shake
      setFeedback(`Oops! Think about the 7 characteristics of life for the ${itemData.name}.`);
      gsap.fromTo(element,
        { x: "+=15" },
        { x: "-=15", yoyo: true, repeat: 5, duration: 0.05, onComplete: () => {
          gsap.to(element, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
        }}
      );
    }
  };

  return (
    <div className="bg-[#FCF4DD] border-2 border-amber-900 rounded-2xl p-8 shadow-[4px_4px_0px_#78350f] mt-12" ref={containerRef}>
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black text-amber-950 mb-2">{moduleData.title}</h3>
        <p className="text-amber-900/80 font-medium">{moduleData.content}</p>
      </div>

      {/* Feedback Banner */}
      <div className="bg-white border-2 border-amber-900 p-4 rounded-xl text-center font-bold text-amber-950 shadow-inner mb-8 min-h-[80px] flex items-center justify-center">
        {completedItems === moduleData.items.length ? "🎉 Incredible! You've mastered the 7 characteristics of life!" : feedback}
      </div>

      {/* Drop Zones */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div id="living-zone" className="bg-[#D4F0E4] border-4 border-dashed border-emerald-700 h-48 rounded-2xl flex items-center justify-center text-emerald-950 font-black text-2xl opacity-80 transition-opacity hover:opacity-100">
          LIVING ZONE
        </div>
        <div id="non-living-zone" className="bg-[#E8DFF5] border-4 border-dashed border-purple-700 h-48 rounded-2xl flex items-center justify-center text-purple-950 font-black text-2xl opacity-80 transition-opacity hover:opacity-100">
          NON-LIVING ZONE
        </div>
      </div>

      {/* Draggable Items */}
      <div className="flex flex-wrap justify-center gap-4 relative z-10">
        {moduleData.items.map(item => (
          <div
            key={item.id}
            data-id={item.id}
            data-isalive={item.isAlive}
            className="draggable-item px-6 py-3 bg-white border-2 border-slate-900 rounded-xl font-black cursor-grab active:cursor-grabbing shadow-[2px_2px_0px_#1e293b] hover:-translate-y-1 transition-transform touch-none"
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
