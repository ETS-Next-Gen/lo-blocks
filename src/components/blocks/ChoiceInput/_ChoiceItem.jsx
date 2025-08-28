// src/components/blocks/ChoiceInput/_ChoiceItem.jsx
'use client';

import React, { useMemo } from 'react';
import { useFieldSelector, updateReduxField } from '@/lib/state';
import { inferRelatedNodes, splitFeedbackFromKids } from '@/lib/blocks/olxdom';
import { fields as choiceFields } from './ChoiceInput';
import { fields as graderFields } from './KeyGrader';
import { renderCompiledKids } from '@/lib/render';
import { DisplayError } from '@/lib/util/debug';
import { renderBlock } from '@/lib/renderHelpers';
import { CORRECTNESS } from '@/lib/blocks';

export default function _ChoiceItem(props) {
  const { feedbackNode, kids } = splitFeedbackFromKids(props);
  const feedbackId = feedbackNode.id;

  // TODO this ought to use our helpers for determining the feedbac
  const parentIds = useMemo(() => {
    return inferRelatedNodes(props, {
      selector: n => n?.blueprint?.name === 'ChoiceInput',
      infer: ['parents']
    });
  // props intentionally omitted: structural relationships are stable once rendered, so we need
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const graderIds = useMemo(() => {
    return inferRelatedNodes(props, {
      selector: n => n?.blueprint?.name === 'KeyGrader',
      infer: ['parents']
    });
  // props intentionally omitted: structural relationships are stable once rendered, so we need
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Make sure there is only one parent
  const parentId = parentIds[0];
  const graderId = graderIds[0];
  if (!parentId) {
    return (
      <DisplayError name="ChoiceItem" message="No parent ChoiceInput found" data={{ id: props.id }} />
    );
  }

  const selected = useFieldSelector(
    props,
    choiceFields.fieldInfoByField.value,
    { id: parentId, fallback: '' }
  );

  const correctness = useFieldSelector(
    props,
    graderFields.fieldInfoByField.correct,
    { id: graderId, fallback: CORRECTNESS.UNSUBMITTED }
  );
  const checked = selected === props.id;

  const handleChange = () => {
    updateReduxField(props, choiceFields.fieldInfoByField.value, props.id, { id: parentId });
    if (graderId) {
      updateReduxField(
        props,
        graderFields.fieldInfoByField.correct,
        CORRECTNESS.UNSUBMITTED,
        { id: graderId }
      );
    }
  };

  return (
    <label className="block">
      <input
        type="radio"
        name={parentId}
        checked={checked}
        onChange={handleChange}
       />
      {renderCompiledKids({ ...props, kids })}
      {feedbackNode && (
        <div className="mt-1">
          {renderBlock(props,'Feedback', { id: feedbackId, visible: checked && correctness !== CORRECTNESS.UNSUBMITTED }, feedbackNode.kids)}
        </div>
      )}
    </label>
  );
}
