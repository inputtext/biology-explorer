import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

const STEPS = [
  {
    id: "observe",
    number: "01",
    title: "Observe",
    icon: "👀",
  },
  {
    id: "question",
    number: "02",
    title: "Question",
    icon: "❓",
  },
  {
    id: "hypothesis",
    number: "03",
    title: "Hypothesis",
    icon: "💡",
  },
  {
    id: "variables",
    number: "04",
    title: "Variables",
    icon: "⚙️",
  },
  {
    id: "experiment",
    number: "05",
    title: "Experiment",
    icon: "🧪",
  },
  {
    id: "results",
    number: "06",
    title: "Results",
    icon: "📊",
  },
  {
    id: "conclusion",
    number: "07",
    title: "Conclusion",
    icon: "🧠",
  },
];

const QUESTION_OPTIONS = [
  {
    id: "light-growth",
    text: "Does light intensity affect plant growth?",
    correct: true,
  },
  {
    id: "water-color",
    text: "Does the color of the pot determine plant height?",
    correct: false,
  },
  {
    id: "soil-temperature",
    text: "Does soil temperature determine the color of the leaves?",
    correct: false,
  },
];

const HYPOTHESIS_OPTIONS = [
  {
    id: "supported",
    text: "If light intensity increases, then plant growth will increase.",
    correct: true,
  },
  {
    id: "unsupported",
    text: "Plants will grow because plants are alive.",
    correct: false,
  },
  {
    id: "irrelevant",
    text: "If the pot is larger, then the leaves will become darker.",
    correct: false,
  },
];

