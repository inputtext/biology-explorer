import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

const MODES = {
  diffusion: {
    title: 'Diffusion',
    subtitle: 'Particles move from higher concentration to lower concentration.',
    icon: '🧪',
  },
  osmosis: {
    title: 'Osmosis',
    subtitle: 'Water moves across a selectively permeable membrane toward higher solute concentration.',
    icon: '💧',
  },
};

const PARTICLE_COUNT = 14;

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: index,
    side: index % 2 === 0 ? 'left' : 'right',
    x: index % 2 === 0
      ? 12 + Math.random() * 28
      : 60 + Math.random() * 28,
    y: 12 + Math.random() * 76,
  }));
}

export default function DiffusionOsmosisLab({ moduleData }) {
  const [mode, setMode] = useState('diffusion');

  const [leftConcentration, setLeftConcentration] = useState(25);
  const [rightConcentration, setRightConcentration] = useState(75);

  const [permeability, setPermeability] = useState(70);
  const [temperature, setTemperature] = useState(24);

  const [particles, setParticles] = useState(createParticles);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const [prediction, setPrediction] = useState(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);

  const membraneRef = useRef(null);
  const particleContainerRef = useRef(null);

  const settings = MODES[mode];

  const concentrationDifference = Math.abs(
    rightConcentration - leftConcentration
  );

  const gradientDirection =
    leftConcentration < rightConcentration
      ? 'left → right'
      : leftConcentration > rightConcentration
        ? 'right → left'
        : 'balanced';

  const movementRate = useMemo(() => {
    const gradientFactor = concentrationDifference / 100;
    const permeabilityFactor = permeability / 100;
    const temperatureFactor = Math.max(0.25, temperature / 24);

    return Math.min(
      100,
      Math.round(
        gradientFactor * permeabilityFactor * temperatureFactor * 100
      )
    );
  }, [concentrationDifference, permeability, temperature]);

  const cellState = useMemo(() => {
    if (mode !== 'osmosis') return null;

    if (concentrationDifference < 10) {
      return {
        label: 'Isotonic',
        result: 'Cell remains relatively stable.',
        icon: '⚪',
      };
    }

    if (rightConcentration > leftConcentration) {
      return {
        label: 'Hypertonic outside',
        result: 'Water tends to leave the cell, causing it to shrink.',
        icon: '🔴',
      };
    }

    return {
      label: 'Hypotonic outside',
      result: 'Water tends to enter the cell, causing it to swell.',
      icon: '🟢',
    };
  }, [mode, leftConcentration, rightConcentration, concentrationDifference]);

  useEffect(() => {
    if (!particleContainerRef.current) return;

    gsap.fromTo(
      particleContainerRef.current.children,
      {
        opacity: 0,
        scale: 0.4,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        stagger: 0.04,
        ease: 'back.out(1.8)',
      }
    );
  }, [mode]);

  const animateMembrane = () => {
    if (!membraneRef.current) return;

    gsap.fromTo(
      membraneRef.current,
      {
        scaleX: 0.92,
      },
      {
        scaleX: 1,
        duration: 0.45,
        repeat: 3,
        yoyo: true,
        ease: 'sine.inOut',
      }
    );
  };

  const runSimulation = () => {
    setSimulationRunning(true);
    setSimulationComplete(false);
    setParticles(createParticles());

    animateMembrane();

    if (particleContainerRef.current) {
      gsap.fromTo(
        particleContainerRef.current,
        {
          scale: 0.96,
          opacity: 0.6,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.5)',
        }
      );
    }

    setTimeout(() => {
      setSimulationRunning(false);
      setSimulationComplete(true);
    }, 1200);
  };

  const resetSimulation = () => {
    setParticles(createParticles());
    setSimulationRunning(false);
    setSimulationComplete(false);
    setPrediction(null);
    setPredictionSubmitted(false);
  };

  const submitPrediction = (choice) => {
    setPrediction(choice);
    setPredictionSubmitted(true);
  };

  const getPredictionCorrect = () => {
    if (!prediction) return false;

    if (mode === 'diffusion') {
      return prediction === gradientDirection;
    }

    if (!cellState) return false;

    if (cellState.label === 'Isotonic') {
      return prediction === 'stable';
    }

    if (cellState.label === 'Hypertonic outside') {
      return prediction === 'shrink';
    }

    return prediction === 'swell';
  };

  const predictionOptions =
    mode === 'diffusion'
      ? [
          { id: 'left → right', label: 'Particles move left → right' },
          { id: 'right → left', label: 'Particles move right → left' },
          { id: 'balanced', label: 'No net movement' },
        ]
      : [
          { id: 'swell', label: 'Cell swells' },
          { id: 'shrink', label: 'Cell shrinks' },
          { id: 'stable', label: 'Cell stays stable' },
        ];

  return (
    <div className="mt-12 overflow-hidden rounded-3xl border-2 border-sky-950 bg-[#DDF4FA] p-6 shadow-[6px_6px_0px_#082f49] md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
            Virtual Biology Lab
          </span>

          <h3 className="mt-1 text-3xl font-black text-sky-950 md:text-4xl">
            {moduleData?.title || 'Diffusion & Osmosis Lab'}
          </h3>

          <p className="mt-2 max-w-2xl font-medium leading-relaxed text-sky-950/70">
            {moduleData?.content ||
              'Explore how concentration gradients drive molecular movement across membranes.'}
          </p>
        </div>

        <div className="rounded-xl border-2 border-sky-950 bg-white px-4 py-3 text-right">
          <div className="text-xs font-black uppercase tracking-widest text-sky-600">
            Mode
          </div>

          <div className="text-xl font-black text-sky-950">
            {settings.icon} {settings.title}
          </div>
        </div>
      </div>

      {/* Mode selector */}
      <div className="mb-8 grid gap-3 md:grid-cols-2">
        {Object.entries(MODES).map(([id, item]) => {
          const active = mode === id;

          return (
            <button
              key={id}
              onClick={() => {
                setMode(id);
                resetSimulation();
              }}
              className={`rounded-2xl border-2 p-5 text-left transition-all ${
                active
                  ? 'border-sky-950 bg-sky-950 text-white shadow-[3px_3px_0px_#0369a1]'
                  : 'border-sky-900/20 bg-white text-sky-950 hover:border-sky-700 hover:bg-sky-50'
              }`}
            >
              <div className="text-3xl">{item.icon}</div>

              <div className="mt-2 text-xl font-black">
                {item.title}
              </div>

              <div
                className={`mt-1 text-sm font-medium ${
                  active ? 'text-sky-100' : 'text-sky-950/60'
                }`}
              >
                {item.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Simulation */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border-2 border-sky-950 bg-[#F7FDFF] p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-sky-600">
                Live simulation
              </span>

              <h4 className="text-2xl font-black text-sky-950">
                Concentration chamber
              </h4>
            </div>

            <div className="rounded-lg bg-sky-100 px-3 py-2 text-xs font-black text-sky-900">
              Gradient: {gradientDirection}
            </div>
          </div>

          <div className="relative h-[390px] overflow-hidden rounded-2xl border-2 border-sky-950 bg-sky-50">
            {/* Left chamber */}
            <div className="absolute inset-y-0 left-0 w-1/2 border-r border-dashed border-sky-300 bg-sky-100/50">
              <div className="absolute left-4 top-4 rounded-lg bg-white/80 px-3 py-2 text-xs font-black text-sky-900">
                LOW / LEFT
              </div>

              <div className="absolute bottom-4 left-4 rounded-lg bg-white/80 px-3 py-2 text-xs font-black text-sky-900">
                {leftConcentration}% concentration
              </div>
            </div>

            {/* Right chamber */}
            <div className="absolute inset-y-0 right-0 w-1/2 bg-sky-50">
              <div className="absolute right-4 top-4 rounded-lg bg-white/80 px-3 py-2 text-xs font-black text-sky-900">
                HIGH / RIGHT
              </div>

              <div className="absolute bottom-4 right-4 rounded-lg bg-white/80 px-3 py-2 text-xs font-black text-sky-900">
                {rightConcentration}% concentration
              </div>
            </div>

            {/* Membrane */}
            <div
              ref={membraneRef}
              className="absolute left-1/2 top-0 h-full w-3 -translate-x-1/2 border-x-2 border-sky-950 bg-white/80"
            >
              <div className="flex h-full flex-col items-center justify-center gap-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-3 w-3 rounded-full border border-sky-800 bg-sky-200"
                  />
                ))}
              </div>
            </div>

            {/* Particles */}
            <div
              ref={particleContainerRef}
              className="absolute inset-0"
            >
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className={`absolute flex h-7 w-7 items-center justify-center rounded-full border-2 border-sky-950 text-xs font-black shadow-sm ${
                    mode === 'osmosis'
                      ? 'bg-white text-sky-900'
                      : 'bg-sky-400 text-sky-950'
                  }`}
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                  }}
                >
                  {mode === 'osmosis' ? '💧' : '•'}
                </div>
              ))}
            </div>

            {/* Center label */}
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky-950 bg-white px-4 py-2 text-xs font-black text-sky-950 shadow-sm">
              SEMIPERMEABLE
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-bold text-sky-950/60">
              Movement rate: {movementRate}%
            </div>

            <button
              onClick={runSimulation}
              disabled={simulationRunning}
              className="rounded-xl border-2 border-sky-950 bg-sky-950 px-6 py-3 font-black text-white shadow-[3px_3px_0px_#0369a1] transition-all hover:-translate-y-1 disabled:cursor-wait disabled:opacity-60"
            >
              {simulationRunning ? '⏳ SIMULATING...' : '▶ RUN SIMULATION'}
            </button>
          </div>

          {simulationComplete && (
            <div className="mt-5 rounded-xl border-2 border-sky-900 bg-sky-100 p-5">
              <div className="font-black text-sky-950">
                Simulation complete
              </div>

              <p className="mt-1 text-sm font-medium text-sky-950/70">
                The concentration gradient is driving net molecular movement{' '}
                {gradientDirection === 'balanced'
                  ? 'in neither direction.'
                  : `${gradientDirection}.`}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <div className="rounded-2xl border-2 border-sky-950 bg-white p-5">
            <div className="mb-5">
              <span className="text-xs font-black uppercase tracking-widest text-sky-600">
                Experimental controls
              </span>

              <h4 className="mt-1 text-2xl font-black text-sky-950">
                Change the environment
              </h4>
            </div>

            <div className="space-y-6">
              <label className="block">
                <div className="mb-2 flex justify-between font-black text-sky-950">
                  <span>Left concentration</span>
                  <span>{leftConcentration}%</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={leftConcentration}
                  onChange={(event) =>
                    setLeftConcentration(Number(event.target.value))
                  }
                  className="w-full accent-sky-700"
                />
              </label>

              <label className="block">
                <div className="mb-2 flex justify-between font-black text-sky-950">
                  <span>Right concentration</span>
                  <span>{rightConcentration}%</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rightConcentration}
                  onChange={(event) =>
                    setRightConcentration(Number(event.target.value))
                  }
                  className="w-full accent-sky-700"
                />
              </label>

              <label className="block">
                <div className="mb-2 flex justify-between font-black text-sky-950">
                  <span>Membrane permeability</span>
                  <span>{permeability}%</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={permeability}
                  onChange={(event) =>
                    setPermeability(Number(event.target.value))
                  }
                  className="w-full accent-sky-700"
                />
              </label>

              <label className="block">
                <div className="mb-2 flex justify-between font-black text-sky-950">
                  <span>Temperature</span>
                  <span>{temperature}°C</span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="40"
                  value={temperature}
                  onChange={(event) =>
                    setTemperature(Number(event.target.value))
                  }
                  className="w-full accent-sky-700"
                />
              </label>
            </div>
          </div>

          {/* Prediction */}
          <div className="rounded-2xl border-2 border-sky-950 bg-white p-5">
            <span className="text-xs font-black uppercase tracking-widest text-sky-600">
              Predict before observing
            </span>

            <h4 className="mt-1 text-xl font-black text-sky-950">
              {mode === 'diffusion'
                ? 'Which direction will particles move?'
                : 'What will happen to the cell?'}
            </h4>

            <div className="mt-4 space-y-2">
              {predictionOptions.map((option) => {
                const selected = prediction === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => submitPrediction(option.id)}
                    className={`w-full rounded-xl border-2 p-3 text-left text-sm font-bold transition-all ${
                      selected
                        ? 'border-sky-950 bg-sky-950 text-white'
                        : 'border-sky-900/20 bg-sky-50 text-sky-950 hover:border-sky-700'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {predictionSubmitted && (
              <div
                className={`mt-4 rounded-xl p-4 text-sm font-bold ${
                  getPredictionCorrect()
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-rose-100 text-rose-900'
                }`}
              >
                {getPredictionCorrect()
                  ? '✓ Correct prediction!'
                  : '✗ Not quite. Change the conditions and think about the concentration gradient.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Osmosis explanation */}
      {mode === 'osmosis' && cellState && (
        <div className="mt-6 rounded-2xl border-2 border-sky-950 bg-white p-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="text-4xl">{cellState.icon}</div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-sky-600">
                Osmosis diagnosis
              </span>

              <h4 className="mt-1 text-2xl font-black text-sky-950">
                {cellState.label}
              </h4>

              <p className="mt-2 font-medium text-sky-950/70">
                {cellState.result}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reset */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={resetSimulation}
          className="rounded-xl border-2 border-sky-900 bg-white px-5 py-3 font-black text-sky-950 transition-all hover:-translate-y-1 hover:bg-sky-50"
        >
          ↻ Reset Experiment
        </button>
      </div>
    </div>
  );
}
