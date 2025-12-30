// src/components/blocks/test/_DevProblem.jsx
'use client';

import React, { use } from 'react';
import { renderCompiledKids } from '@/lib/render';

export function _DevProblem(props) {
  const kids = use(renderCompiledKids(props));
  return (
    <div className="border p-4 space-y-2">
      {kids}
    </div>
  );
}
