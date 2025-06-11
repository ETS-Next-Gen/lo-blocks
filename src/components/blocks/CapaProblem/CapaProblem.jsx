import crypto from 'crypto';
import { dev } from '@/lib/blocks';
import { childParser } from '@/lib/olx/parsers';
import _CapaProblem from './_CapaProblem';

function isXBlockTag(tag) {
  if (!tag) return false;
  const first = tag[0];
  return first === first.toUpperCase();
}

const capaParser = childParser(function capaProblemParser({ rawKids, storeEntry, provenance }) {
  function createId(node) {
    const attrs = node[':@'] || {};
    if (attrs.id || attrs.url_name) return attrs.id || attrs.url_name;
    const canonical = JSON.stringify(node);
    return crypto.createHash('sha1').update(canonical).digest('hex');
  }

  function parseChild(node) {
    if (node['#text'] !== undefined) {
      const text = node['#text'];
      if (text.trim() === '') return null;
      return { type: 'text', text };
    }
    const tag = Object.keys(node).find(k => ![':@', '#text', '#comment'].includes(k));
    if (!tag) return null;
    const attributes = node[':@'] || {};
    const kids = node[tag];
    const childKids = Array.isArray(kids) ? kids.map(parseChild).filter(Boolean) : [];

    if (isXBlockTag(tag)) {
      const id = createId(node);
      storeEntry(id, { id, tag, attributes, provenance, rawParsed: node, kids: childKids });
      return { type: 'xblock', id };
    }

    return { type: 'html', tag, attributes, id: attributes.id, kids: childKids };
  }
  return rawKids.map(parseChild).filter(Boolean);
});

function collectIds(nodes) {
  let ids = [];
  for (const n of nodes || []) {
    if (!n) continue;
    if (n.type === 'xblock' && n.id) ids.push(n.id);
    if (n.type === 'html') ids = ids.concat(collectIds(n.kids));
  }
  return ids;
}

capaParser.staticKids = entry => collectIds(entry.kids);

const CapaProblem = dev({
  ...capaParser,
  name: 'CapaProblem',
  component: _CapaProblem
});

export default CapaProblem;
