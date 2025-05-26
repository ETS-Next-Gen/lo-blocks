import * as parsers from '@/lib/olx/parsers';
import * as blocks from '@/lib/blocks';

export const fields = blocks.fields(
  ['activeIndex']
);

import { _QuestionBlock } from './_QuestionBlock';


const QuestionBlock = blocks.test({
  name: 'QuestionBlock',
  component: _QuestionBlock,
  parser: parsers.ignore,
  fieldToEventMap: fields
});

export default QuestionBlock;
