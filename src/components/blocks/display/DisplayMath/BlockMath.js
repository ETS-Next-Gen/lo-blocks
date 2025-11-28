// src/components/blocks/DisplayMath/BlockMath.js
import { core } from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';

import { _BlockMath } from './_BlockMath.jsx';

const BlockMath = core({
  ...parsers.text(),
  name: 'BlockMath',
  component: _BlockMath,
  description: 'Displays a centered LaTeX math equation as a block element.'
});

export default BlockMath;
