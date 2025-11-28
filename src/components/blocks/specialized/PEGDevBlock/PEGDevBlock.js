// src/components/blocks/PEGDevBlock/PEGDevBlock.js
import { dev } from '@/lib/blocks';
import { peggyParser } from '@/lib/content/parsers';
import * as dp  from './_demoParser.js'; // <-- Tweak this line
import { _PEGDevBlock } from './_PEGDevBlock';

const PEGDevBlock = dev({
  ...peggyParser(dp),
  name: 'PEGDevBlock',
  component: _PEGDevBlock,
  namespace: 'org.mitros.dev',
  description: 'Development workbench for creating and testing PEG grammars',
  internal: true
});

export default PEGDevBlock;
