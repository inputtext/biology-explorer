import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Float } from '@react-three/drei';

// The 3D Heart Component
function HeartMesh({ bpm }) {
  const heartRef = useRef(null);

  // TO USE YOUR BLENDER MODEL:
  // 1. Put heart.glb in your /public folder
  // 2. Uncomment the line below, and replace the <mesh> below with: <primitive object={gltf.scene} />
  // const gltf = useGLTF('/heart.glb');

  useFrame((state) => {
    if (!heartRef.current) return;

    // Calculate the heart beat math based on the slider's BPM
    const speed = bpm / 60;
    const time = state.clock.getElapsedTime() * speed * 2;

    // Simulate a double-beat (lub-dub) using sine waves
    const beat = Math.abs(Math.sin(time * Math.PI)) ** 10; // Sharp spike
    const secondaryBeat = Math.abs(Math.sin((time - 0.2) * Math.PI)) ** 10; // Smaller secondary spike

    // Apply the scale to the 3D model
    const scale = 1 + (beat * 0.15) + (secondaryBeat * 0.05);
    heartRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={heartRef}>
      {/* PLACEHOLDER 3D SHAPE - Replace this <mesh> with your Blender model primitive! */}
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#be123c"
          wireframe={false}
          roughness={0.2}
          metalness={0.8}
          emissive="#4c0519"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function CardiacPump({ moduleData }) {
  const [bpm, setBpm] = useState(60);

  return (
    <div className="bg-[#FCE1E4] border-2 border-rose-900 rounded-2xl p-8 shadow-[4px_4px_0px_#881337] mt-12">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-black text-rose-950 mb-2">{moduleData.title}</h3>
        <p className="text-rose-900/80 font-medium">{moduleData.content}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* EPIC 3D CANVAS AREA */}
        <div className="relative h-[400px] bg-slate-900 border-4 border-rose-900 rounded-xl shadow-inner overflow-hidden cursor-move">
          <div className="absolute top-4 left-4 z-10 text-rose-300 text-xs font-bold tracking-widest uppercase">
            3D Interactive Space - Drag to Rotate
          </div>

          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <Environment preset="city" />

            <Suspense fallback={null}>
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <HeartMesh bpm={bpm} />
              </Float>
            </Suspense>

            <OrbitControls enableZoom={false} autoRotate={bpm < 80} autoRotateSpeed={1} />
          </Canvas>
        </div>

        {/* Control Panel Area */}
        <div className="bg-white/60 p-8 rounded-xl border-2 border-rose-900/20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="block text-sm font-bold text-rose-900/60 uppercase tracking-widest mb-1">Cardiac Output</span>
              <span className="text-6xl font-black text-rose-950 tabular-nums leading-none">{bpm}</span>
              <span className="text-xl font-bold text-rose-900 ml-2">BPM</span>
            </div>

            <div className={`px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest border-2 ${
              bpm < 70 ? 'bg-blue-100 text-blue-800 border-blue-800' :
              bpm < 120 ? 'bg-emerald-100 text-emerald-800 border-emerald-800' :
              'bg-rose-600 text-white border-rose-900 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.6)]'
            }`}>
              {bpm < 70 ? 'Resting' : bpm < 120 ? 'Active' : 'Intense'}
            </div>
          </div>

          <label className="block text-sm font-bold text-slate-800 mb-4">
            System Workload Override:
          </label>
          <input
            type="range"
            min="40"
            max="180"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            className="w-full h-4 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-700 hover:accent-rose-500 transition-all shadow-inner"
          />
          <div className="flex justify-between text-xs font-bold text-rose-900/60 mt-3">
            <span>40 (Deep Sleep)</span>
            <span>180 (Sprinting)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
