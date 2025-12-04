// src/components/common/PEGCodeMirror.tsx
//
// A CodeMirror wrapper that accepts a PEG parser and shows parse errors inline.
// Usage:
//   <PEGCodeMirror
//     parser={chatParser}
//     value={content}
//     onChange={setContent}
//   />

'use client';

import { useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { linter, lintGutter, Diagnostic } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

// Dynamic import to avoid loading CodeMirror on every page
const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror').then(mod => mod.default),
  { ssr: false }
);

// Type for PEG parser error location
interface PEGLocation {
  start: { line: number; column: number; offset: number };
  end?: { line: number; column: number; offset: number };
}

interface PEGError extends Error {
  location?: PEGLocation;
  expected?: Array<{ type: string; text?: string; description?: string }>;
  found?: string;
}

// Type for a PEG parser (e.g., from Peggy)
interface PEGParser {
  parse: (input: string) => unknown;
}

interface PEGCodeMirrorProps {
  /** The PEG parser to use for validation */
  parser: PEGParser;
  /** Current editor content */
  value: string;
  /** Called when content changes */
  onChange?: (value: string) => void;
  /** Editor height (default: "400px") */
  height?: string;
  /** Additional CodeMirror extensions */
  extensions?: Extension[];
  /** Debounce time for linting in ms (default: 300) */
  lintDebounce?: number;
  /** Placeholder text when empty */
  placeholder?: string;
}

/**
 * Custom theme for more visible error highlighting.
 * Makes errors stand out with background color and thicker underline.
 */
const errorHighlightTheme = EditorView.baseTheme({
  // Error underline - make it thicker and more visible
  '.cm-lintRange-error': {
    backgroundImage: 'none',
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    borderBottom: '2px solid #e53e3e',
  },
  // Warning underline
  '.cm-lintRange-warning': {
    backgroundImage: 'none',
    backgroundColor: 'rgba(255, 165, 0, 0.15)',
    borderBottom: '2px solid #dd6b20',
  },
  // Lint gutter marker
  '.cm-lint-marker-error': {
    content: '"●"',
    color: '#e53e3e',
  },
  // Tooltip styling
  '.cm-tooltip-lint': {
    backgroundColor: '#1a202c',
    color: '#fff',
    border: '1px solid #e53e3e',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '13px',
    maxWidth: '400px',
  },
});

/**
 * Creates a CodeMirror linter extension for a PEG parser.
 * Parses content and converts PEG errors to CodeMirror diagnostics.
 */
function createPEGLinter(parser: PEGParser): Extension {
  return linter((view) => {
    const diagnostics: Diagnostic[] = [];
    const content = view.state.doc.toString();

    if (!content.trim()) {
      return diagnostics; // Don't lint empty content
    }

    try {
      parser.parse(content);
    } catch (e) {
      const error = e as PEGError;

      if (error.location) {
        const { start, end } = error.location;

        // Calculate offset - PEG uses 1-based line/column
        const fromOffset = start.offset;
        // If no end location, highlight to end of line or +10 chars
        const toOffset = end?.offset ?? Math.min(fromOffset + 10, content.length);

        // Build a helpful message
        let message = error.message;

        // Add expected/found info if available
        if (error.expected && error.expected.length > 0) {
          const expectedItems = error.expected
            .map(e => e.description || e.text || e.type)
            .filter(Boolean)
            .slice(0, 5); // Limit to avoid huge messages

          if (expectedItems.length > 0 && !message.includes('Expected')) {
            message += `\nExpected: ${expectedItems.join(', ')}`;
          }
        }

        if (error.found && !message.includes('found')) {
          message += `\nFound: "${error.found}"`;
        }

        diagnostics.push({
          from: fromOffset,
          to: toOffset,
          severity: 'error',
          message,
          source: 'PEG Parser',
        });
      } else {
        // No location info - show at start of document
        diagnostics.push({
          from: 0,
          to: Math.min(10, content.length),
          severity: 'error',
          message: error.message || 'Parse error',
          source: 'PEG Parser',
        });
      }
    }

    return diagnostics;
  });
}

/**
 * CodeMirror editor with PEG parser-based linting.
 *
 * Accepts any Peggy/PEG.js parser and shows parse errors inline
 * using CodeMirror's lint extension.
 */
export default function PEGCodeMirror({
  parser,
  value,
  onChange,
  height = '400px',
  extensions = [],
  placeholder,
}: PEGCodeMirrorProps) {

  const handleChange = useCallback((val: string) => {
    onChange?.(val);
  }, [onChange]);

  // Create linter extension - memoized to avoid recreation on every render
  const pegLinter = useMemo(() => createPEGLinter(parser), [parser]);

  // Combine extensions: linter + gutter + theme + user extensions
  const allExtensions = useMemo(() => {
    return [
      pegLinter,
      lintGutter(),          // Shows error markers in the gutter
      errorHighlightTheme,   // Custom styling for better visibility
      ...extensions
    ];
  }, [pegLinter, extensions]);

  return (
    <CodeMirror
      value={value}
      height={height}
      extensions={allExtensions}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}

// Also export the linter creator for advanced use cases
export { createPEGLinter };
export type { PEGParser, PEGCodeMirrorProps };
