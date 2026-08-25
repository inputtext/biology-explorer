import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const ORGANISMS = [
  { id: 'sun', name: 'Sunlight', type: 'source', icon: '☀️', feedsOn: [] },
  { id: 'plant', name: 'Wild Grass', type: 'producer', icon: '🌿', feedsOn: ['sun'] },
  { id: 'rabbit', name: 'Snowshoe Hare', type: 'primary', icon: '🐇', feedsOn: ['plant'] },
  { id: 'fox', name: 'Red Fox', type: 'secondary', icon: '🦊', feedsOn: ['rabbit'] },
  { id: 'hawk', name: 'Red-Tailed Hawk', type: 'apex', icon: '🦅', feedsOn: ['fox', 'rabbit'] },
];

export default function FoodWebWeaver({ moduleData }) {
  const [connections, setConnections] = useState([]);
  const [selectedOrganism, setSelectedOrganism] = useState(null);
  const [ecosystemHealth, setEcosystemHealth] = useState(0);
  const cardRef = useRef(null);

  // Handle organism selection and connection logic
  const handleSelect = (org) => {
    if (!selectedOrganism) {
      // Pick source organism
      setSelectedOrganism(org);
    } else if (selectedOrganism.id === org.id) {
      // Deselect if clicking the same organism
      setSelectedOrganism(null);
    } else {
      // Attempt connection from selectedOrganism to org
      const isValid = org.feedsOn.includes(selectedOrganism.id);

      const connectionExists = connections.some(
        c => c.from === selectedOrganism.id && c.to === org.id
      );

      if (isValid && !connectionExists) {
        const newConnections = [...connections, { from: selectedOrganism.id, to: org.id }];
        setConnections(newConnections);

        // Animate health bar increase
        const newHealth = Math.min(100, Math.round((newConnections.length / 4) * 100));
        setEcosystemHealth(newHealth);
      } else {
        // Shake animation for invalid connection
        gsap.to(cardRef.current, {
          x: [-6, 6, -4, 4, 0],
          duration: 0.4,
          ease: 'power2.inOut',
        });
      }
      setSelectedOrganism(null);
    }
  };

  const handleReset = () => {
    setConnections([]);
    setSelectedOrganism(null);
    setEcosystemHealth(0);
  };

  return (
    <div
      ref={cardRef}
      className="p-8 rounded-3xl border-2 border-emerald-900 dark:border-emerald-400 bg-[#D4F0E4] dark:bg-[#022c22] shadow-[6px_6px_0px_#064e3b] dark:shadow-[6px_6px_0px_#34d399] transition-colors duration-0 space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
            Interactive Ecosystem
          </span>
          <h3 className="text-2xl font-black text-emerald-950 dark:text-emerald-50 mt-1">
            {moduleData?.title || 'Food Web Weaver'}
          </h3>
          <p className="text-sm font-medium text-emerald-900/80 dark:text-emerald-200/80 mt-1 max-w-xl">
            {moduleData?.content || 'Click an energy source, then click the organism that consumes it to establish trophic flows.'}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-black rounded-xl bg-emerald-900 dark:bg-emerald-400 text-emerald-50 dark:text-emerald-950 hover:scale-105 transition-transform shadow-[2px_2px_0px_currentColor]"
        >
          Reset Web
        </button>
      </div>

      {/* Health Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-black text-emerald-950 dark:text-emerald-100">
          <span>Ecosystem Stability</span>
          <span>{ecosystemHealth}%</span>
        </div>
        <div className="h-4 w-full bg-emerald-950/10 dark:bg-emerald-950/50 rounded-full overflow-hidden border border-emerald-900/30 dark:border-emerald-400/30 p-0.5">
          <div
            className="h-full bg-emerald-600 dark:bg-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${ecosystemHealth}%` }}
          />
        </div>
      </div>

      {/* Organisms Interactive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {ORGANISMS.map((org) => {
          const isSelected = selectedOrganism?.id === org.id;
          const isConnected = connections.some(c => c.from === org.id || c.to === org.id);

          return (
            <button
              key={org.id}
              onClick={() => handleSelect(org)}
              // Grab zone class triggers open hand cursor
              className={`grab-zone p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 text-center ${
                isSelected
                  ? 'border-blue-600 bg-blue-100 dark:bg-blue-900/50 scale-105 shadow-[4px_4px_0px_#1e3a8a]'
                  : isConnected
                  ? 'border-emerald-700 dark:border-emerald-300 bg-white/60 dark:bg-emerald-900/40'
                  : 'border-emerald-900/40 dark:border-emerald-400/40 bg-white/40 dark:bg-emerald-950/40 hover:scale-102'
              }`}
            >
              <span className="text-4xl pointer-events-none select-none">{org.icon}</span>
              <span className="text-sm font-black text-emerald-950 dark:text-emerald-50 pointer-events-none">
                {org.name}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-300/70 pointer-events-none">
                {org.type}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Trophic Connections List */}
      <div className="p-4 rounded-xl bg-white/40 dark:bg-emerald-950/30 border border-emerald-900/20 dark:border-emerald-400/20">
        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-2">
          Established Energy Paths ({connections.length})
        </h4>
        {connections.length === 0 ? (
          <p className="text-xs font-semibold text-emerald-800/60 dark:text-emerald-300/60">
            No energy transfers connected yet. Click Sunlight to begin!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {connections.map((c, idx) => {
              const fromName = ORGANISMS.find(o => o.id === c.from)?.name;
              const toName = ORGANISMS.find(o => o.id === c.to)?.name;
              return (
                <span
                  key={idx}
                  className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-800 dark:bg-emerald-300 text-emerald-50 dark:text-emerald-950 shadow-[2px_2px_0px_currentColor]"
                >
                  {fromName} ➔ {toName}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
