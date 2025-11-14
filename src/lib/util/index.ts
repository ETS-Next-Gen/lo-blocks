// src/lib/util/index.ts
//
// Utility functions - small helpers used throughout Learning Observer.
//
// Provides common utility functions that don't belong in any specific domain:
// - `enumdict`: Creates type-safe enums from string arrays
// - `isBlockTag`: Identifies Learning Observer block tags by PascalCase convention
//   (used to distinguish blocks from HTML tags during parsing and rendering)
// - `resolveImagePath`: Resolves image paths for Next.js Image component
//
export function enumdict<T extends string>(keys: readonly T[]): { readonly [K in T]: K } {
  return Object.fromEntries(keys.map(k => [k, k])) as { readonly [K in T]: K };
}


export function isBlockTag(tag: string) {
  if (!tag) return false;
  const first = tag[0];
  return first === first.toUpperCase();
}

/**
 * Resolve image paths for Next.js Image component
 *
 * SUPPORTED PATH TYPES:
 * 1. Relative paths: "images/photo.png"
 *    - Resolved relative to content directory
 * 2. Content-absolute paths: "/mycourse/static/image.png"
 *    - Resolved relative to content root directory
 * 3. Platform-wide assets: "//static/platform-logo.png"
 *    - Served from Next.js public/ directory
 * 4. External URLs: "https://example.com/image.png"
 *    - Passed through unchanged
 */
export function resolveImagePath(src: string | null | undefined): string | null {
  if (!src) return null;

  // External URLs
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Platform-wide assets (// prefix)
  if (src.startsWith('//')) {
    return src.slice(1); // Remove one slash, keep the leading slash
  }

  // Content paths - add /content/ prefix
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  return `/content/${cleanSrc}`;
}
