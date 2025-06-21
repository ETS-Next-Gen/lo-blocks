// src/lib/content/parseOLX.ts
import SHA1 from 'crypto-js/sha1';

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

export function parseOLX(xml, provenance: Provenance) {
  const idMap: IdMap = {};
  const parsedTree = xmlParser.parse(xml);
  const indexed = [];
  let rootId = null;

  function parseNode(node) {
    const tag = Object.keys(node).find(k => ![':@', '#text', '#comment'].includes(k));
    if (!tag) return null;

    const attributes = node[':@'] || {};

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
    const parser = Component?.parser || defaultParser;

    parser({
      id,
      rawParsed: node,
      tag,
      attributes,
      provenance,
      parseNode,
      storeEntry: (storeId, entry) => {
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

  const rootNode = Array.isArray(parsedTree)
    ? parsedTree.find(n =>
        !!Object.keys(n).find(k => ![':@', '#text', '#comment'].includes(k))
      )
    : parsedTree;

  if (rootNode) {
    const parsedRoot = parseNode(rootNode);
    if (parsedRoot?.id) rootId = parsedRoot.id;
  }

  if (Array.isArray(parsedTree)) {
    parsedTree
      .filter(n => n !== rootNode)
      .forEach(parseNode);
  }

  if (!rootId && indexed.length) rootId = indexed[0];

  return { ids: indexed, idMap, root: rootId };
}

function createId(node) {
  const attributes = node[':@'] || {};
  const id = attributes.url_name || attributes.id;
  if (id) return id;

  const canonical = JSON.stringify(node);
  return SHA1(canonical).toString();
}
