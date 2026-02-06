// src/components/blocks/display/PDFViewer/_PDFViewer.tsx
/*
 * PDF Viewer Block Implementation
 *
 * Uses the browser's built-in PDF viewer via <iframe>.
 *
 * SUPPORTED PATH TYPES (same as Image):
 * 1. Relative paths: "handouts/syllabus.pdf"
 *    - Resolved relative to current OLX file directory
 * 2. Content-absolute paths: "/mycourse/handouts/syllabus.pdf"
 *    - Resolved relative to content root directory
 * 3. Platform-wide assets: "//static/guide.pdf"
 *    - Served from Next.js public/ directory
 * 4. External URLs: "https://example.com/paper.pdf"
 *    - Passed through directly
 */

'use client';
import React from 'react';
import { resolveImageSrc } from '@/lib/util';

function _PDFViewer(props) {
  const { src, width, height } = props;

  if (!src) {
    return <div className="text-red-500 border border-red-300 p-2 rounded">
      PDF error: src attribute required
    </div>;
  }

  try {
    const resolved = resolveImageSrc(src);

    let finalSrc;
    switch (resolved.type) {
      case 'external':
        finalSrc = resolved.src;
        break;
      case 'platform':
        finalSrc = `/${resolved.src}`;
        break;
      case 'content':
        finalSrc = `/content/${resolved.src}`;
        break;
    }

    return (
      <iframe
        src={finalSrc}
        width={width || '100%'}
        height={height || '600px'}
        style={{ border: 'none' }}
        title="PDF document"
      />
    );
  } catch (error) {
    return <div className="text-red-500 border border-red-300 p-2 rounded">
      PDF error: {error.message}
    </div>;
  }
}

export default _PDFViewer;
