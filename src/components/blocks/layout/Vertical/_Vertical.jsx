// src/components/blocks/Vertical/_Vertical.jsx
import React, { use } from 'react';
import { renderCompiledKids } from '@/lib/render';

export function _Vertical( props ) {
  const kids = use(renderCompiledKids({ ...props, kids: props.kids }));
  return (
    <div className="vertical-container">
      {kids}
    </div>
  );
}