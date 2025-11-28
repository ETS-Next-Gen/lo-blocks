// src/components/blocks/_Correctness.jsx
'use client';
import React from 'react';
import { CORRECTNESS } from '@/lib/blocks';
import { useFieldSelector } from '@/lib/state';
import { inferRelatedNodes } from '@/lib/blocks/olxdom';
import { DisplayError } from '@/lib/util/debug';

function _Correctness(props) {
  const { id, target, infer, fields } = props;
  const ids = inferRelatedNodes(props, {
    selector: n => n.blueprint?.isGrader,
    infer,
    targets: target
  });
  const targetId = ids[0];

  if (!targetId) {
    return (
      <DisplayError
        props={props}
        id={`${id}_no_grader`}
        name="Correctness"
        message="No grader found. Correctness indicator needs a grader block (with isGrader=true)."
        technical={{
          hint: 'Correctness looks for graders in parent/child nodes. Use inside CapaProblem, or specify a target="grader_id".',
          target: target || '(none specified)',
          infer: infer ?? 'default (parents, kids)',
          blockId: id
        }}
      />
    );
  }

  const correctness = useFieldSelector(
    props,
    fields.correct,
    {
      selector: s => s?.correct ?? CORRECTNESS.UNSUBMITTED,
      fallback: CORRECTNESS.UNSUBMITTED,
      id: targetId
    }
  );

  const icons = {
    [CORRECTNESS.CORRECT]: '✅',
    [CORRECTNESS.PARTIALLY_CORRECT]: '🟡',
    [CORRECTNESS.INCORRECT]: '❌',
    [CORRECTNESS.INCOMPLETE]: '⚠️',
    [CORRECTNESS.INVALID]: '⚠️',
    [CORRECTNESS.SUBMITTED]: '⏳',
    [CORRECTNESS.UNSUBMITTED]: '❔'
  };

  return <span>{icons[correctness] || icons[CORRECTNESS.UNSUBMITTED]}</span>;
}

export default _Correctness;
