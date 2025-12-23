// src/lib/blocks/attributeSchemas.js
//
// Base attribute schemas for block validation.
//
// Provides common attribute definitions that blocks can extend.
// Usage:
//   baseAttributes.extend({ answer: z.string() })           // strict
//   baseAttributes.extend({ answer: z.string() }).passthrough()  // allow extras
//
import { z } from 'zod';

/**
 * Base attributes common to all blocks.
 * Extend this for block-specific attributes.
 */
export const baseAttributes = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  class: z.string().optional(),
  url_name: z.string().optional(),  // legacy edX attribute
  launchable: z.string().optional(), // "true" marks block as standalone-launchable
  // TODO: Rename 'label' to 'title' for consistency (label is used by Tabs for tab titles)
  label: z.string().optional().describe('Tab label when used as child of Tabs'),
});

/**
 * Attributes for blocks that support external source loading via src attribute.
 * Used by blocks with text() or peggyParser() parsers.
 */
export const srcAttributes = baseAttributes.extend({
  src: z.string().optional().describe('Path to external file containing content'),
});
