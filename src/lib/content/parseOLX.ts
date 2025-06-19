// src/lib/content/parseOLX.ts
import crypto from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import { COMPONENT_MAP } from '@/components/componentMap';
import { transformTagName } from '@/lib/content/xmlTransforms';

import * as parsers from '@/lib/content/parsers';
import { Provenance, IdMap } from '@/lib/types';
import { formatProvenance } from '@/lib/storage/provenance';

const defaultParser = parsers.blocks.parser;

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  preserveOrder: true,
  commentPropName: '#comment',
  preserveTextNodeWhiteSpaces: true,
  trimValues: false,
  transformTagName
});

export function parseOLX(xml: string, provenance: Provenance, idMap: IdMap = {}) {
  const parsedTree = xmlParser.parse(xml);
  const indexed: string[] = [];

  function parseNode(node: any): any {
    const tag = Object.keys(node).find(k => ![':@', '#text', '#comment'].includes(k));
    if (!tag) return null;

    const attributes = (node[':@'] || {}) as Record<string, any>;

    if (attributes.ref) {
      if (tag !== 'Use') {
        throw new Error(
          `Invalid 'ref' attribute on <${tag}> in ${formatProvenance(provenance)}. Only <use> elements may have 'ref'.`
        );
      }

      const childKeys = Object.keys(node).filter(
        k => !['Use', ':@', '#text', '#comment'].includes(k)
      );
      if (childKeys.length > 0) {
        throw new Error(
          `<Use ref="..."> in ${formatProvenance(provenance)} must not have kid elements. Found kids: ${childKeys.join(', ')}`
        );
      }

      const allowedAttrs = ['ref'];
      const extraAttrs = Object.keys(attributes).filter(attr => !allowedAttrs.includes(attr));
      if (extraAttrs.length > 0) {
        throw new Error(
          `<Use ref="..."> in ${formatProvenance(provenance)} must not have additional attributes (${extraAttrs.join(', ')}). ` +
          `In the future, these will go into an 'overrides' dictionary.`
        );
      }
      return { type: 'block', id: attributes.ref };
    }

    const id = attributes.id || attributes.url_name || createId(node);

    const Component = COMPONENT_MAP[tag] || COMPONENT_MAP[tag.charAt(0).toUpperCase() + tag.slice(1)];
    if (!Component) {
      console.warn(`[OLX] No component found for tag: <${tag}> — using defaultParser`);
    }
    const parser = (Component?.parser || defaultParser) as any;

    parser({
      id,
      rawParsed: node,
      tag,
      attributes,
      provenance,
      parseNode,
      storeEntry: (storeId: string, entry: any) => {
        if (idMap[storeId]) {
          throw new Error(
            `Duplicate ID "${storeId}" found in ${formatProvenance(provenance)}. Each element must have a unique id.`
          );
        }
        idMap[storeId] = entry;
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

  return { ids: indexed, idMap };
}

function createId(node: any): string {
  const attributes = node[':@'] || {};
  const id = attributes.url_name || attributes.id;
  if (id) return id;

  const canonical = JSON.stringify(node);
  return crypto.createHash('sha1').update(canonical).digest('hex');
}
