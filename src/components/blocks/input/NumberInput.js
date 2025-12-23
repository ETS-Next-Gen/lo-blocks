// src/components/blocks/NumberInput.js
import { z } from 'zod';
import { core } from '@/lib/blocks';
import * as state from '@/lib/state';
import { fieldSelector, fieldByName } from '@/lib/state';
import * as parsers from '@/lib/content/parsers';
import { srcAttributes } from '@/lib/blocks/attributeSchemas';
import _NumberInput from './_NumberInput';

export const fields = state.fields(['value']);

const NumberInput = core({
  ...parsers.text(),
  name: 'NumberInput',
  description: 'Numeric input field that parses and validates numerical values',
  component: _NumberInput,
  fields,
  // TODO: Figure out this signature. In the generic, we'll probably need
  // more than this. It might be dependent on the component spec, etc.
  getValue: (props, state, id) => {
    const v = fieldSelector(state, { ...props, id }, fieldByName('value'));
    return v === undefined ? undefined : parseFloat(v);
  },
  attributes: srcAttributes.extend({
    min: z.string().optional().describe('Minimum allowed value'),
    max: z.string().optional().describe('Maximum allowed value'),
    step: z.string().optional().describe('Step increment for value changes'),
    placeholder: z.string().optional().describe('Placeholder text shown when empty'),
  }),
});

export default NumberInput;
