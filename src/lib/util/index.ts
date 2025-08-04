// src/lib/util/index.ts
//
// Utility functions - small helpers used throughout Learning Observer.
//
// Provides common utility functions that don't belong in any specific domain:
// - `enumdict`: Creates type-safe enums from string arrays
// - `isBlockTag`: Identifies Learning Observer block tags by PascalCase convention
//   (used to distinguish blocks from HTML tags during parsing and rendering)
//
export function enumdict<T extends string>(keys: readonly T[]): { readonly [K in T]: K } {
  return Object.fromEntries(keys.map(k => [k, k])) as { readonly [K in T]: K };
}


export function isBlockTag(tag: string) {
  if (!tag) return false;
  const first = tag[0];
  return first === first.toUpperCase();
}
