// src/components/blocks/specialized/Chat/waitConditions.ts
//
// Wait condition evaluation using the state language.

import { useMemo } from 'react';
import {
  parse,
  extractStructuredRefs,
  mergeReferences,
  useReferences,
  evaluate,
  createContext,
  EMPTY_REFS
} from '@/lib/stateLanguage';
import type { References, ContextData } from '@/lib/stateLanguage';

/**
 * Chat script entry that might be a wait command.
 */
interface ChatEntry {
  type: string;
  expression?: string;
}

/**
 * Extract all references from wait commands in a chat script.
 */
export function extractWaitRefs(entries: ChatEntry[]): References {
  const expressions: string[] = [];

  for (const entry of entries) {
    if (entry.type === 'WaitCommand' && entry.expression) {
      expressions.push(entry.expression);
    }
  }

  if (expressions.length === 0) return EMPTY_REFS;
  return mergeReferences(...expressions.map(extractStructuredRefs));
}

/**
 * Check if we can advance past wait commands to the next content.
 *
 * Multiple consecutive waits act as AND - all must pass.
 */
export function canAdvanceToContent(
  entries: ChatEntry[],
  fromIndex: number,
  toIndex: number,
  context: ContextData
): boolean {
  for (let i = fromIndex + 1; i <= toIndex; i++) {
    const entry = entries[i];
    if (!entry) break;

    if (entry.type === 'WaitCommand') {
      if (!entry.expression) continue;
      try {
        if (!evaluate(parse(entry.expression), context)) {
          return false;
        }
      } catch (e) {
        console.warn('[Chat] Failed to evaluate wait:', entry.expression, e);
        return false;
      }
    }

    if (entry.type === 'Line' || entry.type === 'PauseCommand') break;
  }

  return true;
}

/**
 * Hook for wait condition checking in a chat component.
 */
export function useWaitConditions(
  props: any,
  entries: ChatEntry[],
  currentIndex: number,
  endIndex: number
) {
  const allRefs = useMemo(() => extractWaitRefs(entries), [entries]);
  const resolved = useReferences(props, allRefs);
  const context = createContext(resolved);
  const canAdvance = canAdvanceToContent(entries, currentIndex, endIndex, context);

  return { canAdvance };
}
