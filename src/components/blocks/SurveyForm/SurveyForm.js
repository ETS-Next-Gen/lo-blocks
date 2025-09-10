// src/components/blocks/SurveyForm/SurveyForm.js
import { core } from '@/lib/blocks';
import * as state from '@/lib/state';
import { valueSelector, fieldSelector, updateReduxField } from '@/lib/state';
import * as parsers from '@/lib/content/parsers';
import { getKidsBFS } from '@/lib/blocks/olxdom';
import _SurveyForm from './_SurveyForm';

export const fields = state.fields([
  'currentResponses',    // Live editing state
  'submittedResponses',  // Frozen submitted state
  'submissionCount'      // Track resubmissions
]);

// Helper function to check if a block is an input
const isInput = (blueprint) => {
  return blueprint?.getValue !== undefined;
};

const SurveyForm = core({
  // BLUEPRINT: System-visible, serverside-safe, analytics-friendly
  ...parsers.blocks(),
  name: 'SurveyForm',
  description: 'Survey form with dual state: current editing + submitted responses',
  component: _SurveyForm,
  fields,

  // System contract - analytics and server-side processing can use this
  getValue: (props, state, id) => {
    return fieldSelector(state, { ...props, id }, fields.fieldInfoByField.submittedResponses, { fallback: {} });
  }

}, {
  // LOCALS: Block author's private implementation space
  // TODO: We might want to organize locals later (e.g. locals.handlers, locals.utils, etc.)

  findInputs: (props) => {
    // Walk OLX DOM at render time to find inputs dynamically
    return getKidsBFS(props.nodeInfo, {
      selector: n => isInput(n.blueprint)
    });
  },

  submit: async (props) => {
    const reduxLogger = await import('lo_event/lo_event/reduxLogger.js');
    const state = reduxLogger.store.getState();

    // Find all input components in this survey
    const inputNodeInfos = getKidsBFS(props.nodeInfo, {
      selector: n => isInput(n.blueprint)
    });

    const currentValues = {};
    inputNodeInfos.forEach(nodeInfo => {
      const inputId = nodeInfo.node.id;
      // Use our unified valueSelector to get current values
      currentValues[inputId] = valueSelector(props, state, inputId, { fallback: '' });
    });

    // Store submitted snapshot using system field management
    updateReduxField(props, fields.fieldInfoByField.submittedResponses, currentValues);

    // Increment submission count
    const currentCount = fieldSelector(state, props, fields.fieldInfoByField.submissionCount, { fallback: 0 });
    updateReduxField(props, fields.fieldInfoByField.submissionCount, currentCount + 1);
  },

  canResubmit: (props) => {
    // Allow resubmit unless explicitly disabled
    return props.attributes?.allowResubmit !== 'false';
  },

  getSubmissionStatus: (props) => {
    const reduxLogger = require('lo_event/lo_event/reduxLogger.js');
    const state = reduxLogger.store.getState();

    const submissionCount = fieldSelector(state, props, fields.fieldInfoByField.submissionCount, { fallback: 0 });
    const submittedResponses = fieldSelector(state, props, fields.fieldInfoByField.submittedResponses, { fallback: {} });

    return {
      submitted: submissionCount > 0,
      count: submissionCount,
      responses: submittedResponses
    };
  }
});

export default SurveyForm;