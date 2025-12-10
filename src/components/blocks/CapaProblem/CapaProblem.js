// src/components/blocks/CapaProblem/CapaProblem.js
import { dev, reduxId } from '@/lib/blocks';
import { isBlockTag } from '@/lib/util';
import { COMPONENT_MAP } from '@/components/componentMap';
import _CapaProblem from './_CapaProblem';

// TODO: Make this parser generic to CapaProblem, HTML, and others
//
// This is a minimal working version. This code should not be treated as clean or canonical.
async function capaParser({ id, tag, attributes, provenance, rawParsed, storeEntry, parseNode }) {
  const tagParsed = rawParsed[tag];
  const rawKids = Array.isArray(tagParsed) ? tagParsed : [tagParsed];
  let inputIndex = 0;
  let graderIndex = 0;
  let nodeIndex = 0;
  const graders = [];

  async function parseChild(node, currentGrader = null) {
    if (node['#text'] !== undefined) {
      const text = node['#text'];
      if (text.trim() === '') return null;
      return { type: 'text', text };
    }
    const childTag = Object.keys(node).find(k => ![':@', '#text', '#comment'].includes(k));
    if (!childTag) return null;
    const childAttrs = node[':@'] ?? {};

    /* TODO: from Open edX OLX, we need to handle cases like:
      if (childTag === 'Label')
      if (childTag === 'Description')
      if (childTag === 'ResponseParam')
    */

    if (isBlockTag(childTag)) {
      const blueprint = COMPONENT_MAP[childTag]?.blueprint;
      let defaultId;
      // TODO: These should not be special cases, but data
      // As is, we can't reuse this for an HTML component
      if (blueprint?.isGrader) {
        defaultId = `${id}_grader_${graderIndex++}`;
      } else if (blueprint?.getValue) {
        // TODO: Probably we should map input IDs to grader IDs. e.g.:
        // [problem_id]_input_[grader_idx]_[input_idx]
        defaultId = `${id}_input_${inputIndex++}`;
      } else {
        defaultId = `${id}_${childTag.toLowerCase()}_${nodeIndex++}`;
      }
      const blockId = reduxId(childAttrs, defaultId);

      // Track grader context for this block and its children
      let mapping = currentGrader;
      if (blueprint?.isGrader) {
        mapping = { id: blockId, inputs: [] };
        graders.push(mapping);
      }

      // Track inputs for grader association
      if (blueprint?.getValue && currentGrader) {
        currentGrader.inputs.push(blockId);
      }

      // Parse children recursively to:
      // 1. Build mixed content for rendering (HTML + blocks)
      // 2. Track nested inputs for grader associations
      const kids = node[childTag];
      const kidsArray = Array.isArray(kids) ? kids : (kids ? [kids] : []);
      const mixedKids = [];
      for (let i = 0; i < kidsArray.length; i++) {
        const childResult = await parseChild(kidsArray[i], mapping);
        if (childResult) mixedKids.push(childResult);
      }

      // Create wrapper node with the computed ID for parseNode
      const nodeWithId = {
        ...node,
        ':@': { ...childAttrs, id: blockId }
      };

      // Use parseNode to invoke the child block's parser
      // This ensures PEG parsers, text parsers, etc. run correctly
      await parseNode(nodeWithId, kidsArray, 0);

      // For container blocks (those using parsers.blocks()), override kids
      // with our mixed content so HTML children are preserved for rendering.
      // Blocks with custom parsers (like PEG) keep their parser's output.
      const usesBlocksParser = !blueprint?.parser ||
        blueprint?.parser?.name?.includes?.('blocksParser') ||
        blueprint?.parser?.name?.includes?.('wrappedParser');

      if (usesBlocksParser && mixedKids.length > 0) {
        storeEntry(blockId, (existing) => ({
          ...existing,
          kids: mixedKids
        }));
      }

      return { type: 'block', id: blockId };
    }

    // Non-block HTML tag - parse children recursively
    const kids = node[childTag];
    const kidsArray = Array.isArray(kids) ? kids : [];
    const childKids = [];
    for (const n of kidsArray) {
      const result = await parseChild(n, currentGrader);
      if (result) childKids.push(result);
    }
    return { type: 'html', tag: childTag, attributes: childAttrs, id: childAttrs.id, kids: childKids };
  }

  const kidsParsed = [];
  for (const n of rawKids) {
    const result = await parseChild(n, null);
    if (result) kidsParsed.push(result);
  }

  // Set target attributes on graders after all parsing is complete
  graders.forEach(g => {
    if (g.inputs.length > 0) {
      storeEntry(g.id, (existing) => ({
        ...existing,
        attributes: { ...existing.attributes, target: g.inputs.join(',') }
      }));
    }
  });

  const entry = { id, tag, attributes, provenance, rawParsed, kids: kidsParsed };
  storeEntry(id, entry);
  return id;
}

function collectIds(nodes = []) {
  return nodes.flatMap(n => {
    if (!n) return [];
    if (n.type === 'block' && n.id) return [n.id];
    if (n.type === 'html') return collectIds(n.kids);
    return [];
  });
}

capaParser.staticKids = entry => collectIds(entry.kids);

const CapaProblem = dev({
  parser: capaParser,
  staticKids: capaParser.staticKids,
  name: 'CapaProblem',
  description: 'Interactive problem container with inputs, grading, and automatic check/status buttons',
  component: _CapaProblem
});

export default CapaProblem;

