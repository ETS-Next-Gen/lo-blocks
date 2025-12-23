// src/components/blocks/ChoiceInput/Distractor.js
import { z } from 'zod';
import { core } from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import { srcAttributes } from '@/lib/blocks/attributeSchemas';
import _ChoiceItem from './_ChoiceItem.jsx';

const Distractor = core({
  ...parsers.text(),
  name: 'Distractor',
  description: 'Incorrect answer option inside ChoiceInput',
  component: _ChoiceItem,
  attributes: srcAttributes.extend({
    value: z.string().optional().describe('Value submitted when selected; defaults to element ID'),
  }),
});

export default Distractor;
