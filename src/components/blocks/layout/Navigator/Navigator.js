// src/components/blocks/layout/Navigator/Navigator.js
//
// PROTOTYPE: Two-pane navigator with list on left and detail on right.
// Uses YAML text content for item data, references blocks for preview/detail templates.
//

import { z } from 'zod';
import { dev } from '@/lib/blocks';
import * as state from '@/lib/state';
import { fieldSelector, fieldByName } from '@/lib/state';
import * as parsers from '@/lib/content/parsers';
import { srcAttributes } from '@/lib/blocks/attributeSchemas';
import _Navigator from './_Navigator';

export const fields = state.fields([
  'selectedItem',     // Currently selected item ID
  'searchQuery',      // Search/filter text
  'viewMode'          // Optional view mode state
]);

const Navigator = dev({
  ...parsers.text(),
  name: 'Navigator',
  description: 'Two-pane navigator with configurable preview and detail templates',
  component: _Navigator,
  fields: fields,
  getValue: (props, state, id) => {
    const selectedItem = fieldSelector(state, props, fieldByName('selectedItem'), { fallback: null, id });
    const searchQuery = fieldSelector(state, props, fieldByName('searchQuery'), { fallback: '', id });
    const viewMode = fieldSelector(state, props, fieldByName('viewMode'), { fallback: 'default', id });
    return { selectedItem, searchQuery, viewMode };
  },
  attributes: srcAttributes.extend({
    previewBlock: z.string().optional().describe('ID of block to use as preview template'),
    detailBlock: z.string().optional().describe('ID of block to use as detail template'),
  }),
});

export default Navigator;
