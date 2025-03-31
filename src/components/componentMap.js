import { debug, Trace } from '@/lib/debug';

import { render } from '@/lib/render';

import TextBlock from '@/components/blocks/TextBlock';
import QuestionBlock from '@/components/blocks/QuestionBlock';
import ProblemBlock from '@/components/blocks/ProblemBlock';
import Lesson from '@/components/blocks/Lesson';

// Block registry
export const COMPONENT_MAP = {
  TextBlock,
  QuestionBlock,
  Lesson,
  ProblemBlock
};
