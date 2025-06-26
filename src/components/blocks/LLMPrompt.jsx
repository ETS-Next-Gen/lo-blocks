import * as blocks from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import * as reduxLogger from 'lo_event/lo_event/reduxLogger.js';
import { run_llm } from '@/lib/llm/client.jsx';
import _Noop from './_Noop';

// src/components/blocks/LLMPrompt.jsx
// Action block to send a prompt to the LLM and store the response in `target`

function parseTextWithRefs(text) {
  const parts = [];
  let idx = 0;
  while (idx < text.length) {
    const open = text.indexOf('{', idx);
    if (open === -1) {
      parts.push({ type: 'text', text: text.slice(idx) });
      break;
    }
    if (open > idx) {
      parts.push({ type: 'text', text: text.slice(idx, open) });
    }
    const close = text.indexOf('}', open + 1);
    if (close === -1) {
      parts.push({ type: 'text', text: text.slice(open) });
      break;
    }
    const id = text.slice(open + 1, close).trim();
    if (id) parts.push({ type: 'ref', id });
    idx = close + 1;
  }
  return parts;
}

const promptParser = parsers.childParser(async function parsePrompt({ rawKids, parseNode }) {
  const kids = [];
  for (const child of rawKids) {
    const tag = Object.keys(child).find(k => !['#text', '#comment', ':@'].includes(k));
    if (tag) {
      const id = await parseNode(child);
      if (id) kids.push({ type: 'block', id });
    } else {
      const text = child['#text'] ?? '';
      if (text) kids.push(...parseTextWithRefs(text));
    }
  }
  return kids;
});
promptParser.staticKids = entry =>
  (Array.isArray(entry.kids) ? entry.kids : [])
    .filter(k => k && k.type === 'block')
    .map(k => k.id);

function doPrompt({ props }) {
  const { kids = [], target, tokens, temperature } = props;
  const textParts = [];
  const state = reduxLogger.store.getState()?.application_state?.component_state || {};

  for (const child of kids) {
    if (child.type === 'text') {
      textParts.push(child.text);
    } else if (child.type === 'ref') {
      const refId = child.id;
      const refInst = props.idMap[refId];
      const refBlueprint = refInst && props.componentMap[refInst.tag];
      if (refBlueprint?.getValue) {
        textParts.push(refBlueprint.getValue(state, refId) ?? '');
      }
    } else if (child.type === 'block') {
      const inst = props.idMap[child.id];
      const blueprint = props.componentMap[inst.tag];
      if (blueprint?.getValue) {
        textParts.push(blueprint.getValue(state, child.id) ?? '');
      }
    }
  }

  const prompt = textParts.join('');
  run_llm(target, { prompt, tokens, temperature });
}

const LLMPrompt = blocks.dev({
  ...promptParser,
  ...blocks.action({ action: doPrompt }),
  name: 'LLMPrompt',
  component: _Noop
});

export default LLMPrompt;
