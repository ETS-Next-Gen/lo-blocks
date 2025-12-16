// src/lib/blocks/useGraderAnswer.js
//
// Hook for inputs to access their grader's answer display state.
// Returns { showAnswer, displayAnswer } for rendering answer hints/highlights.
//
// Finds grader by (in priority order):
// 1. Grader with target pointing to this input (sibling graders - most specific)
// 2. Parent grader (input nested inside grader - includes metagraders)
//
'use client';
import * as state from '@/lib/state';
import { useFieldSelector } from '@/lib/state';
import { getGrader } from './olxdom';

/**
 * Find a grader that targets this input (for sibling grader patterns)
 */
function findTargetingGrader(props) {
  const { id, idMap, componentMap } = props;
  if (!idMap || !componentMap) return null;

  // Search all nodes for graders that target this input
  for (const [nodeId, node] of Object.entries(idMap)) {
    const blueprint = componentMap[node.tag];
    if (blueprint?.isGrader && node.attributes?.target) {
      // Check if this grader's target includes our input
      const targets = node.attributes.target.split(',').map(t => t.trim());
      if (targets.includes(id)) {
        return nodeId;
      }
    }
  }
  return null;
}

/**
 * Hook for input components to access grader's answer state.
 *
 * @param {object} props - Component props (with nodeInfo, idMap, componentMap)
 * @returns {{ showAnswer: boolean, displayAnswer: any, graderId: string|null }}
 *
 * Usage in input component:
 *   const { showAnswer, displayAnswer } = useGraderAnswer(props);
 *   if (showAnswer) {
 *     // Highlight correct answer, show hint, etc.
 *   }
 */
export function useGraderAnswer(props) {
  let graderId = null;
  let showAnswer = false;
  let displayAnswer = undefined;

  // Find grader: prefer targeting grader (more specific) over parent grader
  // This handles sibling patterns like <SortableInput/><SortableGrader target="..."/>
  graderId = findTargetingGrader(props);

  if (!graderId) {
    // No targeting grader - try parent grader
    try {
      graderId = getGrader(props);
    } catch (e) {
      // No grader found at all
      return { showAnswer: false, displayAnswer: undefined, graderId: null };
    }
  }

  // Subscribe to grader's showAnswer field
  try {
    const showAnswerField = state.componentFieldByName(props, graderId, 'showAnswer');
    showAnswer = useFieldSelector(
      props,
      showAnswerField,
      { id: graderId, fallback: false, selector: s => s?.showAnswer ?? false }
    );
  } catch (e) {
    showAnswer = false;
  }

  // Get displayAnswer from grader's blueprint
  if (showAnswer && graderId) {
    const graderInstance = props.idMap?.[graderId];
    const graderBlueprint = graderInstance ? props.componentMap?.[graderInstance.tag] : null;

    if (graderBlueprint?.getDisplayAnswer) {
      // Build grader props for getDisplayAnswer call
      const graderProps = {
        ...props,
        id: graderId,
        ...graderInstance?.attributes,
      };
      displayAnswer = graderBlueprint.getDisplayAnswer(graderProps);
    }
  }

  return { showAnswer, displayAnswer, graderId };
}
