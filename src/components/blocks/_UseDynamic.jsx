// src/components/blocks/_UseDynamic.jsx
import React from 'react';
import { render } from '@/lib/render';
import { useReduxInput } from '@/lib/state';

export function _UseDynamic( params ) {
  const [value, inputProps] = useReduxInput(params, params.fields.value, params.target);

  if (!value) {
    return <pre className="text-red-500">[Missing &lt;Use&gt; resolution]</pre>;
  }

  return render({ ...params, node: value });
}
