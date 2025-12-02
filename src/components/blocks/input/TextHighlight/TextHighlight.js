// src/components/blocks/TextHighlight/TextHighlight.js
import { core } from '@/lib/blocks';
import * as state from '@/lib/state';
import { fieldSelector, fieldByName } from '@/lib/state';
import * as blocks from '@/lib/blocks';
import { peggyParser } from '@/lib/content/parsers';
import * as parser from './_textHighlightParser.js';
import _TextHighlight from './_TextHighlight';

export const fields = state.fields([
  'value',      // Set of selected word indices
  'attempts',   // Number of check attempts
  'feedback',   // Current feedback message
  'showAnswer', // Whether answer is revealed (self_check mode)
  'checked',    // Whether graded mode has been checked
  'score'       // Current score
]);

const TextHighlight = core({
  ...peggyParser(parser),
  ...blocks.input({
    getValue: (props, state, id) => {
      const selections = fieldSelector(state, props, fieldByName('value'), { fallback: [], id });
      const attempts = fieldSelector(state, props, fieldByName('attempts'), { fallback: 0, id });
      const score = fieldSelector(state, props, fieldByName('score'), { fallback: 0, id });
      return { selections, attempts, score };
    }
  }),
  ...blocks.grader({
    grader: (props, { input }) => {
      // This would be called by an ActionButton
      // The actual grading logic is in the component
      return input?.correct || blocks.CORRECTNESS.UNGRADED;
    }
  }),
  name: 'TextHighlight',
  description: 'Interactive text highlighting exercise with feedback',
  component: _TextHighlight,
  fields
});

export default TextHighlight;