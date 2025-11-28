// src/components/blocks/_StatusText.jsx
'use client';
import React from 'react';
import * as state from '@/lib/state';
import { useFieldSelector } from '@/lib/state';
import { inferRelatedNodes } from '@/lib/blocks/olxdom';
import { DisplayError } from '@/lib/util/debug';

function _StatusText(props) {
  const { id, target, infer, field = 'message' } = props;
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
        name="StatusText"
        message="No grader found. StatusText needs a grader block (with isGrader=true) to display feedback."
        technical={{
          hint: 'StatusText looks for graders in parent/child nodes. Use inside CapaProblem, or specify a target="grader_id".',
          target: target || '(none specified)',
          infer: infer ?? 'default (parents, kids)',
          blockId: id
        }}
      />
    );
  }

  // Get the field from the target component (not from our own fields)
  const targetField = state.componentFieldByName(props, targetId, field);

  const text = useFieldSelector(
    props,
    targetField,
    { selector: s => s?.[field] ?? '', fallback: '', id: targetId }
  );
  return <span>{text}</span>;
}

export default _StatusText;
