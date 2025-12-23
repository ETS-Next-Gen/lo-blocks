// src/components/blocks/ActionButton.js
import { z } from 'zod';
import * as blocks from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import * as state from '@/lib/state';
import { baseAttributes } from '@/lib/blocks/attributeSchemas';
import _ActionButton from './_ActionButton';

export const fields = state.fields([
  'isDisabled'
]);

const ActionButton = blocks.dev({
  ...parsers.blocks(),
  name: 'ActionButton',
  description: 'Clickable button that triggers actions on related components',
  component: _ActionButton,
  fields,
  attributes: baseAttributes.extend({
    label: z.string().describe('Button text displayed to the user'),
    dependsOn: z.string().optional().describe('Prerequisite conditions (comma-separated element IDs with optional operators)'),
  }),
});

export default ActionButton;
