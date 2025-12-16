// src/lib/grading/aggregators.ts
//
// Correctness aggregation strategies for combining results from multiple graders.
//
// This is the foundation of a grading subsystem. Different contexts need different
// aggregation strategies:
//
// - worstCaseCorrectness: Any wrong = wrong (strict, good for prerequisite skills)
// - allCorrectRequired: Must get everything right for credit (mastery-based)
// - proportionalCorrectness: Partial credit based on fraction correct
//
// Future strategies might include:
// - weightedCorrectness: Different items have different weights
// - itemResponseTheory: Statistical models for adaptive assessment
// - raschModel: Probabilistic measurement model
// - discountedCorrectness: Reduce credit after deadline or retries
//
// The goal is instructor-friendly aggregation that can express things like
// "assignment grade = all CapaProblems in this vertical" and support
// progress introspection.

import { CORRECTNESS } from '@/lib/blocks/correctness';

type CorrectnessValue = string;

interface AggregationCounts {
  correct: number;
  incorrect: number;
  partiallyCorrect: number;
  unsubmitted: number;
  submitted: number;
  incomplete: number;
  invalid: number;
  total: number;
}

/**
 * Count occurrences of each correctness state.
 * Useful for building custom aggregation logic.
 */
export function countCorrectness(values: CorrectnessValue[]): AggregationCounts {
  const counts: AggregationCounts = {
    correct: 0,
    incorrect: 0,
    partiallyCorrect: 0,
    unsubmitted: 0,
    submitted: 0,
    incomplete: 0,
    invalid: 0,
    total: values.length
  };

  for (const v of values) {
    switch (v) {
      case CORRECTNESS.CORRECT:
        counts.correct++;
        break;
      case CORRECTNESS.INCORRECT:
        counts.incorrect++;
        break;
      case CORRECTNESS.PARTIALLY_CORRECT:
        counts.partiallyCorrect++;
        break;
      case CORRECTNESS.UNSUBMITTED:
        counts.unsubmitted++;
        break;
      case CORRECTNESS.SUBMITTED:
        counts.submitted++;
        break;
      case CORRECTNESS.INCOMPLETE:
        counts.incomplete++;
        break;
      case CORRECTNESS.INVALID:
        counts.invalid++;
        break;
      default:
        // Unknown state - treat as unsubmitted for safety
        counts.unsubmitted++;
    }
  }

  return counts;
}

/**
 * Worst-case aggregation: returns the "worst" correctness state.
 *
 * Priority (worst to best):
 *   INVALID > UNSUBMITTED > INCOMPLETE > SUBMITTED > INCORRECT > PARTIALLY_CORRECT > CORRECT
 *
 * Use case: Strict prerequisite checking where any failure blocks progress.
 */
export function worstCaseCorrectness(values: CorrectnessValue[]): CorrectnessValue {
  if (!values || values.length === 0) {
    return CORRECTNESS.UNSUBMITTED;
  }

  const counts = countCorrectness(values);

  // Invalid blocks everything
  if (counts.invalid > 0) return CORRECTNESS.INVALID;

  // Any unsubmitted means not started
  if (counts.unsubmitted > 0) return CORRECTNESS.UNSUBMITTED;

  // Any incomplete means partially done
  if (counts.incomplete > 0) return CORRECTNESS.INCOMPLETE;

  // Any submitted but not graded means waiting
  if (counts.submitted > 0) return CORRECTNESS.SUBMITTED;

  // Any incorrect means incorrect (or partial if some correct)
  if (counts.incorrect > 0) {
    return counts.correct > 0 ? CORRECTNESS.PARTIALLY_CORRECT : CORRECTNESS.INCORRECT;
  }

  // Any partial means partial
  if (counts.partiallyCorrect > 0) return CORRECTNESS.PARTIALLY_CORRECT;

  // All correct
  return CORRECTNESS.CORRECT;
}

/**
 * Proportional aggregation: returns state based on fraction correct.
 *
 * - All correct → CORRECT
 * - All incorrect → INCORRECT
 * - Mixed → PARTIALLY_CORRECT
 * - Any unsubmitted/incomplete/submitted → that state (not final)
 *
 * Use case: Traditional grading where partial credit matters.
 */
export function proportionalCorrectness(values: CorrectnessValue[]): CorrectnessValue {
  if (!values || values.length === 0) {
    return CORRECTNESS.UNSUBMITTED;
  }

  const counts = countCorrectness(values);

  if (counts.invalid > 0) return CORRECTNESS.INVALID;
  if (counts.unsubmitted > 0) return CORRECTNESS.UNSUBMITTED;
  if (counts.incomplete > 0) return CORRECTNESS.INCOMPLETE;
  if (counts.submitted > 0) return CORRECTNESS.SUBMITTED;
  if (counts.correct === counts.total) return CORRECTNESS.CORRECT;
  if (counts.incorrect === counts.total) return CORRECTNESS.INCORRECT;

  return CORRECTNESS.PARTIALLY_CORRECT;
}

/**
 * Compute a numeric score (0-1) from correctness values.
 *
 * - CORRECT = 1
 * - PARTIALLY_CORRECT = 0.5 (could be customized)
 * - INCORRECT = 0
 * - UNSUBMITTED/INVALID = not counted
 *
 * Returns { score, attempted, total }
 */
export function computeScore(values: CorrectnessValue[]): { score: number; attempted: number; total: number } {
  if (!values || values.length === 0) {
    return { score: 0, attempted: 0, total: 0 };
  }

  let score = 0;
  let attempted = 0;
  const total = values.length;

  for (const v of values) {
    if (v === CORRECTNESS.CORRECT) {
      score += 1;
      attempted++;
    } else if (v === CORRECTNESS.PARTIALLY_CORRECT) {
      score += 0.5;
      attempted++;
    } else if (v === CORRECTNESS.INCORRECT) {
      attempted++;
    }
    // UNSUBMITTED and INVALID don't count as attempted
  }

  return {
    score: attempted > 0 ? score / total : 0,
    attempted,
    total
  };
}

/**
 * Format score for display (e.g., "2/3" or "67%")
 */
export function formatScore(
  values: CorrectnessValue[],
  format: 'fraction' | 'percent' = 'fraction'
): string {
  const counts = countCorrectness(values);
  const answered = counts.correct + counts.incorrect + counts.partiallyCorrect;

  if (format === 'percent') {
    const pct = counts.total > 0 ? Math.round((counts.correct / counts.total) * 100) : 0;
    return `${pct}%`;
  }

  return `${counts.correct}/${counts.total}`;
}
