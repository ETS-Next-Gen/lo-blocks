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

  // Build the effective provider stack and determine content to parse
  const { effectiveProvider, contentToParse, contentProvenance, renderFromBaseOnly } = useMemo(() => {
    // Build provider stack from all sources (highest to lowest priority)
    const providerStack: StorageProvider[] = [];

    // 1. inline content (highest priority)
    let inlineProvider: StorageProvider | null = null;
    if (inline) {
      inlineProvider = new InMemoryStorageProvider({ '_inline.olx': inline });
      providerStack.push(inlineProvider);
    }

    // 2. files virtual filesystem
    let filesProvider: StorageProvider | null = null;
    if (files) {
      filesProvider = new InMemoryStorageProvider(files);
      providerStack.push(filesProvider);
    }

    // 3. single provider
    if (provider) {
      providerStack.push(provider);
    }

    // 4. providers array
    if (providers) {
      providerStack.push(...providers);
    }

    // 5. resolveProvider (for src="" resolution, added to stack for fallback reads)
    if (resolveProvider) {
      providerStack.push(resolveProvider);
    }

    // If no providers at all, check if we can render from baseIdMap alone
    if (providerStack.length === 0) {
      if (baseIdMap) {
        return {
          effectiveProvider: null,
          contentToParse: null,
          contentProvenance: null,
          renderFromBaseOnly: true
        };
      }
      // No content sources at all - this will show an error
      return {
        effectiveProvider: null,
        contentToParse: null,
        contentProvenance: null,
        renderFromBaseOnly: false
      };
    }

    // Create stacked provider (or use single provider if only one)
    const effectiveProvider = providerStack.length === 1
      ? providerStack[0]
      : new StackedStorageProvider(providerStack);

    // Determine what content to parse (from highest priority source)
    let contentToParse: string | null = null;
    let contentProvenance: string | null = null;

    if (inline) {
      contentToParse = inline;
      contentProvenance = provenance || 'inline://';
    } else if (files) {
      // Find the main OLX file - prefer one matching the id or first .olx file
      const olxFiles = Object.keys(files).filter(f => f.endsWith('.olx') || f.endsWith('.xml'));
      const mainFile = olxFiles.find(f => f.includes(id)) || olxFiles[0];
      if (mainFile) {
        contentToParse = files[mainFile];
        contentProvenance = provenance || `memory://${mainFile}`;
      }
    }
    // If no inline/files, we rely on baseIdMap and provider is just for resolution

    return {
      effectiveProvider,
      contentToParse,
      contentProvenance,
      renderFromBaseOnly: !contentToParse && !!baseIdMap
    };
  }, [inline, files, provider, providers, baseIdMap, resolveProvider, provenance, id]);

  // Parse content when it changes
  useEffect(() => {
    // If rendering from baseIdMap only, nothing to parse
    if (renderFromBaseOnly) {
      setParsed(null);
      setError(null);
      return;
    }

    // If no content to parse and no baseIdMap, show error
    if (!contentToParse) {
      if (!baseIdMap) {
        setError('RenderOLX: No content source provided (need inline, files, provider, providers, or baseIdMap)');
      }
      return;
    }

    if (!effectiveProvider) {
      setError('RenderOLX: No provider available for content resolution');
      return;
    }

    let cancelled = false;

    async function doParse() {
      try {
        const result = await parseOLX(
          contentToParse!,
          contentProvenance ? [contentProvenance] : [],
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

    return () => {
      cancelled = true;
    };
  }, [effectiveProvider, contentToParse, contentProvenance, renderFromBaseOnly, baseIdMap, onError]);

  // Merge parsed idMap with baseIdMap (parsed content overrides base)
  const mergedIdMap = useMemo(() => {
    if (renderFromBaseOnly && baseIdMap) {
      return baseIdMap;
    }
    if (!parsed) return baseIdMap || null;
    return baseIdMap ? { ...baseIdMap, ...parsed.idMap } : parsed.idMap;
  }, [parsed, baseIdMap, renderFromBaseOnly]);

  // Render the content
  const rendered = useMemo(() => {
    if (!mergedIdMap) return null;

    // Determine root ID to render
    const rootId = mergedIdMap[id] ? id : (parsed?.root || id);

    if (!mergedIdMap[rootId]) {
      return <div className="text-red-600">RenderOLX: ID &quot;{id}&quot; not found in content</div>;
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

  // Handle error state
  if (error) {
    return (
      <div className="text-red-600 p-2 border border-red-300 rounded bg-red-50">
        <div className="font-semibold">Error rendering OLX</div>
        <pre className="text-sm mt-1 whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  // Handle loading state
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
