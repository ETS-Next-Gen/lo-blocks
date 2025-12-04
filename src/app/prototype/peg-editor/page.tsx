// src/app/demo/peg-editor/page.tsx
//
// Demo page for the PEGCodeMirror component.
// Shows a chat-format editor with real-time parse error highlighting.

'use client';

import { useState } from 'react';
import PEGCodeMirror from '@/components/common/PEGCodeMirror';
import * as chatParser from '@/components/blocks/specialized/Chat/_chatParser';

const SAMPLE_CONTENT = `Title: Learning Discussion Demo
Author: Documentation Team
~~~~

Introduction
------------

Alex: Hey everyone! Welcome to our learning discussion.

Sam: Thanks Alex! I'm excited to learn about the Chat format.

Jordan: Same here! This format seems really flexible.

Alex: Let's explore some features!

# This is a comment - it won't appear in the output

[id=activity1 mood=excited]
Alex: Notice the metadata above this line? [expression=happy]

--- pause ---

Sam: What other commands are available?

Alex: We have wait commands too:

--- wait quiz1 ---

Jordan: And arrow commands for flow control:
sidebar -> main_content

Alex: Exactly! The parser validates all of this in real-time.
`;

const SAMPLE_WITH_ERROR = `Title: Demo with Error
~~~~

Alex: This line is fine.

Sam This line is missing a colon after the speaker name!

Jordan: This line is also fine.
`;

export default function PEGEditorDemo() {
  const [content, setContent] = useState(SAMPLE_CONTENT);
  const [parseResult, setParseResult] = useState<string>('');

  const handleChange = (value: string) => {
    setContent(value);

    // Try to parse and show result
    try {
      const result = chatParser.parse(value);
      setParseResult(JSON.stringify(result, null, 2));
    } catch (e) {
      setParseResult(`Parse error: ${(e as Error).message}`);
    }
  };

  const loadSample = (sample: string) => {
    setContent(sample);
    handleChange(sample);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">PEG Editor Demo</h1>
        <p className="text-gray-600 mb-6">
          This demo shows a CodeMirror editor with PEG parser-based linting.
          Try introducing syntax errors - they&apos;ll be highlighted in real-time.
        </p>

        <div className="mb-4 space-x-2">
          <button
            onClick={() => loadSample(SAMPLE_CONTENT)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load Valid Sample
          </button>
          <button
            onClick={() => loadSample(SAMPLE_WITH_ERROR)}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Load Sample with Error
          </button>
          <button
            onClick={() => loadSample('')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Chat Format Editor</h2>
            <p className="text-sm text-gray-500 mb-3">
              Edit the chat content below. Parse errors will be underlined in red.
            </p>
            <div className="border rounded">
              <PEGCodeMirror
                parser={chatParser}
                value={content}
                onChange={handleChange}
                height="500px"
                placeholder="Enter chat content..."
              />
            </div>
          </div>

          {/* Parse Result */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Parse Result (AST)</h2>
            <p className="text-sm text-gray-500 mb-3">
              The parsed AST or error message.
            </p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto h-[500px] font-mono">
              {parseResult || 'Start typing to see parse results...'}
            </pre>
          </div>
        </div>

        {/* Format Reference */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Chat Format Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Header</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs">
{`Title: My Chat
Author: Your Name
~~~~`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">Dialogue</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs">
{`Speaker: Message text here.
Speaker: With metadata [key=value]`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">Section Headers</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs">
{`Section Name
------------`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">Metadata Line</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs">
{`[id=myid mood=happy class=highlight]
Speaker: Next line gets this metadata`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">Commands</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs">
{`--- pause ---
--- wait activity_id ---
--- custom command ---`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">Arrow Commands</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs">
{`source -> target
sidebar -> main_content`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