export default function ScientificMethodLab({ moduleData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [questionChoice, setQuestionChoice] = useState(null);
  const [hypothesisChoice, setHypothesisChoice] = useState(null);

  const [lightIntensity, setLightIntensity] = useState(70);
  const [waterAmount, setWaterAmount] = useState(50);
  const [temperature, setTemperature] = useState(24);

  const [experimentRun, setExperimentRun] = useState(false);
  const [observation, setObservation] = useState(null);

  const cardRef = useRef(null);
  const experimentRef = useRef(null);

  const step = STEPS[currentStep];

  const growthData = useMemo(() => {
    const lightEffect = lightIntensity * 0.62;
    const waterEffect =
      waterAmount >= 40 && waterAmount <= 70
        ? 25
        : waterAmount < 40
          ? waterAmount * 0.35
          : 70 - (waterAmount - 70) * 0.5;

    const temperatureEffect = Math.max(0, 30 - Math.abs(24 - temperature) * 3);

    const growth = Math.max(
      5,
      Math.min(
        100,
        lightEffect + waterEffect * 0.25 + temperatureEffect * 0.45,
      ),
    );

    return Math.round(growth);
  }, [lightIntensity, waterAmount, temperature]);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { x: 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      },
    );
  }, [currentStep]);

  const animateFeedback = () => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { scale: 0.97 },
      {
        scale: 1,
        duration: 0.35,
        ease: "back.out(2)",
      },
    );
  };

  const selectQuestion = (option) => {
    setQuestionChoice(option.id);
    animateFeedback();
  };

  const selectHypothesis = (option) => {
    setHypothesisChoice(option.id);
    animateFeedback();
  };

  const runExperiment = () => {
    setExperimentRun(true);

    const result =
      growthData >= 70
        ? "Strong growth"
        : growthData >= 45
          ? "Moderate growth"
          : "Limited growth";

    setObservation(result);

    if (experimentRef.current) {
      gsap.fromTo(
        experimentRef.current,
        {
          scale: 0.96,
          opacity: 0.5,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
        },
      );
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetLab = () => {
    setCurrentStep(0);
    setQuestionChoice(null);
    setHypothesisChoice(null);
    setLightIntensity(70);
    setWaterAmount(50);
    setTemperature(24);
    setExperimentRun(false);
    setObservation(null);
  };

  const renderStepContent = () => {
    switch (step.id) {
      case "observe":
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-emerald-900/20 bg-white/60 p-6">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
                Field Observation
              </span>

              <h4 className="mt-2 text-2xl font-black text-emerald-950">
                Two identical plants are growing at different rates.
              </h4>

              <p className="mt-4 font-medium leading-relaxed text-emerald-950/75">
                Plant A receives strong light from a nearby window. Plant B
                receives much less light. After several days, Plant A appears
                taller.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border-2 border-emerald-900 bg-emerald-100 p-6 text-center">
                <div className="text-6xl">🌱</div>
                <div className="mt-3 font-black text-emerald-950">Plant A</div>
                <div className="text-sm font-bold text-emerald-800">
                  Strong light
                </div>
              </div>

              <div className="rounded-2xl border-2 border-emerald-900 bg-slate-100 p-6 text-center">
                <div className="text-6xl">🌿</div>
                <div className="mt-3 font-black text-emerald-950">Plant B</div>
                <div className="text-sm font-bold text-emerald-800">
                  Low light
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-950 p-5 text-emerald-50">
              <span className="font-black">Scientist's note:</span> Observation
              describes what you notice without trying to explain why it
              happened.
            </div>
          </div>
        );

      case "question":
        return (
          <div className="space-y-6">
            <p className="font-medium text-emerald-950/70">
              Turn your observation into a testable scientific question.
            </p>

            <div className="space-y-3">
              {QUESTION_OPTIONS.map((option) => {
                const selected = questionChoice === option.id;
                const correct = selected && option.correct;

                return (
                  <button
                    key={option.id}
                    onClick={() => selectQuestion(option)}
                    className={`w-full rounded-xl border-2 p-5 text-left font-bold transition-all ${
                      selected
                        ? correct
                          ? "border-emerald-700 bg-emerald-500 text-white"
                          : "border-rose-700 bg-rose-500 text-white"
                        : "border-emerald-900/20 bg-white hover:border-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>

            {questionChoice && (
              <div className="rounded-xl bg-white/70 p-5 font-medium text-emerald-950">
                {QUESTION_OPTIONS.find((option) => option.id === questionChoice)
                  ?.correct
                  ? "✓ Excellent. A scientific question should be specific and testable."
                  : "Not quite. Choose a question that directly tests the observation."}
              </div>
            )}
          </div>
        );

      case "hypothesis":
        return (
          <div className="space-y-6">
            <p className="font-medium text-emerald-950/70">
              Choose the hypothesis that makes a testable prediction.
            </p>

            <div className="space-y-3">
              {HYPOTHESIS_OPTIONS.map((option) => {
                const selected = hypothesisChoice === option.id;
                const correct = selected && option.correct;

                return (
                  <button
                    key={option.id}
                    onClick={() => selectHypothesis(option)}
                    className={`w-full rounded-xl border-2 p-5 text-left font-bold transition-all ${
                      selected
                        ? correct
                          ? "border-emerald-700 bg-emerald-500 text-white"
                          : "border-rose-700 bg-rose-500 text-white"
                        : "border-emerald-900/20 bg-white hover:border-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>

            {hypothesisChoice && (
              <div className="rounded-xl bg-white/70 p-5 font-medium text-emerald-950">
                {HYPOTHESIS_OPTIONS.find(
                  (option) => option.id === hypothesisChoice,
                )?.correct
                  ? "✓ Correct. This predicts a relationship that can be tested experimentally."
                  : "A hypothesis should make a specific prediction that an experiment can test."}
              </div>
            )}
          </div>
        );

      case "variables":
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-emerald-900/20 bg-white/60 p-6">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
                Experimental Design
              </span>

              <h4 className="mt-2 text-2xl font-black text-emerald-950">
                Identify the variables
              </h4>

              <p className="mt-2 font-medium text-emerald-950/70">
                In this experiment, light intensity is the independent variable.
                Plant growth is the dependent variable.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border-2 border-emerald-900 bg-white p-5">
                <div className="text-xs font-black uppercase text-emerald-600">
                  Independent
                </div>
                <div className="mt-2 text-lg font-black">Light intensity</div>
                <div className="mt-1 text-sm font-medium text-slate-500">
                  What we change
                </div>
              </div>

              <div className="rounded-xl border-2 border-emerald-900 bg-white p-5">
                <div className="text-xs font-black uppercase text-emerald-600">
                  Dependent
                </div>
                <div className="mt-2 text-lg font-black">Plant growth</div>
                <div className="mt-1 text-sm font-medium text-slate-500">
                  What we measure
                </div>
              </div>

              <div className="rounded-xl border-2 border-emerald-900 bg-white p-5">
                <div className="text-xs font-black uppercase text-emerald-600">
                  Controls
                </div>
                <div className="mt-2 text-lg font-black">
                  Water + temperature
                </div>
                <div className="mt-1 text-sm font-medium text-slate-500">
                  What we keep consistent
                </div>
              </div>
            </div>
          </div>
        );

      case "experiment":
        return (
          <div ref={experimentRef} className="space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
                Virtual Experiment
              </span>

              <h4 className="mt-2 text-2xl font-black text-emerald-950">
                Configure your greenhouse
              </h4>

              <p className="mt-2 font-medium text-emerald-950/70">
                Change the conditions, predict the outcome, then run the
                experiment.
              </p>
            </div>

            <div className="space-y-6 rounded-2xl border-2 border-emerald-900 bg-white p-6">
              <label className="block">
                <div className="mb-2 flex justify-between font-black">
                  <span>☀️ Light intensity</span>
                  <span>{lightIntensity}%</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightIntensity}
                  onChange={(event) =>
                    setLightIntensity(Number(event.target.value))
                  }
                  className="w-full accent-emerald-700"
                />
              </label>

              <label className="block">
                <div className="mb-2 flex justify-between font-black">
                  <span>💧 Water per day</span>
                  <span>{waterAmount} mL</span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={waterAmount}
                  onChange={(event) =>
                    setWaterAmount(Number(event.target.value))
                  }
                  className="w-full accent-emerald-700"
                />
              </label>

              <label className="block">
                <div className="mb-2 flex justify-between font-black">
                  <span>🌡️ Temperature</span>
                  <span>{temperature}°C</span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="35"
                  value={temperature}
                  onChange={(event) =>
                    setTemperature(Number(event.target.value))
                  }
                  className="w-full accent-emerald-700"
                />
              </label>

              <button
                onClick={runExperiment}
                className="w-full rounded-xl border-2 border-emerald-950 bg-emerald-950 px-6 py-4 font-black text-white shadow-[4px_4px_0px_#064e3b] transition-all hover:-translate-y-1"
              >
                🧪 RUN EXPERIMENT
              </button>
            </div>

            {experimentRun && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border-2 border-emerald-900 bg-emerald-100 p-6">
                  <div className="text-xs font-black uppercase tracking-widest text-emerald-700">
                    Predicted growth
                  </div>
                  <div className="mt-2 text-5xl font-black text-emerald-950">
                    {growthData}%
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-emerald-900 bg-white p-6">
                  <div className="text-xs font-black uppercase tracking-widest text-emerald-700">
                    Observation
                  </div>
                  <div className="mt-2 text-2xl font-black text-emerald-950">
                    {observation}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "results":
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-emerald-900 bg-white p-6">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
                Experimental Results
              </span>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex justify-between font-black">
                    <span>Plant growth</span>
                    <span>{growthData}%</span>
                  </div>

                  <div className="h-5 overflow-hidden rounded-full border-2 border-emerald-900 bg-emerald-100">
                    <div
                      className="h-full bg-emerald-700 transition-all duration-700"
                      style={{ width: `${growthData}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-emerald-50 p-4">
                    <div className="text-xs font-black uppercase text-emerald-600">
                      Light
                    </div>
                    <div className="text-2xl font-black">{lightIntensity}%</div>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-4">
                    <div className="text-xs font-black uppercase text-emerald-600">
                      Water
                    </div>
                    <div className="text-2xl font-black">{waterAmount} mL</div>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-4">
                    <div className="text-xs font-black uppercase text-emerald-600">
                      Temperature
                    </div>
                    <div className="text-2xl font-black">{temperature}°C</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-950 p-5 text-emerald-50">
              <span className="font-black">Analyze:</span> compare your
              experimental conditions with the amount of plant growth observed.
            </div>
          </div>
        );

      case "conclusion":
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-emerald-900 bg-emerald-100 p-6">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
                Final Analysis
              </span>

              <h4 className="mt-2 text-3xl font-black text-emerald-950">
                Did your evidence support the hypothesis?
              </h4>

              <p className="mt-4 font-medium leading-relaxed text-emerald-950/75">
                A scientific conclusion should connect the evidence from the
                experiment back to the original hypothesis.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-emerald-900 bg-white p-6">
              <div className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Your experiment
              </div>

              <p className="mt-3 text-lg font-bold text-slate-900">
                With {lightIntensity}% light, {waterAmount} mL of water per day,
                and a temperature of {temperature}°C, the simulated plant growth
                was approximately {growthData}%.
              </p>

              <div className="mt-6 rounded-xl bg-emerald-50 p-5">
                <div className="font-black text-emerald-950">
                  Scientific takeaway
                </div>

                <p className="mt-2 font-medium text-emerald-950/75">
                  The experiment allows us to test whether changing one factor
                  is associated with a measurable change in another factor.
                  Strong conclusions depend on controlled experiments and
                  evidence.
                </p>
              </div>
            </div>

            <button
              onClick={resetLab}
              className="w-full rounded-xl border-2 border-emerald-900 bg-white px-6 py-4 font-black text-emerald-950 transition-all hover:-translate-y-1 hover:bg-emerald-50"
            >
              ↻ Run the Lab Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-12 overflow-hidden rounded-3xl border-2 border-emerald-900 bg-[#D4F0E4] p-6 shadow-[6px_6px_0px_#064e3b] md:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Virtual Biology Lab
          </span>

          <h3 className="mt-1 text-3xl font-black text-emerald-950 md:text-4xl">
            {moduleData?.title || "Scientific Method Lab"}
          </h3>

          <p className="mt-2 max-w-2xl font-medium text-emerald-950/70">
            {moduleData?.content ||
              "Design and run a controlled experiment using the scientific method."}
          </p>
        </div>

        <div className="rounded-xl border-2 border-emerald-900 bg-white px-4 py-3 text-right">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-600">
            Step
          </div>
          <div className="text-2xl font-black text-emerald-950">
            {currentStep + 1} / {STEPS.length}
          </div>
        </div>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {STEPS.map((item, index) => {
            const active = index === currentStep;
            const completed = index < currentStep;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentStep(index)}
                className={`rounded-xl border-2 px-4 py-3 text-left transition-all ${
                  active
                    ? "border-emerald-950 bg-emerald-950 text-white"
                    : completed
                      ? "border-emerald-700 bg-emerald-200 text-emerald-950"
                      : "border-emerald-900/20 bg-white text-emerald-950 hover:border-emerald-700"
                }`}
              >
                <div className="text-xs font-black opacity-60">
                  {item.number}
                </div>
                <div className="font-black">
                  {item.icon} {item.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={cardRef}
        className="min-h-[500px] rounded-2xl border-2 border-emerald-900 bg-[#F8FFFB] p-6 md:p-8"
      >
        <div className="mb-8">
          <span className="text-sm font-black uppercase tracking-widest text-emerald-600">
            {step.icon} {step.number}
          </span>

          <h4 className="mt-1 text-3xl font-black text-emerald-950">
            {step.title}
          </h4>
        </div>

        {renderStepContent()}
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <button
          onClick={previousStep}
          disabled={currentStep === 0}
          className="rounded-xl border-2 border-emerald-900 bg-white px-5 py-3 font-black text-emerald-950 transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Previous
        </button>

        {currentStep < STEPS.length - 1 && (
          <button
            onClick={nextStep}
            className="rounded-xl border-2 border-emerald-950 bg-emerald-950 px-6 py-3 font-black text-white shadow-[3px_3px_0px_#064e3b] transition-all hover:-translate-y-1"
          >
            Next Step →
          </button>
        )}
      </div>
    </div>
  );
}
