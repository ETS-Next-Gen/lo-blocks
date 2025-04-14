// src/components/blocks/input/inputHelpers.js

import * as lo_event from 'lo_event';
import { UPDATE_INPUT } from 'lo_event/lo_event/lo_assess/reducers.js';

export function handleInputChange(id) {
  return event => {
    lo_event.logEvent(UPDATE_INPUT, {
      id,
      value: event.target.value,
      selectionStart: event.target.selectionStart,
      selectionEnd: event.target.selectionEnd,
    });
  };
}

export function fixCursor(id, selectionStart, selectionEnd) {
  return () => {
    const input = document.getElementsByName(id);
    if (input && input[0]) {
      input[0].setSelectionRange(selectionStart, selectionEnd);
    }
  };
}