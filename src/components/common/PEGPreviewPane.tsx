// src/components/common/PEGPreviewPane.tsx
// Preview pane for PEG content files (.chatpeg, .sortpeg, etc.)
'use client';

import { useMemo } from 'react';
import { getParserForExtension } from '@/generated/parserRegistry';

interface PEGPreviewPaneProps {
  path: string;
  content: string;
}

interface ParseResult {
  success: boolean;
  data?: unknown;
  error?: {
    message: string;
    location?: {
      line: number;
      column: number;
    };
  };
}

function getExtension(path: string): string {
  return path.split('.').pop()?.toLowerCase() || '';
}

/**
 * Preview pane for PEG content files (.chatpeg, .sortpeg, etc.)
 * Shows parsed AST or parse errors.
 */
export default function PEGPreviewPane({ path, content }: PEGPreviewPaneProps) {
  const ext = useMemo(() => getExtension(path), [path]);

  const result = useMemo((): ParseResult | null => {
    if (!content.trim()) return null;

    const parser = getParserForExtension(ext);
    if (!parser) {
      return {
        success: false,
        error: { message: `No parser found for extension: ${ext}` }
      };
    }

    try {
      const data = parser.parse(content);
      return { success: true, data };
    } catch (e: any) {
      return {
        success: false,
        error: {
          message: e.message,
          location: e.location?.start
        }
      };
    }
  }, [ext, content]);

  if (!result) {
    return (
      <div className="p-4 text-gray-500">
        Enter content to see parse result
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="font-semibold mb-2 flex items-center gap-2">
        {result.success ? (
          <span className="text-green-600">✓</span>
        ) : (
          <span className="text-red-600">✗</span>
        )}
        Parse Result
      </div>

      {result.success ? (
        <pre className="flex-1 overflow-auto bg-gray-900 text-green-400 p-4 rounded text-xs font-mono whitespace-pre-wrap">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <div className="text-red-700 font-medium mb-2">
              {result.error?.location && (
                <span className="text-red-500 text-sm mr-2">
                  Line {result.error.location.line}, Column {result.error.location.column}
                </span>
              )}
              Error
            </div>
            <pre className="text-red-600 text-sm whitespace-pre-wrap font-mono">
              {result.error?.message}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
