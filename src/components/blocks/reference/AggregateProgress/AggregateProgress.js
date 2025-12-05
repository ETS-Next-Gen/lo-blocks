// src/components/blocks/reference/AggregateProgress.js
import { dev } from '@/lib/blocks';
import * as state from '@/lib/state';
import { ignore } from '@/lib/content/parsers';
import _AggregateProgress from './_AggregateProgress';

export const fields = state.fields(['correct']);

const AggregateProgress = dev({
  ...ignore(),
  name: 'AggregateProgress',
  namespace: 'org.mitros.dev',
  description: 'Aggregates grader correctness values and displays progress.',
  component: _AggregateProgress,
  fields,
});

export default AggregateProgress;