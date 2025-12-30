// src/lib/blocks/getBlockByOLXId.js
//
// Async accessors for blocks by OLX ID.
//
// These are for use in async contexts (actions, effects) or via the
// useBlockByOLXId hook for render-time access with Suspense.
//
// OLX ID = static ID from markup: <Block id="myblockid">
// Redux ID = runtime ID with suffixes: myblockid_1, myblockid_2 (for repeated blocks)
//
import { idMapKey } from './idResolver';

// Promise cache for React's use() hook.
// React requires the same promise instance on re-renders - creating a new promise
// each render causes infinite suspension. This cache ensures stable promise identity.
//
// When server fetching is added, this becomes the in-flight deduplication cache.
const promiseCache = new Map();

/**
 * Get a block from the idMap by its OLX ID.
 *
 * This is the single abstraction point for block lookup. All components should
 * use this function (via useBlockByOLXId hook) rather than accessing props.idMap
 * directly. This enables future server fetching without changing call sites.
 *
 * Returns a cached promise for React's use() hook compatibility.
 *
 * @param {Object} props - Component props containing idMap
 * @param {string} id - The OLX ID to look up
 * @returns {Promise<Object|undefined>} The block entry, or undefined if not found
 */
export function getBlockByOLXId(props, id) {
  const key = idMapKey(id);

  // Return cached promise if available (required for React's use() hook)
  if (promiseCache.has(key)) {
    return promiseCache.get(key);
  }

  // Currently sync - just wrap in resolved promise
  // When server fetching is added, this becomes an async fetch
  const promise = Promise.resolve(props.idMap[key]);
  promiseCache.set(key, promise);
  return promise;

  // Future async version:
  // if (key in props.idMap) {
  //   const promise = Promise.resolve(props.idMap[key]);
  //   promiseCache.set(key, promise);
  //   return promise;
  // }
  // // Not in idMap - fetch from server
  // const promise = fetchFromServer(id).then(block => {
  //   props.idMap[key] = block;
  //   return block;
  // });
  // promiseCache.set(key, promise);
  // return promise;
}

/**
 * Get multiple blocks from the idMap by their OLX IDs.
 *
 * Returns a cached promise for React's use() hook compatibility.
 *
 * @param {Object} props - Component props containing idMap
 * @param {string[]} ids - Array of OLX IDs to look up
 * @returns {Promise<Array<Object|undefined>>} Array of block entries
 */
export function getBlocksByOLXIds(props, ids) {
  // Create a cache key from sorted unique IDs
  const cacheKey = `batch:${[...new Set(ids)].sort().join(',')}`;

  if (promiseCache.has(cacheKey)) {
    return promiseCache.get(cacheKey);
  }

  const promise = Promise.all(ids.map(id => getBlockByOLXId(props, id)));
  promiseCache.set(cacheKey, promise);
  return promise;
}
