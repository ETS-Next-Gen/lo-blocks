// src/lib/blocks/useBlockByOLXId.ts
//
// Hook for accessing blocks by OLX ID during render.
//
// OLX ID = static ID from markup: <Block id="myblockid">
// Redux ID = runtime ID with suffixes: myblockid_1, myblockid_2 (for repeated blocks)
//
// This is the render-time counterpart to getBlockByOLXId (which is async).
// Currently a simple sync lookup, but establishes the hook pattern for
// future Suspense integration.
//
// Usage:
//   const block = useBlockByOLXId(props, 'some-block-id');
//   if (!block) return <Error />;
//   // use block...
//
'use client';

import { idMapKey } from './idResolver';
import type { PropType, OlxJson } from '@/lib/types';

/**
 * Hook to get a block by its OLX ID during render.
 *
 * This is the single abstraction point for render-time block lookup.
 * Components should use this hook rather than accessing props.idMap directly.
 *
 * Currently synchronous, but the hook pattern enables future Suspense support
 * where this could suspend while fetching blocks from the server.
 *
 * @param props - Component props containing idMap
 * @param id - The OLX ID to look up (static ID from markup, not Redux ID)
 * @returns The block entry, or undefined if not found
 */
export function useBlockByOLXId(props: PropType, id: string): OlxJson | undefined {
  return props.idMap[idMapKey(id)];
}

/**
 * Hook to get multiple blocks by their OLX IDs during render.
 *
 * Plural version of useBlockByOLXId - single hook call for multiple IDs.
 * Better for loops and batched fetching.
 *
 * @param props - Component props containing idMap
 * @param ids - Array of OLX IDs to look up
 * @returns Array of block entries (undefined for any not found)
 */
export function useBlocksByOLXIds(props: PropType, ids: string[]): (OlxJson | undefined)[] {
  return ids.map(id => props.idMap[idMapKey(id)]);
}
