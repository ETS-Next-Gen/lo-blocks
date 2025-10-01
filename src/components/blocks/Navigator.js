// src/components/blocks/Navigator.js
import { core } from '@/lib/blocks';
import * as state from '@/lib/state';
import { fieldSelector, fieldByName } from '@/lib/state';
import * as parsers from '@/lib/content/parsers';
import _Navigator from './_Navigator';

export const fields = state.fields([
  'selectedItem',     // Currently selected item ID
  'searchQuery',      // Search/filter text
  'viewMode'          // Optional view mode state
]);

const Navigator = core({
  ...parsers.text(),
  name: 'Navigator',
  description: 'Generic two-pane navigator with configurable preview and detail components',
  component: _Navigator,
  fields: fields,
  getValue: (props, state, id) => {
    const selectedItem = fieldSelector(state, props, fieldByName('selectedItem'), { fallback: null, id });
    const searchQuery = fieldSelector(state, props, fieldByName('searchQuery'), { fallback: '', id });
    const viewMode = fieldSelector(state, props, fieldByName('viewMode'), { fallback: 'default', id });
    return { selectedItem, searchQuery, viewMode };
  }
});

export default Navigator;