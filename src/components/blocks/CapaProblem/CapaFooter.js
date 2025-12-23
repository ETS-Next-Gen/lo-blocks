// src/components/blocks/CapaProblem/CapaFooter.js
import { z } from 'zod';
import * as blocks from '@/lib/blocks';
import { ignore } from '@/lib/content/parsers';
import { baseAttributes } from '@/lib/blocks/attributeSchemas';
import _CapaFooter from './_CapaFooter.jsx';

const CapaFooter = blocks.dev({
  ...ignore(),
  name: 'CapaFooter',
  description: 'Problem footer with action buttons (Check, Show Answer) and status display',
  component: _CapaFooter,
  internal: true,
  // Note: Receives runtime attributes (target, hintsTarget) from _CapaProblem
  attributes: baseAttributes.extend({
    target: z.string().optional().describe('Comma-separated grader IDs to trigger'),
    hintsTarget: z.string().nullish().describe('DemandHints ID for hint button'),
    label: z.string().optional().describe('Check button label'),
    showAnswer: z.string().optional().describe('Show answer behavior'),
  }),
});

export default CapaFooter;

