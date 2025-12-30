// src/lib/blocks/useBlockByOLXId.ts
//
// React hooks for accessing blocks by OLX ID during render.
//
// Currently sync (direct idMap lookup). When server fetching is added,
// these will switch to use React's use() hook with Suspense:
//   return use(getBlockByOLXId(props, id));
//
// For async contexts (actions, effects), use getBlockByOLXId directly.
//
// OLX ID = static ID from markup: <Block id="myblockid">
// Redux ID = runtime ID with suffixes: myblockid_1, myblockid_2
//
'use client';

import { idMapKey } from './idResolver';
import type { PropType, OlxJson } from '@/lib/types';

export function useBlockByOLXId(props: PropType, id: string): OlxJson | undefined {
  // Sync for now - when server fetching is added, switch to:
  // return use(getBlockByOLXId(props, id));
  return props.idMap[idMapKey(id)];
}

export function useBlocksByOLXIds(props: PropType, ids: string[]): (OlxJson | undefined)[] {
  // Sync for now - when server fetching is added, switch to:
  // return use(getBlocksByOLXIds(props, ids));
  return ids.map(id => props.idMap[idMapKey(id)]);
}
