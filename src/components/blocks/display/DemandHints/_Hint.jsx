// src/components/blocks/display/DemandHints/_Hint.jsx
'use client';

import React, { use } from 'react';
import { renderCompiledKids } from '@/lib/render';

export default function _Hint(props) {
  const kids = use(renderCompiledKids(props));
  return <>{kids}</>;
}
