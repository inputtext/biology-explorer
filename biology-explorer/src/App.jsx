import { ReactLenis } from 'lenis/react';
import { Routes, Route, Link } from 'react-router-dom';

import bioData from './data/biologyData.json';

import HubPage from './pages/HubPage';

import CustomCursor from './components/CustomCursor';
import AmbientBackground from './components/AmbientBackground';
import CinematicDarkToggle from './components/CinematicDarkToggle';
import CommandPalette from './components/CommandPalette';
import PageTransition from './components/PageTransition';
import LearningMap from './components/LearningMap';
import Magnetic from './components/Magnetic';

// =========================================================
// HUB COLOR SYSTEM
// =========================================================

const colorMap = {
  mint:
    'bg-[#D4F0E4] dark:bg-[#022c22] border-emerald-900 dark:border-emerald-400 shadow-[4px_4px_0px_#064e3b] dark:shadow-[4px_4px_0px_#34d399] text-emerald-950 dark:text-emerald-50',

  lilac:
    'bg-[#E8DFF5] dark:bg-[#2e1065] border-purple-900 dark:border-purple-400 shadow-[4px_4px_0px_#3b0764] dark:shadow-[4px_4px_0px_#c084fc] text-purple-950 dark:text-purple-50',

  peach:
    'bg-[#FCE1E4] dark:bg-[#4c0519] border-rose-900 dark:border-rose-400 shadow-[4px_4px_0px_#881337] dark:shadow-[4px_4px_0px_#fb7185] text-rose-950 dark:text-rose-50',

  yellow:
    'bg-[#FCF4DD] dark:bg-[#451a03] border-amber-900 dark:border-amber-400 shadow-[4px_4px_0px_#78350f] dark:shadow-[4px_4px_0px_#fbbf24] text-amber-950 dark:text-amber-50',
};

// =========================================================
// HOME DASHBOARD
// =========================================================

const HomeDashboard = () => {
  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto min-h-screen">

      {/* Dashboard Heading */}
      <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-slate-900 dark:text-white transition-colors duration-0">
        Learning Ecosystem
      </h1>

      {/* Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {bioData.hubs.map((hub, index) => (
          <Magnetic
            key={hub.id}
            strength={0.12}
            radius={140}
          >
            <Link
              to={`/hub/${hub.id}`}
              className={`bio-hover block p-8 border-2 rounded-2xl transition-all hover:shadow-[6px_6px_0px_currentColor] ${
                colorMap[hub.themeColor] || colorMap.mint
              }`}
            >
              <span className="text-xs font-black uppercase tracking-widest opacity-70 block mb-2">
                Phase {index + 1}
              </span>

              <h2 className="text-2xl font-bold mb-2">
                {hub.title}
              </h2>

              <p className="font-medium opacity-80">
                {hub.description}
              </p>
            </Link>
          </Magnetic>
        ))}

      </div>

      {/* Learning Map */}
      <LearningMap />

    </div>
  );
};

// =========================================================
// APPLICATION
// =========================================================

export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08 }}>

      <div className="min-h-screen bg-[#FAF9F6] dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans pb-24 transition-colors duration-0">

        {/* Global UX */}
        <CustomCursor />
        <AmbientBackground />
        <CinematicDarkToggle />
        <CommandPalette />

        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-[#FAF9F6]/80 dark:bg-slate-900/80 backdrop-blur-md border-b-2 border-slate-900 dark:border-slate-700 z-50 px-6 py-4 transition-colors duration-0">

          <div className="max-w-6xl mx-auto flex justify-between items-center">

            <Link
              to="/"
              className="text-xl font-black tracking-tighter"
            >
              BioExplorer.com
            </Link>

            <div className="space-x-6 text-sm font-bold">

              <Link
                to="/"
                className="hover:opacity-70 transition-opacity"
              >
                Dashboard
              </Link>

            </div>

          </div>

        </nav>

        {/* Page Transitions */}
        <PageTransition>

          <Routes>

            <Route
              path="/"
              element={<HomeDashboard />}
            />

            <Route
              path="/hub/:hubId"
              element={<HubPage />}
            />

          </Routes>

        </PageTransition>

      </div>

    </ReactLenis>
  );
}
