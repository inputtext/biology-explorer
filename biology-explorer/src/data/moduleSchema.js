/**
 * Shared metadata contract for Biology Explorer learning modules.
 *
 * This is intentionally kept as a plain JavaScript object instead
 * of a runtime validator for now. Later, when the content system
 * grows, we can introduce Zod or another schema validator.
 */

export const moduleMetadataDefaults = {
  difficulty: 'foundational',
  estimatedMinutes: 10,
  concepts: [],
  prerequisites: [],
  relatedModules: [],
  learningObjectives: [],
  vocabulary: [],
  tags: [],
};
