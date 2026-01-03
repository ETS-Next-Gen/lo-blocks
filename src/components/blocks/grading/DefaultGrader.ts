// src/components/blocks/grading/DefaultGrader.js
//
// Catch-all grader that accepts any answer with specified score/feedback.
//
// Usage:
//   <DefaultGrader score="1" feedback="Any answer is accepted!">
//     <LineInput/>
//   </DefaultGrader>
//
// Also creates DefaultMatch for use inside RulesGrader:
//   <RulesGrader>
//     <StringMatch answer="correct" score="1"/>
//     <DefaultMatch score="0" feedback="Try again"/>
//     <LineInput/>
//   </RulesGrader>
//
import { createGrader } from '@/lib/blocks';
import { CORRECTNESS } from '@/lib/blocks/correctness';

/**
 * Default always "matches" any non-empty input.
 */
function gradeDefault(props, { input }) {
  if (input === undefined || input === null || input === '') {
    return { correct: CORRECTNESS.UNSUBMITTED, message: '' };
  }

  // Always match - RulesGrader will use score/feedback from attributes
  return {
    correct: CORRECTNESS.CORRECT,
    message: props.feedback || '',
  };
}

const DefaultGrader = createGrader({
  base: 'Default',
  description: 'Catch-all grader that accepts any answer with specified score/feedback',
  grader: gradeDefault,
  attributes: {
    // No answer required - Default matches everything
  },
  getDisplayAnswer: () => undefined,
});

export default DefaultGrader;
