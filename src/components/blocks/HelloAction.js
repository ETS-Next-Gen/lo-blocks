// src/components/blocks/HelloAction.js
import * as parsers from '@/lib/content/parsers';
import { test } from '@/lib/blocks/namespaces';
import { action as actionMixin } from '@/lib/blocks/actionsBase.jsx';
import { NoopBlock } from '@/lib/blocks/NoopBlock';

const HelloAction = test({
  ...parsers.ignore,
  ...actionMixin({
    action: ()=>alert("Hello, World!")
  }),
  name: 'HelloAction',
  component: NoopBlock
});

export default HelloAction;
