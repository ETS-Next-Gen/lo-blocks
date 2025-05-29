import React from 'react';
import { dev } from '@/lib/blocks';
import { _UseDynamic } from './_UseDynamic';

import { ignore } from '@/lib/olx/parsers';

/*
  This is obsolete code from when we wanted a much more
  general-purpose Use. It supported static (now Use), a target, or a
  list of targets / children to pick from. We'll briefly commit it to
  the repo if we ever want to revisit, and then remove.

import { childParser } from '@/lib/olx/parsers';


const parser = childParser(function useParser({ attributes, rawChildren, parse }) {
    const { ref, initial, initial_ref, select } = attributes;

    if (ref) {
      // Static usage
      return { resolvedId: ref };
    }

    if (initial || initial_ref) {
      // Placeholder (dynamic / LLM-driven etc)
      return { resolvedId: initial || initial_ref };
    }

    if (select) {
      // Conditional (TODO: runtime selector support)
      const options = rawChildren
        .filter(child => Object.keys(child).includes('Option'))
        .map(optionNode => {
          const node = optionNode['Option'];
          const attrs = optionNode[':@'] || {};
          return {
            value: attrs.value || null,
            isDefault: 'default' in attrs,
            ref: attrs.ref,
          };
        });

      // Fallback: just return default option
      const fallback = options.find(o => o.isDefault);
      if (fallback?.ref) return { resolvedId: fallback.ref };

      return {};
    }

  return {};
});*/

const UseDynamic = dev({
  name: 'UseDynamic',
  component: _UseDynamic,
  parser: ignore,
  namespace: 'org.mitros.dev',
  description: 'Include a component block.'
});

export default UseDynamic;
