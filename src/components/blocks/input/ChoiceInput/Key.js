// src/components/blocks/ChoiceInput/Key.js
import { z } from 'zod';
import { core } from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import { srcAttributes } from '@/lib/blocks/attributeSchemas';
import _ChoiceItem from './_ChoiceItem.jsx';

const Key = core({
  ...parsers.text(),
  name: 'Key',
  description: 'Correct answer option inside ChoiceInput',
  component: _ChoiceItem,
  attributes: srcAttributes.extend({
    value: z.string().optional().describe('Value submitted when selected; defaults to element ID'),
  }),
});

export default Key;
