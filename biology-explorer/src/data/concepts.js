export const biologyConcepts = {
  cell: {
    id: 'cell',
    title: 'Cell',
    category: 'cellular-biology',
    description:
      'The fundamental structural and functional unit of living organisms.',
    relatedConcepts: [
      'cell-membrane',
      'organelles',
      'homeostasis',
    ],
  },

  organelles: {
    id: 'organelles',
    title: 'Organelles',
    category: 'cellular-biology',
    description:
      'Specialized structures inside cells that perform specific functions.',
    relatedConcepts: [
      'cell',
      'mitochondria',
      'nucleus',
      'ribosome',
    ],
  },

  dna: {
    id: 'dna',
    title: 'DNA',
    category: 'genetics',
    description:
      'The molecule that stores hereditary genetic information in living organisms.',
    relatedConcepts: [
      'gene',
      'dna-replication',
      'transcription',
      'mutation',
    ],
  },

  atp: {
    id: 'atp',
    title: 'ATP',
    category: 'metabolism',
    description:
      'A molecule used by cells to transfer and power many energy-requiring processes.',
    relatedConcepts: [
      'cellular-respiration',
      'mitochondria',
      'krebs-cycle',
    ],
  },

  homeostasis: {
    id: 'homeostasis',
    title: 'Homeostasis',
    category: 'foundations',
    description:
      'The maintenance of relatively stable internal conditions despite changes in the environment.',
    relatedConcepts: [
      'cell',
      'nervous-system',
      'endocrine-system',
    ],
  },
};
