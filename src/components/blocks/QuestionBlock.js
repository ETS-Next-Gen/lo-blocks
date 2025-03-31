import React from 'react';

import * as parsers from '@/lib/olx/parsers';

import { Trace } from '@/lib/debug';

export default function QuestionBlock({ prompt, url_name, id, options = [] }) {
  const optionList = typeof options === 'string' ? options.split(',') : options;

  console.log(">>>QB", prompt, url_name, id, options);
  
  return (
    <div className="p-4 border rounded">
      <Trace>[QuestionBlock / (url_name: {url_name || 'n/a'} / (id: {id || 'n/a'})]</Trace>
      <p className="mb-2">Prompt: {prompt}</p>
      <ul>
        {optionList.map((opt, i) => (
          <li key={i} className="mb-1">
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
              {opt.trim()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
  
QuestionBlock.childParser = parsers.ignore;
