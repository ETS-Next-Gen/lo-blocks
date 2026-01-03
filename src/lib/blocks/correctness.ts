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
  UNSUBMITTED: 'unsubmitted',                 // User has not encountered the problem, or hasn't hit submit yet
  SUBMITTED: 'submitted',                     // Submitted. If going to human grading, running test cases, or an LLM, we're waiting...
  CORRECT: 'correct',
  PARTIALLY_CORRECT: 'partially-correct',
  INCORRECT: 'incorrect',
  INCOMPLETE: 'incomplete',                   // Partial submission. E.g. 1 out of 3 blanks in a multi-part problem. We don't grade.
  INVALID: 'invalid'                          // Invalid submission. E.g. "Hello" in a numeric. Usually a typo. We don't grade / deduct, but just show feedback
};

// TODO / HACK / BUG:
// export const DONENESS = { ... } (or COMPLETION?)
/*
Long-term:
- Correctness and completion are different concepts.

Short-term:
- We could implement Doneness
- We could return CORRECT with score 1 and mark HACK / TODO / BUG

Doneness indicates e.g.
- Deadline passed -- submission no longer required
- Task completed, but ungraded
- Etc.

A lot of Doneness feeds into:
- Active TODO lists (here's what's due this week!)
- Moving onto another screen (survey isn't graded, but we need the output to feed into the activity coming up!)
- Progress indicators (You've done 65% of the course!)

It also has complex states, as the deadline passed example illustrates. A TODO list should not have things the student CAN'T do. However, an "on-track" indicator would see those as not done.

Right now, a lot of the code has hacks were correctness does double-duty. These should be fixed in due course.
*/

// Derived utilities - single source of truth
const ALL_STATES = new Set(Object.values(CORRECTNESS));

/**
 * Check if a value is a valid correctness state.
 */
export function isValidCorrectness(value) {
  return ALL_STATES.has(value);
}

/**
 * Validate a correctness value. Throws on invalid state (fail-fast).
 */
export function validateCorrectness(value) {
  if (!ALL_STATES.has(value)) {
    const valid = Array.from(ALL_STATES).join(', ');
    throw new Error(`Invalid correctness value: "${value}". Valid values: ${valid}`);
  }
}

/**
 * Get all valid correctness states.
 */
export function getAllCorrectnessStates() {
  return ALL_STATES;
}

/**
 * Ordering for worst-case aggregation (lower = worse).
 * Used by grading aggregators to determine priority.
 */
export const CORRECTNESS_PRIORITY = {
  [CORRECTNESS.INVALID]: 0,
  [CORRECTNESS.UNSUBMITTED]: 1,
  [CORRECTNESS.INCOMPLETE]: 2,
  [CORRECTNESS.SUBMITTED]: 3,
  [CORRECTNESS.INCORRECT]: 4,
  [CORRECTNESS.PARTIALLY_CORRECT]: 5,
  [CORRECTNESS.CORRECT]: 6,
};

/**
 * Visibility handlers for conditional content (Explanation, Answer, etc.)
 *
 * Open edX supports these show_answer options:
 * - "always"                      - Always show
 * - "answered"                    - After valid submission (not unsubmitted or invalid)
 * - "attempted"                   - Alias for answered
 * - "correct"                     - Only when correct
 * - "never"                       - Never show
 *
 * Future (require additional CapaProblem-level state):
 * - "closed"                      - When problem is closed
 * - "finished"                    - When course/section is finished
 * - "past_due"                    - After due date
 * - "correct_or_past_due"         - When correct OR past due
 * - "after_all_attempts"          - After max attempts used
 * - "after_all_attempts_or_correct" - After all attempts OR correct
 * - "attempted_no_past_due"       - Attempted but not past due
 */
export const VISIBILITY_HANDLERS = {
  always: () => true,
  never: () => false,
  answered: ({ correctness }) =>
    correctness !== CORRECTNESS.UNSUBMITTED && correctness !== CORRECTNESS.INVALID,
  attempted: ({ correctness }) =>
    correctness !== CORRECTNESS.UNSUBMITTED && correctness !== CORRECTNESS.INVALID,
  correct: ({ correctness }) => correctness === CORRECTNESS.CORRECT,
};

/**
 * Compute visibility based on showWhen option and problem state.
 *
 * @param {string} showWhen - Visibility option (must be key in VISIBILITY_HANDLERS)
 * @param {Object} state - Problem state
 * @param {string} state.correctness - Current CORRECTNESS state from grader
 * @returns {boolean} - Whether content should be visible
 * @throws {Error} - If showWhen is not a valid option
 */
export function computeVisibility(showWhen, { correctness /* dueDate, attempts, maxAttempts */ }: { correctness?: string } = {}) {
  const handler = VISIBILITY_HANDLERS[showWhen];
  if (!handler) {
    const validOptions = Object.keys(VISIBILITY_HANDLERS).join(', ');
    throw new Error(`Invalid showWhen="${showWhen}". Valid options: ${validOptions}`);
  }
  return handler({ correctness });
}

