// src/lib/content/indexXml.ts
import { XMLParser } from 'fast-xml-parser';
import { COMPONENT_MAP } from '@/components/componentMap';
import * as parsers from '@/lib/content/parsers';
import { Provenance } from '@/lib/types';
import { formatProvenance } from '@/lib/storage/provenance';

const defaultParser = parsers.blocks.parser;

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  preserveOrder: true,
  commentPropName: '#comment',
  preserveTextNodeWhiteSpaces: true,
  trimValues: false,
  transformTagName: undefined as any, // to be provided by caller
});

export function setTagNameTransformer(transformer: (tag: string) => string) {
  (xmlParser as any).options.transformTagName = transformer;
}

export function indexXml(
  xml: string,
  provenance: Provenance,
  idMap: Record<string, any>
) {
  const parsedTree = xmlParser.parse(xml);
  const indexed: string[] = [];

  function parseNode(node: any): any {
    const tag = Object.keys(node).find(k => ![':@', '#text', '#comment'].includes(k));
    if (!tag) return null;

    const attributes = node[':@'] || {};

    if (attributes.ref) {
      if (tag !== 'Use') {
        throw new Error(
          `Invalid 'ref' attribute on <${tag}> in ${formatProvenance(provenance)}. Only <use> elements may have 'ref'.`
        );
      }
      const childKeys = Object.keys(node).filter(k => !['Use', ':@', '#text', '#comment'].includes(k));
      if (childKeys.length > 0) {
        throw new Error(
          `<Use ref="..."> in ${formatProvenance(provenance)} must not have kid elements. Found kids: ${childKeys.join(', ')}`
        );
      }
      const allowedAttrs = ['ref'];
      const extraAttrs = Object.keys(attributes).filter(attr => !allowedAttrs.includes(attr));
      if (extraAttrs.length > 0) {
        throw new Error(
          `<Use ref="..."> in ${formatProvenance(provenance)} must not have additional attributes (${extraAttrs.join(', ')}). In the future, these will go into an 'overrides' dictionary.`
        );
      }
      return { type: 'block', id: attributes.ref };
    }

    const id = attributes.id || attributes.url_name || createId(node);

    const Component = COMPONENT_MAP[tag] || COMPONENT_MAP[tag.charAt(0).toUpperCase() + tag.slice(1)];
    if (!Component) {
      console.warn(`[OLX] No component found for tag: <${tag}> — using defaultParser`);
    }
    const parser = Component?.parser || defaultParser;

    parser({
      id,
      rawParsed: node,
      tag,
      attributes,
      provenance,
      parseNode,
      storeEntry: (entryId: string, entry: any) => {
        if (idMap[entryId]) {
          throw new Error(
            `Duplicate ID "${entryId}" found in ${formatProvenance(provenance)}. Each element must have a unique id.`
          );
        }
        idMap[entryId] = entry;
      },
    });

    indexed.push(id);
    return { type: 'block', id };
  }

  if (Array.isArray(parsedTree)) {
    parsedTree.forEach(parseNode);
  } else {
    parseNode(parsedTree);
  }

  return indexed;
}

function leftRotate(n: number, bits: number) {
  return (n << bits) | (n >>> (32 - bits));
}

function sha1(str: string) {
  const msgUint8 = new TextEncoder().encode(str);
  const len = msgUint8.length;
  const withPadding = ((len + 8) >> 6 << 4) + 16;
  const words = new Uint32Array(withPadding);
  for (let i = 0; i < len; i++) {
    words[i >> 2] |= msgUint8[i] << ((3 - i % 4) << 3);
  }
  words[len >> 2] |= 0x80 << ((3 - len % 4) << 3);
  words[withPadding - 1] = len << 3;

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  for (let i = 0; i < words.length; i += 16) {
    const w = new Array(80);
    for (let t = 0; t < 16; t++) w[t] = words[i + t];
    for (let t = 16; t < 80; t++) w[t] = leftRotate(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1);
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    for (let t = 0; t < 80; t++) {
      let f: number, k: number;
      if (t < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (t < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (t < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (leftRotate(a, 5) + f + e + k + w[t]) >>> 0;
      e = d;
      d = c;
      c = leftRotate(b, 30) >>> 0;
      b = a;
      a = temp;
    }
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }

  const out = new Uint32Array([h0, h1, h2, h3, h4]);
  return Array.from(out)
    .map(n => n.toString(16).padStart(8, '0'))
    .join('');
}

export function createId(node: any) {
  const attributes = node[':@'] || {};
  const id = attributes.url_name || attributes.id;
  if (id) return id;

  const canonical = JSON.stringify(node);
  return sha1(canonical);
}
