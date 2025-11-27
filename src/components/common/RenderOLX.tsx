// src/components/common/RenderOLX.tsx
//
// Generic component for rendering OLX content from various sources.
//
// This component abstracts the OLX parsing and rendering pipeline,
// allowing content to come from inline strings, virtual filesystems,
// or storage providers. It supports STACKING - multiple content sources
// can be combined, with higher-priority sources overriding lower ones.
//
// Priority order (highest to lowest):
//   1. inline - Direct OLX string (e.g., user's current edits)
//   2. files - Virtual filesystem
//   3. provider - Single storage provider
//   4. providers - Array of providers (tried in order)
//   5. baseIdMap - Pre-parsed content (lowest priority, for system content)
//
// Usage examples:
//
//   // Simple inline OLX
//   <RenderOLX id="demo" inline="<Markdown>Hello world</Markdown>" />
//
//   // Editor with system content + user edits
//   <RenderOLX
//     id="myPage"
//     inline={userEdits}
//     baseIdMap={systemIdMap}
//     resolveProvider={networkProvider}
//   />
//
//   // Multiple files (for content with src="" references)
//   <RenderOLX
//     id="ChatDemo"
//     files={{
//       'chat.olx': '<Chat src="convo.chatpeg" />',
//       'convo.chatpeg': 'User: Hi\nAssistant: Hello!'
//     }}
//   />
//
//   // With provider stack (tries each in order)
//   <RenderOLX
//     id="MyPage"
//     providers={[courseProvider, institutionProvider, platformProvider]}
//   />
//
'use client';

import { useState, useEffect, useMemo } from 'react';
import { parseOLX } from '@/lib/content/parseOLX';
import { render, makeRootNode } from '@/lib/render';
import { COMPONENT_MAP } from '@/components/componentMap';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import type { StorageProvider } from '@/lib/storage';
import { InMemoryStorageProvider, StackedStorageProvider } from '@/lib/storage';
import type { IdMap } from '@/lib/types';

export interface RenderOLXProps {
  /** Root node ID to render */
  id: string;

  // Content sources (can be combined - higher in list = higher priority):
  /** Direct OLX string - highest priority (e.g., user's current edits) */
  inline?: string;
  /** Virtual filesystem for multi-file inline content */
  files?: Record<string, string>;
  /** Single storage provider */
  provider?: StorageProvider;
  /** Stack of providers (tried in order, first = highest priority) */
  providers?: StorageProvider[];

  // Base content:
  /** Pre-parsed idMap - lowest priority, for system/platform content */
  baseIdMap?: IdMap;

  // Resolution:
  /** Provider for resolving src="" references in inline/files content */
  resolveProvider?: StorageProvider;
  /** Provenance URI for error reporting and relative path resolution */
  provenance?: string;

  // Callbacks and customization:
  /** Error handler callback */
  onError?: (error: Error) => void;
  /** Custom component map (defaults to global COMPONENT_MAP) */
  componentMap?: typeof COMPONENT_MAP;
}

type ParsedContent = {
  root: string;
  ids: string[];
  idMap: IdMap;
};

// ============================================================================
// Helper functions - pure functions for building providers and extracting content
// ============================================================================

/**
 * Build a stacked provider from all content sources.
 * Returns null if no providers are specified.
 */
function buildProviderStack(
  inline: string | undefined,
  files: Record<string, string> | undefined,
  provider: StorageProvider | undefined,
  providers: StorageProvider[] | undefined,
  resolveProvider: StorageProvider | undefined
): StorageProvider | null {
  const stack: StorageProvider[] = [];

  // Priority order: inline > files > provider > providers > resolveProvider
  if (inline) {
    stack.push(new InMemoryStorageProvider({ '_inline.olx': inline }));
  }
  if (files) {
    stack.push(new InMemoryStorageProvider(files));
  }
  if (provider) {
    stack.push(provider);
  }
  if (providers) {
    stack.push(...providers);
  }
  if (resolveProvider) {
    stack.push(resolveProvider);
  }

  if (stack.length === 0) return null;
  if (stack.length === 1) return stack[0];
  return new StackedStorageProvider(stack);
}

/**
 * Determine what OLX content string to parse and its provenance.
 * Returns null if no parseable content is available (e.g., only baseIdMap).
 */
function getContentToParse(
  id: string,
  inline: string | undefined,
  files: Record<string, string> | undefined,
  provenance: string | undefined
): { content: string; provenance: string } | null {
  if (inline) {
    return {
      content: inline,
      provenance: provenance || 'inline://'
    };
  }

  if (files) {
    const mainFile = findMainOlxFile(files, id);
    if (mainFile) {
      return {
        content: files[mainFile],
        provenance: provenance || `memory://${mainFile}`
      };
    }
  }

  return null;
}

