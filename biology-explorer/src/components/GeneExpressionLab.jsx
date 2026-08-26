import { useMemo, useState } from 'react';

const DNA_TEMPLATE = ['T', 'A', 'C', 'G', 'C', 'T', 'G', 'G', 'A', 'A', 'C', 'T'];

const DNA_TO_RNA = {
  A: 'U',
  T: 'A',
  C: 'G',
  G: 'C',
};

const CODON_TABLE = {
  AUG: 'Met',
  GCU: 'Ala',
  GCC: 'Ala',
  GCA: 'Ala',
  GCG: 'Ala',
  CCA: 'Pro',
  CCC: 'Pro',
  CCG: 'Pro',
  CCU: 'Pro',
  UGA: 'STOP',
  UAA: 'STOP',
  UAG: 'STOP',
};

const BASE_OPTIONS = ['A', 'U', 'C', 'G'];

export default function GeneExpressionLab({ moduleData }) {
  const [stage, setStage] = useState(0);

  const [rnaSequence, setRnaSequence] = useState(
    Array(DNA_TEMPLATE.length).fill(null)
  );

  const [translationAnswer, setTranslationAnswer] = useState([]);

  const [mutationIndex, setMutationIndex] = useState(null);

  const expectedRna = useMemo(
    () => DNA_TEMPLATE.map((base) => DNA_TO_RNA[base]),
    []
  );

  const rnaCorrect = rnaSequence.every(
    (base, index) => base === expectedRna[index]
  );

  const codons = useMemo(() => {
    const sequence = rnaCorrect ? expectedRna : [];

    const result = [];

    for (let i = 0; i < sequence.length; i += 3) {
      result.push(sequence.slice(i, i + 3).join(''));
    }

    return result;
  }, [expectedRna, rnaCorrect]);

  const aminoAcids = codons.map(
    (codon) => CODON_TABLE[codon] || '?'
  );

  const chooseBase = (index, base) => {
    setRnaSequence((previous) => {
      const next = [...previous];
      next[index] = base;
      return next;
    });
  };

  const nextStage = () => {
    if (stage < 2) {
      setStage((previous) => previous + 1);
    }
  };

  const previousStage = () => {
    if (stage > 0) {
      setStage((previous) => previous - 1);
    }
  };

  const reset = () => {
    setStage(0);
    setRnaSequence(Array(DNA_TEMPLATE.length).fill(null));
    setTranslationAnswer([]);
    setMutationIndex(null);
  };

  const renderTranscription = () => (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-violet-600">
          Stage 01 · Transcription
        </span>

        <h4 className="mt-2 text-3xl font-black text-violet-950">
          Build the mRNA strand
        </h4>

        <p className="mt-2 font-medium text-violet-950/70">
          RNA polymerase reads the DNA template and builds a complementary
          RNA strand.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-violet-950 bg-white p-6">
        <div className="text-xs font-black uppercase tracking-widest text-violet-600">
          DNA Template
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {DNA_TEMPLATE.map((base, index) => (
            <div
              key={index}
              className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-violet-900 bg-violet-100 text-lg font-black text-violet-950"
            >
              {base}
            </div>
          ))}
        </div>

        <div className="mt-3 text-sm font-bold text-violet-700">
          3' → 5'
        </div>
      </div>

      <div className="rounded-2xl border-2 border-violet-950 bg-[#F9F7FF] p-6">
        <div className="text-xs font-black uppercase tracking-widest text-violet-600">
          Your mRNA
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {rnaSequence.map((base, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-lg font-black ${
                  base
                    ? 'border-violet-950 bg-violet-950 text-white'
                    : 'border-dashed border-violet-400 bg-white text-violet-300'
                }`}
              >
                {base || '?'}
              </div>

              <div className="flex gap-1">
                {BASE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => chooseBase(index, option)}
                    className="h-7 w-7 rounded-md border border-violet-300 bg-white text-xs font-black text-violet-900 hover:bg-violet-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm font-bold text-violet-700">
          5' → 3'
        </div>
      </div>

      {rnaSequence.some(Boolean) && (
        <div
          className={`rounded-xl p-5 font-bold ${
            rnaCorrect
              ? 'bg-emerald-100 text-emerald-900'
              : 'bg-amber-100 text-amber-900'
          }`}
        >
          {rnaCorrect
            ? '✓ Perfect! Your mRNA sequence is complementary to the DNA template.'
            : 'Keep checking each base. Remember: A pairs with U in RNA, while T pairs with A.'}
        </div>
      )}
    </div>
  );

  const renderTranslation = () => (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-violet-600">
          Stage 02 · Translation
        </span>

        <h4 className="mt-2 text-3xl font-black text-violet-950">
          Decode the mRNA
        </h4>

        <p className="mt-2 font-medium text-violet-950/70">
          Ribosomes read mRNA three bases at a time. Each codon specifies an
          amino acid or a stop signal.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-violet-950 bg-white p-6">
        <div className="text-xs font-black uppercase tracking-widest text-violet-600">
          mRNA Codons
        </div>

        <div className="mt-5 flex flex-wrap gap-4">
          {codons.map((codon, index) => (
            <div
              key={index}
              className="rounded-xl border-2 border-violet-900 bg-violet-100 px-5 py-4 text-center"
            >
              <div className="text-xl font-black text-violet-950">
                {codon}
              </div>

              <div className="mt-1 text-xs font-bold uppercase text-violet-600">
                Codon {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-violet-950 bg-[#F9F7FF] p-6">
        <div className="text-xs font-black uppercase tracking-widest text-violet-600">
          Protein
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {aminoAcids.map((aminoAcid, index) => (
            <div
              key={index}
              className="rounded-full border-2 border-violet-950 bg-violet-950 px-5 py-3 font-black text-white"
            >
              {aminoAcid}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-white p-4 font-bold text-violet-950/70">
          Protein sequence:{' '}
          <span className="text-violet-950">
            {aminoAcids.join(' → ')}
          </span>
        </div>
      </div>
    </div>
  );

  const renderMutation = () => {
    const mutatedCodons = [...codons];

    if (mutationIndex !== null && mutatedCodons[mutationIndex]) {
      const current = mutatedCodons[mutationIndex];

      mutatedCodons[mutationIndex] =
        current === 'CCA' ? 'UCA' : 'UAA';
    }

    const mutatedProtein = mutatedCodons.map(
      (codon) => CODON_TABLE[codon] || '?'
    );

    return (
      <div className="space-y-8">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-violet-600">
            Stage 03 · Mutation
          </span>

          <h4 className="mt-2 text-3xl font-black text-violet-950">
            Change one codon
          </h4>

          <p className="mt-2 font-medium text-violet-950/70">
            Mutations can change DNA and sometimes alter the resulting
            protein.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {codons.map((codon, index) => (
            <button
              key={index}
              onClick={() => setMutationIndex(index)}
              className={`rounded-2xl border-2 p-5 text-left transition-all ${
                mutationIndex === index
                  ? 'border-violet-950 bg-violet-950 text-white'
                  : 'border-violet-900/20 bg-white text-violet-950 hover:border-violet-700'
              }`}
            >
              <div className="text-xs font-black uppercase opacity-60">
                Codon {index + 1}
              </div>

              <div className="mt-1 text-2xl font-black">
                {codon}
              </div>

              <div className="mt-1 text-sm font-bold opacity-70">
                {CODON_TABLE[codon] || 'Unknown'}
              </div>
            </button>
          ))}
        </div>

        {mutationIndex !== null && (
          <div className="rounded-2xl border-2 border-violet-950 bg-white p-6">
            <div className="text-xs font-black uppercase tracking-widest text-violet-600">
              Mutation Result
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-violet-50 p-5">
                <div className="text-sm font-black text-violet-600">
                  Original
                </div>

                <div className="mt-2 text-2xl font-black text-violet-950">
                  {codons[mutationIndex]}
                </div>

                <div className="mt-1 font-bold text-violet-950/60">
                  {aminoAcids[mutationIndex]}
                </div>
              </div>

              <div className="rounded-xl bg-rose-50 p-5">
                <div className="text-sm font-black text-rose-600">
                  Mutated
                </div>

                <div className="mt-2 text-2xl font-black text-rose-950">
                  {mutatedCodons[mutationIndex]}
                </div>

                <div className="mt-1 font-bold text-rose-950/60">
                  {mutatedProtein[mutationIndex]}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-violet-950 p-5 font-bold text-white">
              {mutatedProtein[mutationIndex] === aminoAcids[mutationIndex]
                ? 'This mutation does not change the amino acid in our simplified example.'
                : 'The mutation changes the amino acid sequence. This is an example of how a DNA change can alter a protein.'}
            </div>
          </div>
        )}
      </div>
    );
  };

  const stageContent = [
    renderTranscription,
    renderTranslation,
    renderMutation,
  ][stage];

  return (
    <div className="mt-12 overflow-hidden rounded-3xl border-2 border-violet-950 bg-[#EAE2F8] p-6 shadow-[6px_6px_0px_#4c1d95] md:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
            Molecular Biology Lab
          </span>

          <h3 className="mt-1 text-3xl font-black text-violet-950 md:text-4xl">
            {moduleData?.title || 'Gene Expression Lab'}
          </h3>

          <p className="mt-2 max-w-2xl font-medium text-violet-950/70">
            {moduleData?.content ||
              'Trace information from DNA through RNA to a protein.'}
          </p>
        </div>

        <div className="rounded-xl border-2 border-violet-950 bg-white px-4 py-3 text-right">
          <div className="text-xs font-black uppercase tracking-widest text-violet-600">
            Stage
          </div>

          <div className="text-2xl font-black text-violet-950">
            {stage + 1} / 3
          </div>
        </div>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto">
        {['Transcription', 'Translation', 'Mutation'].map(
          (label, index) => (
            <button
              key={label}
              onClick={() => setStage(index)}
              className={`rounded-xl border-2 px-5 py-3 font-black whitespace-nowrap transition-all ${
                stage === index
                  ? 'border-violet-950 bg-violet-950 text-white'
                  : 'border-violet-900/20 bg-white text-violet-950 hover:border-violet-700'
              }`}
            >
              {String(index + 1).padStart(2, '0')} · {label}
            </button>
          )
        )}
      </div>

      <div className="min-h-[520px] rounded-2xl border-2 border-violet-950 bg-[#FCFBFF] p-6 md:p-8">
        {stageContent()}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={previousStage}
          disabled={stage === 0}
          className="rounded-xl border-2 border-violet-950 bg-white px-5 py-3 font-black text-violet-950 transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Previous
        </button>

        {stage < 2 ? (
          <button
            onClick={nextStage}
            disabled={stage === 0 && !rnaCorrect}
            className="rounded-xl border-2 border-violet-950 bg-violet-950 px-6 py-3 font-black text-white shadow-[3px_3px_0px_#4c1d95] transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next Stage →
          </button>
        ) : (
          <button
            onClick={reset}
            className="rounded-xl border-2 border-violet-950 bg-white px-6 py-3 font-black text-violet-950 transition-all hover:-translate-y-1"
          >
            ↻ Reset Lab
          </button>
        )}
      </div>
    </div>
  );
}
