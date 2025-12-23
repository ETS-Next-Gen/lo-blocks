// src/components/blocks/layout/Collapsible/Collapsible.js

import { z } from 'zod';
import { dev } from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import * as state from '@/lib/state';
import { fieldSelector, fieldByName } from '@/lib/state';
import { baseAttributes } from '@/lib/blocks/attributeSchemas';
import _Collapsible from './_Collapsible';

export const fields = state.fields(['expanded']);

const Collapsible = dev({
  ...parsers.blocks(),
  name: 'Collapsible',
  description: 'Collapsible section with expandable/collapsible content',
  component: _Collapsible,
  fields: fields,
  getValue: (props, state, id) => {
    const expanded = fieldSelector(state, props, fieldByName('expanded'), { fallback: false, id });
    return { expanded };
  },
  attributes: baseAttributes.extend({
    label: z.string().optional().describe('Header text for the collapsible section (alias for title)'),
  }),
});

export default Collapsible;
