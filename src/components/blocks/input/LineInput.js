// src/components/blocks/LineInput.js
import { z } from 'zod';
import { core } from '@/lib/blocks';
import * as state from '@/lib/state';
import { fieldSelector, fieldByName } from '@/lib/state';
import * as parsers from '@/lib/content/parsers';
import { baseAttributes } from '@/lib/blocks/attributeSchemas';
import _LineInput from './_LineInput';

export const fields = state.fields(['value']);

// HTML input types per MDN. We support a subset that makes sense for educational content.
// Full list: button, checkbox, color, date, datetime-local, email, file, hidden, image,
// month, number, password, radio, range, reset, search, submit, tel, text, time, url, week
// Deprecated: datetime
//
// TODO: Consider adding support for: color, range, month, week (less common but potentially useful)
// Not supported: button, submit, reset (action buttons), checkbox, radio (use dedicated components),
// file (different use case), hidden, image (not text inputs)
const INPUT_TYPES = ['text', 'number', 'email', 'tel', 'url', 'password', 'search', 'date', 'time', 'datetime-local'];

const LineInput = core({
  ...parsers.blocks(),
  name: 'LineInput',
  description: 'Single-line text input field for student responses',
  component: _LineInput,
  fields,
  getValue: (props, state, id) => fieldSelector(state, { ...props, id }, fieldByName('value'), { fallback: '' }),
  attributes: baseAttributes.extend({
    min: z.string().optional().describe('Minimum allowed value (for numeric types)'),
    max: z.string().optional().describe('Maximum allowed value (for numeric types)'),
    step: z.string().optional().describe('Step increment (for numeric types)'),
    placeholder: z.string().optional().describe('Placeholder text shown when empty'),
    type: z.enum(INPUT_TYPES).optional().describe('HTML input type'),
  }),
});

export default LineInput;
