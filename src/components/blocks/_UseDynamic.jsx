import React from 'react';
import { render } from '@/lib/render';

export function _UseDynamic({ target, idMap }) {
  if (!target) {
    return <pre className="text-red-500">[Missing &lt;Use&gt; resolution]</pre>;
  }

  return render({ node: target, idMap });
}
