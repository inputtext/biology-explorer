import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function QuizArena({ moduleData }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const cardRef = useRef(null);
  const resultsRef = useRef(null);
  const { questions } = moduleData;

  // Animate the card in when the component mounts
  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
    );
  }, []);

  const handleAnswer = (index) => {
    if (isAnimating) return; // Prevent clicking while animating
    setSelectedAnswer(index);
    setIsAnimating(true);

    const isCorrect = index === questions[currentQ].correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);

    // GSAP Sequence: Flash color, then slide out
    const tl = gsap.timeline({
      onComplete: () => {
        setSelectedAnswer(null);
        if (currentQ + 1 < questions.length) {
          setCurrentQ(prev => prev + 1);
          // Slide new question in
          gsap.fromTo(cardRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
          );
        } else {
          setShowResults(true);
        }
        setIsAnimating(false);
      }
    });

    // Slight delay to let user see their selection before transitioning
    tl.to(cardRef.current, { delay: 0.8, x: -100, opacity: 0, duration: 0.4, ease: "power2.in" });
  };

  // Animate results screen when it appears
  useEffect(() => {
    if (showResults) {
      gsap.fromTo(resultsRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.7)" }
      );
    }
  }, [showResults]);

  const resetQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setShowResults(false);
    setTimeout(() => {
      gsap.fromTo(cardRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" });
    }, 100);
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-[#D4F0E4] border-2 border-emerald-900 rounded-2xl p-12 shadow-[4px_4px_0px_#064e3b] mt-12 text-center" ref={resultsRef}>
        <span className="text-6xl mb-4 block">{percentage >= 75 ? '🏆' : '📚'}</span>
        <h3 className="text-4xl font-black text-emerald-950 mb-2">Quiz Complete!</h3>
        <p className="text-xl text-emerald-900/80 font-medium mb-8">
          You scored <span className="font-black text-2xl text-emerald-900">{score}</span> out of {questions.length} ({percentage}%)
        </p>
        <button
          onClick={resetQuiz}
          className="px-8 py-4 bg-emerald-900 text-white border-2 border-emerald-900 rounded-xl font-black text-lg shadow-[4px_4px_0px_#022c22] hover:-translate-y-1 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const questionData = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  return (
    <div className="bg-[#D4F0E4] border-2 border-emerald-900 rounded-2xl p-8 shadow-[4px_4px_0px_#064e3b] mt-12 overflow-hidden">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black text-emerald-950 mb-2">{moduleData.title}</h3>
        <p className="text-emerald-900/80 font-medium">{moduleData.content}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto h-3 bg-emerald-200 rounded-full mb-12 overflow-hidden border-2 border-emerald-900/20">
        <div
          className="h-full bg-emerald-900 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div ref={cardRef} className="max-w-2xl mx-auto bg-white border-2 border-emerald-900 rounded-xl p-8 shadow-[4px_4px_0px_#064e3b]">
        <span className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-4 block">
          Question {currentQ + 1} of {questions.length}
        </span>
        <h4 className="text-2xl font-black text-slate-900 mb-8">{questionData.question}</h4>

        <div className="flex flex-col gap-4">
          {questionData.options.map((option, index) => {
            let buttonClass = "bg-white border-slate-300 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50";

            // Handle styling during animation phase to show right/wrong answers
            if (selectedAnswer !== null) {
              if (index === questionData.correctAnswer) {
                buttonClass = "bg-emerald-500 border-emerald-700 text-white font-bold"; // Correct
              } else if (index === selectedAnswer) {
                buttonClass = "bg-rose-500 border-rose-700 text-white font-bold"; // User's wrong pick
              } else {
                buttonClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-50"; // Dim others
              }
            }

            return (
              <button
                key={index}
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswer(index)}
                className={`p-4 text-left border-2 rounded-xl transition-all duration-300 font-medium ${buttonClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
