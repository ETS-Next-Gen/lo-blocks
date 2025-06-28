// src/components/blocks/Ref.jsx
import { core } from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import _Ref from './_Ref';

const Ref = core({
  ...parsers.ignore,
  name: 'Ref',
  component: _Ref,
  description: 'Render the value of another block\'s field.'
});

export default Ref;
