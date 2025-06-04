'use client';

import React from 'react';
import { executeNodeActions } from '@/lib/blocks';
import { renderCompiledChildren } from '@/lib/render';

function _ActionButton(props) {
  const { label } = props;
  const onClick = () => executeNodeActions(props);
  return (
    <button onClick={onClick} className="bg-blue-600 text-white px-3 py-1 rounded">
      {label}
      {renderCompiledChildren( props )}
    </button>
  );
}

export default _ActionButton;
