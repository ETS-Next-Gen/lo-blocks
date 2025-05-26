import React from 'react';
import { render } from '@/lib/render';

export function _Use({ kids, idMap }) {
  const { resolvedId } = kids || {};

  if (!resolvedId) {
    return <pre className="text-red-500">[Missing &lt;Use&gt; resolution]</pre>;
  }

  return render({ node: resolvedId, idMap });
}
