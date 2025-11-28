// src/components/blocks/ChoiceInput/Distractor.js
import { core } from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import _ChoiceItem from './_ChoiceItem.jsx';

const Distractor = core({
  ...parsers.text(),
  name: 'Distractor',
  description: 'Incorrect answer option inside ChoiceInput',
  component: _ChoiceItem,
});

export default Distractor;
