// src/lib/blocks/useBlockByOLXId.ts
//
// React hooks for accessing blocks by OLX ID during render.
//
// Uses React 19's use() hook to unwrap promises from getBlockByOLXId.
// Currently resolves instantly (sync idMap lookup), but when server fetching
// is added, these will suspend until data arrives.
//
// Suspense boundary should be at RenderOLX level (not per-component).
//
// OLX ID = static ID from markup: <Block id="myblockid">
// Redux ID = runtime ID with suffixes: myblockid_1, myblockid_2
//
'use client';

import { use } from 'react';
import { getBlockByOLXId, getBlocksByOLXIds } from './getBlockByOLXId';
import type { PropType, OlxJson } from '@/lib/types';

export function useBlockByOLXId(props: PropType, id: string): OlxJson | undefined {
  return use(getBlockByOLXId(props, id));
}

export function useBlocksByOLXIds(props: PropType, ids: string[]): (OlxJson | undefined)[] {
  return use(getBlocksByOLXIds(props, ids));
}
