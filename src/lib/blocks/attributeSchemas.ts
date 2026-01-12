// src/lib/blocks/attributeSchemas.ts
//
// Attribute schemas for block validation.
//
// Architecture:
//   - baseAttributes: Common to ALL blocks (id, title, class, etc.)
//   - inputMixin: Added by factory when isInput=true
//   - graderMixin: Added by factory when isGrader=true
//   - Optional spreads (placeholder, src): Blocks include manually if needed
//
// Composition happens in factory.tsx based on block properties.
// This allows a block to be input+grader+src without combinatorial explosion.
//
import { z } from 'zod';

/**
 * Valid OLX ID pattern - must not contain namespace/path delimiters.
 * Reserved characters: . / : and whitespace
 * These are used for runtime namespacing (e.g., "list.0.child") and path syntax.
 */
const VALID_ID_PATTERN = /^[^./:,\s]+$/;

/**
 * Zod refinement for validating OLX IDs.
 * Returns undefined if valid, error message if invalid.
 */
const validateOlxId = (id) => {
  if (!id) return undefined;
  if (!VALID_ID_PATTERN.test(id)) {
    return `ID "${id}" contains reserved characters. IDs cannot contain: . / : , or whitespace`;
  }
  return undefined;
};

// =============================================================================
// Base Attributes (all blocks)
// =============================================================================

/**
 * Base attributes common to all blocks.
 * STRICT: unknown attributes cause validation errors.
 */
export const baseAttributes = z.object({
  id: z.string().optional().refine(
    (id) => !id || VALID_ID_PATTERN.test(id),
    (id) => ({ message: validateOlxId(id) })
  ).describe('Unique identifier (letters, numbers, underscore)'),
  title: z.string().optional().describe('Display title (shown in tabs, course navigation, headers)'),
  class: z.string().optional().describe('Visual styling classes (CSS classes for developers)'),
  launchable: z.string().optional().describe('Set to "true" to show in activity indexes'),
  initialPosition: z.string().optional().describe('Initial position for sortable items'),
}).strict();

// =============================================================================
// Mixins (composed by factory based on block type)
// =============================================================================

/**
 * Input mixin - added by factory when isInput=true.
 * Contains attributes specific to input blocks.
 */
export const inputMixin = z.object({
  slot: z.string().optional().describe('Named slot for multi-input graders (e.g., "numerator")'),
});

/**
 * Grader mixin - added by factory when isGrader=true.
 * Contains attributes specific to grader blocks.
 */
export const graderMixin = z.object({
  answer: z.string().optional().describe('Expected answer for grading'),
  displayAnswer: z.string().optional().describe('Answer shown to student (may differ from grading answer)'),
  target: z.string().optional().describe('ID of input to grade (inferred if omitted)'),
});

// =============================================================================
// Optional Spreads (blocks include manually if needed)
// =============================================================================

/**
 * Placeholder attribute - for blocks that support placeholder text.
 * Usage: baseAttributes.extend({ ...placeholder, myAttr: z.string() })
 */
export const placeholder = {
  placeholder: z.string().optional().describe('Placeholder text displayed when empty'),
};

/**
 * Src attribute - for blocks that load external content.
 * Usage: baseAttributes.extend({ ...src, myAttr: z.string() })
 */
export const src = {
  src: z.string().optional().describe('Path to external file containing content'),
};

// =============================================================================
// Legacy Exports (deprecated - use baseAttributes + mixins)
// =============================================================================

// TODO: Remove these after updating all block files
// These pre-composed schemas don't handle composition well

/** @deprecated Use baseAttributes.extend({...src}) instead */
export const srcAttributes = baseAttributes.extend(src);

/** @deprecated Factory now handles input attrs via isInput flag */
export const inputAttributes = baseAttributes.extend(inputMixin.shape);

/** @deprecated Factory now handles grader attrs via isGrader flag */
export const graderAttributes = baseAttributes.extend(graderMixin.shape);

/** @deprecated Use inputMixin.shape instead */
export const slot = inputMixin.shape;

/** Inferred type for grader attributes */
export type GraderAttributes = z.infer<typeof graderMixin>;
