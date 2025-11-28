// src/components/blocks/ChoiceInput/Key.js
import { core } from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import _ChoiceItem from './_ChoiceItem.jsx';

const Key = core({
  ...parsers.text(),
  name: 'Key',
  description: 'Correct answer option inside ChoiceInput',
  component: _ChoiceItem,
});

export default Key;
