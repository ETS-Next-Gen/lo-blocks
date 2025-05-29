'use client';

import React from 'react';
import { useReduxInput } from '@/lib/blocks';

function _TextInput({ id, className, children, fields }) {
  const [value, inputProps] = useReduxInput(id, fields.value, '');

  return (
    <>
      {children}
      <textarea
        {...inputProps}
        className={className || 'large-input'}
        required
      />
    </>
  );
}

export default _TextInput;
