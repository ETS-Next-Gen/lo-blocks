// src/lib/content/metadata.ts
//
// OLX Metadata Schema - defines and validates metadata from YAML frontmatter comments
//
// Metadata is specified in the first comment before the root element using YAML frontmatter:
//
// <!--
// ---
// description: A brief description of this activity
// author: Content Creator Name
// tags:
//   - psychology
//   - assessment
// category: psychology
// ---
// -->
// <Vertical id="my_activity">
//   ...
// </Vertical>
//
// The schema uses Zod for validation and provides type-safe access to metadata fields.
//

import { z } from 'zod';

/**
 * Schema for OLX file metadata
 *
 * Currently supports:
 * - description: Brief text description of the activity/content
 *
 * Future fields (commented out for now):
 * - author: Content creator name
 * - tags: Array of categorization tags
 * - category: Primary category
 * - namespace: Organizational namespace
 * - modified: Last modification date
 * - version: Content version
 * - contributors: Array of contributor objects
 */
export const OLXMetadataSchema = z.object({
  description: z.string().optional(),
  category: z.string().optional(),

  // Future fields - uncomment and implement as needed:
  // author: z.string().optional(),
  // tags: z.array(z.string()).optional(),
  // namespace: z.string().optional(),
  // modified: z.string().datetime().optional(),
  // version: z.string().optional(),
  // contributors: z.array(z.object({
  //   name: z.string(),
  //   role: z.string().optional()
  // })).optional(),
}).passthrough(); // Allow unknown fields for forward compatibility

export type OLXMetadata = z.infer<typeof OLXMetadataSchema>;
