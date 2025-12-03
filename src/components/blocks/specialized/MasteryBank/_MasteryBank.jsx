// src/components/blocks/specialized/MasteryBank/_MasteryBank.jsx
'use client';

import React, { useMemo } from 'react';
import { render } from '@/lib/render';
import { useReduxState, useFieldSelector, componentFieldByName } from '@/lib/state';
import { CORRECTNESS } from '@/lib/blocks';

/**
 * Fisher-Yates shuffle with seeded random for reproducibility
 */
function shuffleArray(array, seed = Date.now()) {
  const result = [...array];
  let m = result.length;

  // Simple seeded random
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (m) {
    const i = Math.floor(random() * m--);
    [result[m], result[i]] = [result[i], result[m]];
  }
  return result;
}

/**
 * Inner component that renders when we have a valid problem ID.
 * This allows us to call useFieldSelector unconditionally.
 */
function MasteryProblem({ props, currentProblemId, currentIndex, problemIds, correctStreak, goalNum, setCurrentIndex, setCorrectStreak, setShuffledOrder, setCompleted }) {
  const { idMap } = props;

  // Watch the current problem's grader correctness state
  // The grader ID follows the convention: problemId + "_grader"
  const graderId = `${currentProblemId}_grader`;
  const graderField = componentFieldByName(props, graderId, 'correct');

  const currentCorrectness = useFieldSelector(
    props,
    graderField,
    {
      id: graderId,
      fallback: CORRECTNESS.UNSUBMITTED,
      selector: s => s?.correct
    }
  );

  // Handle next button click
  const handleNext = () => {
    if (currentCorrectness === CORRECTNESS.CORRECT) {
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);

      if (newStreak >= goalNum) {
        setCompleted(true);
      } else {
        advanceToNext();
      }
    } else if (currentCorrectness === CORRECTNESS.INCORRECT) {
      setCorrectStreak(0);
      advanceToNext();
    }
  };

  const advanceToNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= problemIds.length) {
      const indices = Array.from({ length: problemIds.length }, (_, i) => i);
      setShuffledOrder(shuffleArray(indices));
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  // Check if problem exists in idMap
  if (!idMap[currentProblemId]) {
    return (
      <div className="lo-mastery-bank lo-mastery-bank--error">
        <p>Problem not found: <code>{currentProblemId}</code></p>
        <p>Make sure this problem is defined elsewhere in your content.</p>
      </div>
    );
  }

  const problemNode = { type: 'block', id: currentProblemId };

  return (
    <>
      <div className="lo-mastery-bank__problem">
        {render({ ...props, node: problemNode })}
      </div>

      {(currentCorrectness === CORRECTNESS.CORRECT ||
        currentCorrectness === CORRECTNESS.INCORRECT) && (
        <div className="lo-mastery-bank__footer">
          <button
            className="lo-mastery-bank__next-btn"
            onClick={handleNext}
          >
            Next Problem →
          </button>
        </div>
      )}
    </>
  );
}

export default function _MasteryBank(props) {
  const { id, fields, kids, goal = 6 } = props;

  // Extract problem IDs from parsed content
  const problemIds = useMemo(() => {
    if (kids?.problemIds && Array.isArray(kids.problemIds)) {
      return kids.problemIds;
    }
    return [];
  }, [kids]);

  const goalNum = typeof goal === 'string' ? parseInt(goal, 10) : goal;

  // State - initialize shuffledOrder immediately if we have problems
  const initialShuffledOrder = useMemo(() => {
    if (problemIds.length > 0) {
      const indices = Array.from({ length: problemIds.length }, (_, i) => i);
      return shuffleArray(indices);
    }
    return [];
  }, [problemIds.length]); // Only depends on length to avoid reshuffling on every render

  const [currentIndex, setCurrentIndex] = useReduxState(props, fields.currentIndex, 0);
  const [correctStreak, setCorrectStreak] = useReduxState(props, fields.correctStreak, 0);
  const [completed, setCompleted] = useReduxState(props, fields.completed, false);
  const [shuffledOrder, setShuffledOrder] = useReduxState(props, fields.shuffledOrder, initialShuffledOrder);

  // Get current problem ID
  const currentProblemIndex = shuffledOrder?.[currentIndex % problemIds.length];
  const currentProblemId = problemIds[currentProblemIndex];

  // Error states - return before we need to watch problem state
  if (problemIds.length === 0) {
    return (
      <div className="lo-mastery-bank lo-mastery-bank--error">
        <p>No problems found in MasteryBank. Add problem IDs as content.</p>
      </div>
    );
  }

  if (!currentProblemId) {
    return (
      <div className="lo-mastery-bank lo-mastery-bank--loading">
        <p>Loading...</p>
      </div>
    );
  }

  // Completion state
  if (completed) {
    return (
      <div className="lo-mastery-bank lo-mastery-bank--complete">
        <div className="lo-mastery-bank__success">
          <h3>Mastery Achieved!</h3>
          <p>You answered {goalNum} questions correctly in a row.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lo-mastery-bank">
      <div className="lo-mastery-bank__header">
        <div className="lo-mastery-bank__progress">
          Streak: {correctStreak} / {goalNum}
        </div>
        <div className="lo-mastery-bank__count">
          Problem {currentIndex + 1} of {problemIds.length}
        </div>
      </div>

      <MasteryProblem
        props={props}
        currentProblemId={currentProblemId}
        currentIndex={currentIndex}
        problemIds={problemIds}
        correctStreak={correctStreak}
        goalNum={goalNum}
        setCurrentIndex={setCurrentIndex}
        setCorrectStreak={setCorrectStreak}
        setShuffledOrder={setShuffledOrder}
        setCompleted={setCompleted}
      />
    </div>
  );
}
