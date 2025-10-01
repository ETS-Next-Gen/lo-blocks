// src/components/blocks/TeamDirectory.js
import { core } from '@/lib/blocks';
import * as state from '@/lib/state';
import { fieldSelector, fieldByName } from '@/lib/state';
import * as parsers from '@/lib/content/parsers';
import _TeamDirectory from './_TeamDirectory';

export const fields = state.fields([
  'selectedMember',   // Currently selected team member ID
  'viewMode'          // 'grid' or 'detail' view mode
]);

const TeamDirectory = core({
  ...parsers.blocks(),
  name: 'TeamDirectory',
  description: 'Interactive team directory showing team members with details and bios',
  component: _TeamDirectory,
  fields: fields,
  getValue: (props, state, id) => {
    const selectedMember = fieldSelector(state, props, fieldByName('selectedMember'), { fallback: null, id });
    const viewMode = fieldSelector(state, props, fieldByName('viewMode'), { fallback: 'grid', id });
    return { selectedMember, viewMode };
  }
});

export default TeamDirectory;