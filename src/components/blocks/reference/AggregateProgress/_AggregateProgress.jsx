// src/components/blocks/reference/_AggregateProgress.jsx
'use client';

import React from 'react';
import { CORRECTNESS, inferRelatedNodes } from '@/lib/blocks';
import { DisplayError } from '@/lib/util/debug';
import { fieldByName, useAggregate } from '@/lib/state';

const correctnessField = fieldByName('correct');

function isGraded(value) {
  return value !== null && value !== undefined && value !== CORRECTNESS.UNSUBMITTED;
}

export default function _AggregateProgress(props) {
  const {
    id,
    infer,
    label = 'Progress',
    targets,
    target,
    fields,
  } = props;

  const requestedTargets = targets ?? target;
  const targetIds = inferRelatedNodes(props, {
    selector: (node) => node.blueprint?.isGrader,
    infer,
    targets: requestedTargets,
  });

  if (!targetIds.length) {
    return (
      <DisplayError
        props={props}
        id={`${id}_no_targets`}
        name="AggregateProgress"
        message="No grader blocks found to aggregate."
        technical={{
          hint: 'Add grader blocks (isGrader=true) or provide explicit targets="id1,id2".',
          infer: infer ?? 'default (parents + kids when no targets)',
          targets: requestedTargets ?? '(none provided)',
        }}
      />
    );
  }

  const targetField = fields?.correct ?? correctnessField;
  if (!targetField) {
    return (
      <DisplayError
        props={props}
        id={`${id}_missing_field`}
        name="AggregateProgress"
        message="Could not find the 'correct' field definition."
        technical={{
          hint: 'Ensure a grader block has registered the "correct" field.',
        }}
      />
    );
  }

  const { correct, partiallyCorrect, graded, total } = useAggregate(props, targetIds, {
    field: targetField,
    fallback: CORRECTNESS.UNSUBMITTED,
    selector: (values) => {
      const gradedValues = values.filter(isGraded);
      const correctCount = gradedValues.filter((v) => v === CORRECTNESS.CORRECT).length;
      const partialCount = gradedValues.filter((v) => v === CORRECTNESS.PARTIALLY_CORRECT).length;
      return {
        total: targetIds.length,
        graded: gradedValues.length,
        correct: correctCount,
        partiallyCorrect: partialCount,
      };
    },
  });

  const remaining = Math.max(total - graded, 0);
  const maxValue = Math.max(total, 1);
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="lo-aggregate-progress">
      <div className="lo-aggregate-progress__summary">
        <strong>{label}</strong>
        <span className="lo-aggregate-progress__ratio">{correct}/{total} correct</span>
      </div>
      <progress
        className="lo-aggregate-progress__bar"
        value={correct}
        max={maxValue}
        aria-label={`${label}: ${percent}% correct`}
      />
      <div className="lo-aggregate-progress__details">
        <span>{graded} graded</span>
        {partiallyCorrect > 0 && (
          <span>{partiallyCorrect} partially correct</span>
        )}
        <span>{remaining} remaining</span>
      </div>
    </div>
  );
}