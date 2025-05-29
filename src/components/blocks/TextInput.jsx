import * as blocks from '@/lib/blocks';
import { text as textParser } from '@/lib/olx/parsers';
import _TextInput from './_TextInput';

export const fields = blocks.fields(
  ['value']
);


const TextInput = blocks.core({
  name: 'TextInput',
  component: _TextInput,
  parser: textParser,
  fieldToEventMap: fields,
  getValue: (state, id) => state?.[id]?.value ?? '',
});

export default TextInput;
