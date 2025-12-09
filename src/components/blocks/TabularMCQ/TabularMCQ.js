// src/components/blocks/TabularMCQ/TabularMCQ.js
import { dev } from '@/lib/blocks';
import * as state from '@/lib/state';
import { fieldSelector, fieldByName } from '@/lib/state';
import * as parsers from '@/lib/content/parsers';
import _TabularMCQ from './_TabularMCQ';

export const fields = state.fields(['value']);

const TabularMCQ = dev({
  ...parsers.blocks(),
  name: 'TabularMCQ',
  description: 'Tabular multiple choice input with rows and columns',
  component: _TabularMCQ,
  fields,
  getValue: (props, state, id) => {
    const value = fieldSelector(state, { ...props, id }, fieldByName('value'), { fallback: {} });
    return { value, rows: props.rows || [], cols: props.cols || [] };
  },
});

export default TabularMCQ;
