// src/lib/blocks/correctness.js
//
// Correctness constants - standardized states for learning assessment.
//
// Defines the possible correctness/completion states that blocks can have,
// following educational technology conventions (similar to edX/LON-CAPA).
// These states are used by grader blocks to indicate student progress and
// are logged to the learning analytics system for tracking.
//
// For examples, states submitted for peer grading might form a
// progression from unsubmitted → submitted → correct/incorrect, with
// additional states for partial credit and validation errors.

export const CORRECTNESS = {
  UNSUBMITTED: 'unsubmitted',
  SUBMITTED: 'submitted',
  CORRECT: 'correct',
  PARTIALLY_CORRECT: 'partially-correct',
  INCORRECT: 'incorrect',
  INCOMPLETE: 'incomplete',
  INVALID: 'invalid'
};

