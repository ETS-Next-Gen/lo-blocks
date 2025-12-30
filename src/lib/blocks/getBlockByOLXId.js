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
// Uses WeakMap keyed by idMap object, so different idMaps get separate caches.
// This prevents stale data when different components/tests use different idMaps.
//
// When server fetching is added, this becomes the in-flight deduplication cache.
const promiseCacheByIdMap = new WeakMap(); // idMap -> Map<id, Promise>

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

  // Get or create cache for this specific idMap
  let cacheForIdMap = promiseCacheByIdMap.get(props.idMap);
  if (!cacheForIdMap) {
    cacheForIdMap = new Map();
    promiseCacheByIdMap.set(props.idMap, cacheForIdMap);
  }

  // Return cached thenable if available (required for React's use() hook)
  if (cacheForIdMap.has(key)) {
    return cacheForIdMap.get(key);
  }

  // Create a "synchronous thenable" that React's use() can inspect without suspending.
  // React checks for status/value properties before treating it as a real promise.
  // This avoids the microtask delay that causes Suspense to show fallback unnecessarily.
  const value = props.idMap[key];
  const thenable = {
    status: 'fulfilled',
    value: value,
    then(onFulfilled) {
      onFulfilled(value);
    }
  };
  cacheForIdMap.set(key, thenable);
  return thenable;

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
  // Get or create cache for this specific idMap
  let cacheForIdMap = promiseCacheByIdMap.get(props.idMap);
  if (!cacheForIdMap) {
    cacheForIdMap = new Map();
    promiseCacheByIdMap.set(props.idMap, cacheForIdMap);
  }

  // Create a cache key from sorted unique IDs
  const cacheKey = `batch:${[...new Set(ids)].sort().join(',')}`;

  if (cacheForIdMap.has(cacheKey)) {
    return cacheForIdMap.get(cacheKey);
  }

  // Get all values synchronously (they're all sync thenables)
  const values = ids.map(id => {
    const thenable = getBlockByOLXId(props, id);
    return thenable.value; // Access sync value directly
  });

  // Create synchronous thenable for the batch
  const thenable = {
    status: 'fulfilled',
    value: values,
    then(onFulfilled) {
      onFulfilled(values);
    }
  };
  cacheForIdMap.set(cacheKey, thenable);
  return thenable;
}
