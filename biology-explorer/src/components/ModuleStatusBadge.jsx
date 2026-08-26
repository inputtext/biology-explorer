import { useEffect, useState } from 'react';
import { useLottie } from 'lottie-react'; // Using the named export to fix the Vite build error!

export default function ModuleStatusBadge({ status }) {
  const [lottieData, setLottieData] = useState(null);

  // Instantly fetches a public Lottie JSON
  useEffect(() => {
    fetch('https://assets2.lottiefiles.com/packages/lf20_6limcgwq.json')
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch((err) => console.error('Lottie fetch failed:', err));
  }, []);

  // We use the hook instead of the default <Lottie /> component to satisfy strict bundlers
  const { View, goToAndPlay } = useLottie({
    animationData: lottieData,
    loop: false,
    autoplay: true,
    style: { width: '150%', height: '150%' } // Scales the SVG nicely
  });

  // Only render this highly-polished badge if the module is completed
  if (status !== 'completed') return null;

  // The tactile interaction: replay the Lottie animation smoothly on hover
  const handleMouseEnter = () => {
    if (goToAndPlay) {
      goToAndPlay(0, true); // Instantly resets and plays from frame 0
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F5E9] dark:bg-green-950/40 border-2 border-green-800 dark:border-green-400 rounded-full shadow-[3px_3px_0px_#166534] dark:shadow-[3px_3px_0px_#4ade80] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#166534] dark:hover:shadow-[4px_4px_0px_#4ade80] transition-all duration-200 cursor-pointer"
    >
      <div className="w-5 h-5 flex items-center justify-center pointer-events-none">
        {/* The View variable holds the rendered Lottie SVG */}
        {lottieData && View}
      </div>
      <span className="text-xs font-black text-green-900 dark:text-green-300 uppercase tracking-widest mt-0.5">
        Mastered
      </span>
    </div>
  );
}
