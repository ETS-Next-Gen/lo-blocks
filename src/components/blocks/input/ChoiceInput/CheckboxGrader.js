// src/components/blocks/ChoiceInput/CheckboxGrader.js
//
// Grader for multi-select (checkbox) questions.
// For single-select (radio button) questions, use KeyGrader instead.
//
// Supports two grading modes:
// - All-or-nothing (default): all Keys must be selected, no Distractors
// - Partial credit (partialCredit="true"): score = (keysSelected - distractorsSelected) / totalKeys
//
import * as parsers from '@/lib/content/parsers';
import * as blocks from '@/lib/blocks';
import { getInputs } from '@/lib/blocks/olxdom';
import _Noop from '@/components/blocks/layout/_Noop';
import * as state from '@/lib/state';
import { CORRECTNESS } from '@/lib/blocks/correctness.js';

export const fields = state.fields(['correct', 'message']);

/**
 * Grade multi-select (checkbox) choice.
 *
 * @param {string[]} selected - Array of selected values
 * @param {Array<{tag: string, value: string}>} choices - All choices
 * @param {Object} options - Grading options
 * @param {boolean} options.partialCredit - If true, award partial credit (n/m scoring)
 * @returns {{correct: string, message: string, score?: number}}
 */
function gradeCheckboxes(selected, choices, options = {}) {
  const { partialCredit = false } = options;
  const selectedSet = new Set(Array.isArray(selected) ? selected : []);
  const keys = choices.filter(c => c.tag === 'Key');
  const distractors = choices.filter(c => c.tag === 'Distractor');

  // Count correct and incorrect selections
  const keysSelected = keys.filter(k => selectedSet.has(k.value)).length;
  const distractorsSelected = distractors.filter(d => selectedSet.has(d.value)).length;

  const allKeysSelected = keysSelected === keys.length;
  const noDistractorsSelected = distractorsSelected === 0;

  // All-or-nothing: must select all keys and no distractors
  if (allKeysSelected && noDistractorsSelected) {
    return { correct: CORRECTNESS.CORRECT, message: '', score: 1 };
  }

  if (!partialCredit) {
    // All-or-nothing mode: anything less than perfect is incorrect
    return { correct: CORRECTNESS.INCORRECT, message: '', score: 0 };
  }

  // Partial credit mode: score = (keysSelected - distractorsSelected) / totalKeys
  // Clamped to [0, 1] range
  const totalKeys = keys.length;
  if (totalKeys === 0) {
    // Edge case: no keys defined
    return { correct: CORRECTNESS.INCORRECT, message: '', score: 0 };
  }

  const rawScore = (keysSelected - distractorsSelected) / totalKeys;
  const score = Math.max(0, Math.min(1, rawScore));

  if (score === 0) {
    return { correct: CORRECTNESS.INCORRECT, message: '', score };
  } else if (score === 1) {
    return { correct: CORRECTNESS.CORRECT, message: '', score };
  } else {
    return { correct: CORRECTNESS.PARTIALLY_CORRECT, message: `${keysSelected}/${totalKeys} correct`, score };
  }
}

function gradeCheckboxSelected(props, { input, inputApi }) {
  const selected = input ?? [];
  const choices = inputApi.getChoices();
  const partialCredit = props.partialCredit === true || props.partialCredit === 'true';
  return gradeCheckboxes(selected, choices, { partialCredit });
}

/**
 * Find all correct answer values by looking for Key choices.
 * Returns an array of values.
 */
function getCheckboxDisplayAnswer(props) {
  // If explicit answer/displayAnswer provided, use that
  if (props.displayAnswer != null) return props.displayAnswer;
  if (props.answer != null) return props.answer;

  // Otherwise, find all Key choices from the input
  try {
    const inputIds = getInputs(props);
    if (inputIds.length === 0) return null;

    const inputId = inputIds[0];
    const inputNode = props.idMap?.[inputId];
    const inputBlueprint = inputNode ? props.componentMap?.[inputNode.tag] : null;

    // Use getChoices() if available
    if (inputBlueprint?.locals?.getChoices) {
      const inputProps = { ...props, id: inputId, ...inputNode?.attributes, kids: inputNode?.kids };
      const choices = inputBlueprint.locals.getChoices(inputProps);
      const keyChoices = choices.filter(c => c.tag === 'Key');
      return keyChoices.map(k => k.value);
    }
  } catch (e) {
    // No inputs found or error - return null
  }
  return null;
}

const CheckboxGrader = blocks.test({
  ...parsers.blocks.allowHTML(),
  ...blocks.grader({ grader: gradeCheckboxSelected }),
  name: 'CheckboxGrader',
  description: 'Grades checkbox selections - all Keys must be selected and no Distractors. Use partialCredit="true" for n/m scoring.',
  category: 'grading',
  component: _Noop,
  fields,
  getDisplayAnswer: getCheckboxDisplayAnswer,
});

export default CheckboxGrader;
