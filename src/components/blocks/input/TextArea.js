// src/components/blocks/TextArea.js
import { z } from 'zod';
import { core } from '@/lib/blocks';
import * as state from '@/lib/state';
import { fieldSelector, fieldByName } from '@/lib/state';
import * as parsers from '@/lib/content/parsers';
import { baseAttributes } from '@/lib/blocks/attributeSchemas';
import _TextArea from './_TextArea';

export const fields = state.fields(['value']);
const TextArea = core({
  ...parsers.blocks(),
  name: 'TextArea',
  description: 'Multi-line text input field for longer student responses',
  component: _TextArea,
  fields: fields,
  getValue: (props, state, id) => fieldSelector(state, props, fieldByName('value'), { fallback: '', id }),
  attributes: baseAttributes.extend({
    placeholder: z.string().optional().describe('Placeholder text shown when empty'),
    rows: z.string().optional().describe('Number of visible text rows'),
    readonly: z.enum(['true', 'false']).optional().describe('Make textarea read-only'),
  }),
});

export default TextArea;
