// src/components/blocks/display/Explanation/_Explanation.jsx
'use client';
import React from 'react';
import * as state from '@/lib/state';
import { useFieldSelector } from '@/lib/state';
import { CORRECTNESS, VISIBILITY_HANDLERS, computeVisibility } from '@/lib/blocks';
import { inferRelatedNodes } from '@/lib/blocks/olxdom';
import { renderCompiledKids } from '@/lib/render';
import { DisplayError } from '@/lib/util/debug';

/**
 * Explanation displays its children conditionally based on grader state.
 *
 * showWhen options (see VISIBILITY_HANDLERS):
 * - "correct": Show when answer is correct
 * - "answered": Show after valid submission (not invalid)
 * - "attempted": Alias for answered
 * - "always": Always show (useful for debugging)
 * - "never": Never show (hide explanation)
 *
 * Default should be inherited from CapaProblem; currently defaults to 'correct'.
 */
function _Explanation(props) {
  // TODO: Inherit default showWhen from parent CapaProblem
  const { id, kids = [], target, infer, showWhen = 'correct', title } = props;

  // Find related grader
  const graderIds = inferRelatedNodes(props, {
    selector: n => n.blueprint?.isGrader,
    infer,
    targets: target
  });
  const targetId = graderIds[0];

  // Fail fast if no grader found
  if (!targetId) {
    return (
      <DisplayError
        props={props}
        id={`${id}_no_grader`}
        name="Explanation"
        message="No grader found. Explanation must be nested inside a grader."
        technical={{
          hint: 'Place Explanation inside a grader block (e.g., NumericalGrader, KeyGrader).',
          target: target || '(none specified)',
          infer: infer ?? 'default (parents, kids)',
          blockId: id
        }}
      />
    );
  }

  let correctness = CORRECTNESS.UNSUBMITTED;
  try {
    const correctField = state.componentFieldByName(props, targetId, 'correct');
    correctness = useFieldSelector(
      props,
      correctField,
      { id: targetId, fallback: CORRECTNESS.UNSUBMITTED, selector: s => s?.correct }
    );
    if (correctness == null) correctness = CORRECTNESS.UNSUBMITTED;
  } catch (e) {
    correctness = CORRECTNESS.UNSUBMITTED;
  }

  // Validate showWhen and compute visibility (throws on invalid option)
  if (!VISIBILITY_HANDLERS[showWhen]) {
    const validOptions = Object.keys(VISIBILITY_HANDLERS).join(', ');
    return (
      <DisplayError
        props={props}
        id={`${id}_invalid_showWhen`}
        name="Explanation"
        message={`Invalid showWhen="${showWhen}".`}
        technical={{
          hint: `Valid options: ${validOptions}`,
          blockId: id
        }}
      />
    );
  }

  if (!computeVisibility(showWhen, { correctness })) {
    return null;
  }

  const heading = title || 'Explanation';

  return (
    <div className="lo-explanation border-l-4 border-blue-500 bg-blue-50 p-4 my-4 rounded-r">
      <div className="lo-explanation__header font-semibold text-blue-800 mb-2">
        {heading}
      </div>
      <div className="lo-explanation__content text-gray-700">
        {renderCompiledKids({ ...props, kids })}
      </div>
    </div>
  );
}

export default _Explanation;
