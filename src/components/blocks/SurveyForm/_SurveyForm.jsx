'use client';

import React from 'react';
import { renderCompiledKids } from '@/lib/render';
import { useFieldSelector } from '@/lib/state';

function _SurveyForm(props) {
  const { locals, blueprint } = props;

  // Get submission status using system contract (blueprint)
  const submissionData = useFieldSelector(props, blueprint.fields.fieldInfoByField.submissionCount, { fallback: 0 });
  const submittedResponses = useFieldSelector(props, blueprint.fields.fieldInfoByField.submittedResponses, { fallback: {} });

  const handleSubmit = () => {
    if (locals?.submit) {
      locals.submit(props);
    }
  };

  const canResubmit = locals?.canResubmit ? locals.canResubmit(props) : true;
  const hasSubmitted = submissionData > 0;

  return (
    <div className="survey-form">
      {renderCompiledKids(props)}
      <div className="survey-controls">
        <button
          onClick={handleSubmit}
          disabled={hasSubmitted && !canResubmit}
          className="survey-submit-btn"
        >
          {hasSubmitted ? `Resubmit (${submissionData} times)` : 'Submit Survey'}
        </button>
        {hasSubmitted && (
          <div className="submission-status">
            Last submitted responses saved
          </div>
        )}
      </div>
    </div>
  );
}

export default _SurveyForm;