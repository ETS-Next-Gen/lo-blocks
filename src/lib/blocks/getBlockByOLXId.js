// src/lib/blocks/getBlockByOLXId.js
//
// Async accessors for blocks by OLX ID.
//
// These are for use in async contexts (actions, effects, API routes).
// For render-time access, use the hooks in useBlockByOLXId.ts.
//
// OLX ID = static ID from markup: <Block id="myblockid">
// Redux ID = runtime ID with suffixes: myblockid_1, myblockid_2 (for repeated blocks)
//
import { idMapKey } from './idResolver';

/**
 * Get a block from the idMap by its OLX ID.
 *
 * This is the single abstraction point for block lookup. All components should
 * use this function rather than accessing props.idMap directly. This enables
 * future enhancements like ID normalization, server fetching, and store hierarchies.
 *
 * @param {Object} props - Component props containing idMap
 * @param {string} id - The OLX ID to look up (can be absolute or relative)
 * @returns {Promise<Object|undefined>} The block entry, or undefined if not found
 */
export async function getBlockByOLXId(props, id) {
  return props.idMap[idMapKey(id)];
}

/**
 * Get multiple blocks from the idMap by their OLX IDs.
 *
 * Plural version of getBlockByOLXId - single call for multiple IDs.
 * Better for batched fetching.
 *
 * @param {Object} props - Component props containing idMap
 * @param {string[]} ids - Array of OLX IDs to look up
 * @returns {Promise<Array<Object|undefined>>} Array of block entries (undefined for any not found)
 */
export async function getBlocksByOLXIds(props, ids) {
  return ids.map(id => props.idMap[idMapKey(id)]);
}
