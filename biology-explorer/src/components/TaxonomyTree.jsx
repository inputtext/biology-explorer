import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

// Recursive Child Node Component
const TreeNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const iconRef = useRef(null);
  const hasChildren = node.children && node.children.length > 0;

  useEffect(() => {
    if (!hasChildren) return;

    if (isExpanded) {
      gsap.to(contentRef.current, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.to(iconRef.current, { rotation: 90, duration: 0.3 });
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(iconRef.current, { rotation: 0, duration: 0.3 });
    }
  }, [isExpanded, hasChildren]);

  return (
    <div className="ml-6 mt-4 border-l-2 border-purple-900/30 pl-6 relative">
      {/* Node Button */}
      <button
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        className={`flex items-center gap-4 text-left w-full p-4 rounded-xl transition-all ${
          hasChildren
            ? 'bg-white border-2 border-purple-900 shadow-[2px_2px_0px_#581c87] hover:-translate-y-0.5 cursor-pointer'
            : 'bg-purple-900/10 border-2 border-transparent cursor-default'
        }`}
      >
        {hasChildren && (
          <span ref={iconRef} className="w-6 h-6 flex items-center justify-center bg-purple-900 text-white rounded-md text-xs shrink-0">
            ▶
          </span>
        )}
        <div>
          <h4 className={`font-black ${hasChildren ? 'text-purple-950 text-xl' : 'text-slate-800 text-lg'}`}>
            {node.name}
          </h4>
          {node.desc && <p className="text-sm font-medium text-slate-600 mt-1">{node.desc}</p>}
        </div>
      </button>

      {/* Children Container */}
      {hasChildren && (
        <div ref={contentRef} className="h-0 opacity-0 overflow-hidden">
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Export Component
export default function TaxonomyTree({ moduleData }) {
  return (
    <div className="bg-[#E8DFF5] border-2 border-purple-900 rounded-2xl p-8 shadow-[4px_4px_0px_#581c87] mt-12">
      <div className="mb-8">
        <h3 className="text-3xl font-black text-purple-950 mb-2">{moduleData.title}</h3>
        <p className="text-purple-900/80 font-medium">{moduleData.content}</p>
      </div>

      <div className="bg-white/50 p-6 rounded-xl border-2 border-purple-900/20">
        {/* Render the root node */}
        <TreeNode node={moduleData.tree} />
      </div>
    </div>
  );
}
