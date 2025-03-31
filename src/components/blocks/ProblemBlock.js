import React from 'react';

import * as parsers from '@/lib/olx/parsers';
import { renderCompiledChildren } from '@/lib/render';

export default function ProblemBlock({ kids, idMap }) {
  return (
    <div className="border p-4 space-y-2">
      {renderCompiledChildren({ children: kids, idMap })}
    </div>
  );
}

ProblemBlock.childParser = parsers.xblocks;
