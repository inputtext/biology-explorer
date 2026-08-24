import { ReactLenis } from 'lenis/react';
import { Routes, Route, Link } from 'react-router-dom';
import bioData from './data/biologyData.json';
import HubPage from './pages/HubPage';
import CustomCursor from './components/CustomCursor';
import AmbientBackground from './components/AmbientBackground';

const colorMap = {
  mint: 'bg-[#D4F0E4] border-emerald-900 shadow-[4px_4px_0px_#064e3b] text-emerald-950',
  lilac: 'bg-[#E8DFF5] border-purple-900 shadow-[4px_4px_0px_#3b0764] text-purple-950',
  peach: 'bg-[#FCE1E4] border-rose-900 shadow-[4px_4px_0px_#881337] text-rose-950',
  yellow: 'bg-[#FCF4DD] border-amber-900 shadow-[4px_4px_0px_#78350f] text-amber-950',
};

const HomeDashboard = () => (
  <div className="pt-32 px-6 max-w-6xl mx-auto min-h-screen">
    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
      Learning Ecosystem
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {bioData.hubs.map((hub, index) => (
        <Link
          key={hub.id}
          to={`/hub/${hub.id}`}
          className={`block p-8 border-2 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_currentColor] cursor-pointer ${colorMap[hub.themeColor] || colorMap.mint}`}
        >
          <span className="text-xs font-black uppercase tracking-widest opacity-70 block mb-2">
            Phase {index + 1}
          </span>
          <h2 className="text-2xl font-bold mb-2">{hub.title}</h2>
          <p className="font-medium opacity-80">{hub.description}</p>
        </Link>
      ))}
    </div>
  </div>
);

export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08 }}>
      {/* ADDED: cursor-none right here on the main wrapper */}
      <div className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans pb-24 cursor-none">

        {/* ADDED: The Background and Cursor components */}
        <CustomCursor />
        <AmbientBackground />

        <nav className="fixed top-0 w-full bg-[#FAF9F6]/80 backdrop-blur-md border-b-2 border-slate-900 z-50 px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-black tracking-tighter">BioExplorer.</Link>
            <div className="space-x-6 text-sm font-bold">
              <Link to="/" className="hover:opacity-70 transition-opacity">Dashboard</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/hub/:hubId" element={<HubPage />} />
        </Routes>
      </div>
    </ReactLenis>
  );
}
