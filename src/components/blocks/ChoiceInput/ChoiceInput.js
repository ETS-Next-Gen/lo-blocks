// src/components/blocks/ChoiceInput/ChoiceInput.js
import { core } from '@/lib/blocks';
import * as state from '@/lib/state';
import * as parsers from '@/lib/content/parsers';
import _Noop from '../_Noop';
import { inferRelatedNodes } from '@/lib/blocks/olxdom';

export const fields = state.fields(['value']);

const ChoiceInput = core({
  ...parsers.blocks,
  name: 'ChoiceInput',
  component: _Noop,
  fields,
  getValue: (reduxState, id, props = {}) => {
    const value = reduxState?.[id]?.value ?? '';
    const ids = inferRelatedNodes(props, {
      selector: n => n.blueprint.name === 'Key' || n.blueprint.name === 'Distractor',
      infer: ['kids'],
      targets: props.targets
    });
    const choices = ids.map(cid => {
      const inst = props.idMap?.[cid];
      return { id: cid, tag: inst?.tag };
    });
    // BUG: For some reason, choices is:
    /* [
      {
      "id": "CapaMCQDemo_grader_0",
      "tag": "KeyGrader"
      },
      {
      "id": "CapaMCQDemo_key_0",
      "tag": "Key"
      },
      {
      "id": "CapaMCQDemo_distractor_1",
      "tag": "Distractor"
      }
      ]
    */
    // console.log(choices) to see it.
    //
    // The selector should preclude the KeyGrader. We should figure out what's going on.
    return { value, choices };
  }
});

export default ChoiceInput;