/**
 * Find the main OLX file in a files record.
 * Prefers files matching the id, otherwise takes the first .olx/.xml file.
 */
function findMainOlxFile(
  files: Record<string, string>,
  id: string
): string | undefined {
  const olxFiles = Object.keys(files).filter(
    f => f.endsWith('.olx') || f.endsWith('.xml')
  );
  return olxFiles.find(f => f.includes(id)) || olxFiles[0];
}

/**
 * Merge parsed idMap with base idMap.
 * Parsed content takes priority (overrides base).
 */
function mergeIdMaps(
  parsed: ParsedContent | null,
  baseIdMap: IdMap | undefined
): IdMap | null {
  if (!parsed && !baseIdMap) return null;
  if (!parsed) return baseIdMap!;
  if (!baseIdMap) return parsed.idMap;
  return { ...baseIdMap, ...parsed.idMap };
}

/**
 * Determine which node ID to use as the render root.
 */
function getRootId(
  requestedId: string,
  idMap: IdMap,
  parsed: ParsedContent | null
): string {
  // If the requested ID exists, use it
  if (idMap[requestedId]) return requestedId;
  // Fall back to the parsed root, or the requested ID (which will error)
  return parsed?.root || requestedId;
}

// ============================================================================
// Component
// ============================================================================

export default function RenderOLX({
  id,
  inline,
  files,
  provider,
  providers,
  baseIdMap,
  resolveProvider,
  provenance,
  onError,
  componentMap = COMPONENT_MAP,
}: RenderOLXProps) {
  const [parsed, setParsed] = useState<ParsedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Build provider stack for content resolution
  const effectiveProvider = useMemo(
    () => buildProviderStack(inline, files, provider, providers, resolveProvider),
    [inline, files, provider, providers, resolveProvider]
  );

  // Determine what content needs to be parsed
  const contentToParse = useMemo(
    () => getContentToParse(id, inline, files, provenance),
    [id, inline, files, provenance]
  );

  // Parse content when it changes
  useEffect(() => {
    // Nothing to parse - will render from baseIdMap if available
    if (!contentToParse) {
      setParsed(null);
      setError(null);
      return;
    }

    // Need to parse but no provider available
    if (!effectiveProvider) {
      setError('RenderOLX: No provider available for content resolution');
      return;
    }

    let cancelled = false;

    async function doParse() {
      try {
        const result = await parseOLX(
          contentToParse!.content,
          [contentToParse!.provenance],
          effectiveProvider!
        );

        if (!cancelled) {
          setParsed(result);
          setError(null);
        }
      } catch (err) {
        console.error('RenderOLX parse error:', err);
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (!cancelled) {
          setError(errorMsg);
          onError?.(err instanceof Error ? err : new Error(errorMsg));
        }
      }
    }

    doParse();

    return () => { cancelled = true; };
  }, [effectiveProvider, contentToParse, onError]);

  // Merge parsed content with base idMap
  const mergedIdMap = useMemo(
    () => mergeIdMaps(parsed, baseIdMap),
    [parsed, baseIdMap]
  );

  // Render the content tree
  const rendered = useMemo(() => {
    if (!mergedIdMap) return null;

    const rootId = getRootId(id, mergedIdMap, parsed);

    if (!mergedIdMap[rootId]) {
      return (
        <div className="text-red-600">
          RenderOLX: ID &quot;{id}&quot; not found in content
        </div>
      );
    }

    try {
      return render({
        key: rootId,
        node: rootId,
        idMap: mergedIdMap,
        nodeInfo: makeRootNode(),
        componentMap,
      });
    } catch (err) {
      console.error('RenderOLX render error:', err);
      return null;
    }
  }, [mergedIdMap, parsed, id, componentMap]);

  // Error state
  if (error) {
    return (
      <div className="text-red-600 p-2 border border-red-300 rounded bg-red-50">
        <div className="font-semibold">Error rendering OLX</div>
        <pre className="text-sm mt-1 whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  // Loading state (no content yet, but expecting some)
  if (!mergedIdMap) {
    if (!contentToParse && !baseIdMap) {
      return (
        <div className="text-red-600">
          RenderOLX: No content source provided
        </div>
      );
    }
    return <div className="text-gray-500">Loading...</div>;
  }

  // No rendered output (shouldn't happen if mergedIdMap exists)
  if (!rendered) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <ErrorBoundary
      resetKey={parsed}
      handler={(err) => {
        setError(err.message);
        onError?.(err);
      }}
    >
      {rendered}
    </ErrorBoundary>
  );
}
