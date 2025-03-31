import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

import { XMLParser } from 'fast-xml-parser';
import { COMPONENT_MAP } from '@/components/componentMap';

import * as parsers from '@/lib/olx/childParsers';

const defaultChildParser = parsers.xblocks;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  preserveOrder: true,
  commentPropName: '#comment',
  preserveTextNodeWhiteSpaces: true,
  trimValues: false
});

const contentCache = {
  byFile: {},
  byId: {}
};

function createId(node) {
  const attributes = node[':@'] || {};
  const id = attributes.url_name || attributes.id;
  if (id) return id;

  const canonical = JSON.stringify(node);
  return crypto.createHash('sha1').update(canonical).digest('hex');
}


export async function loadContentTree(contentDir = './content') {
  const xmlFiles = await getXmlFilesRecursively(contentDir);

  for (const fullPath of xmlFiles) {
    const relativePath = path.relative(contentDir, fullPath);
    const stat = await fs.stat(fullPath);
    const prev = contentCache.byFile[relativePath];

    if (!prev || stat.mtimeMs > prev.mtimeMs) {
      const xml = await fs.readFile(fullPath, 'utf-8');
      const parsed = parser.parse(xml);

      if (prev && prev.nodes) {
        for (const nodeId of prev.nodes) {
          delete contentCache.byId[nodeId];
        }
      }

      const indexedIds = indexParsed(parsed, relativePath);

      contentCache.byFile[relativePath] = {
        mtimeMs: stat.mtimeMs,
        parsed,
        nodes: indexedIds
      };
    }
  }

  return {
    parsed: contentCache.byFile,
    idMap: contentCache.byId
  };
}

// Inline helper: recursively walk a directory to find .xml files
async function getXmlFilesRecursively(dir) {
  let files = [];

  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const subFiles = await getXmlFilesRecursively(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile() && fullPath.endsWith('.xml')) {
      files.push(fullPath);
    }
  }

  return files;
}

function indexParsed(parsedTree, sourceFile) {
  const indexed = [];

  function shouldUpdateExistingEntry(existing, incoming) {
    // References shouldn't override definitions.
    //
    // E.g. <problem id="foo" attr="bar"/> <problem id="foo"/>
    //
    // Should use the former to define.
    if (!existing) return true;
    const hasContent = (entry) => {
      const attrs = entry.attributes || {};
      const meaningfulAttrs = Object.keys(attrs).filter(
        (k) => k !== 'id' && k !== 'url_name'
      );
      const hasAttrs = meaningfulAttrs.length > 0;
      const hasChildren = (entry.children || []).length > 0;

      return hasAttrs || hasChildren;
    };

    const existingHasContent = hasContent(existing);
    const incomingHasContent = hasContent(incoming);

    if (incomingHasContent && !existingHasContent) {
      return true;
    }

    if (existingHasContent && incomingHasContent) {
      console.warn(`[OLX Parse Error] Duplicate content for id="${incoming.id}"`);
      console.warn(`First seen in ${existing.sourceFile}, then in ${incoming.sourceFile}`);
      throw new Error(`Duplicate definition for id="${incoming.id}" with conflicting content.`);
    }

    return false; // Keep existing (probably a reference), new one is empty
  }
  
  function parseNode(node, parentRawXml = null) {
    const tag = Object.keys(node).find(k => ![':@', '#text', '#comment'].includes(k));
    if (!tag) return null;

    const attributes = node[':@'] || {};
    const element = node[tag];

    const id = attributes.id || attributes.url_name || createId(node);

    const rawParsed = node;
    const Component = COMPONENT_MAP[tag] || COMPONENT_MAP[tag.charAt(0).toUpperCase() + tag.slice(1)];
    const childParser = Component?.childParser || defaultChildParser;

    // Allow parser to recurse back in
    const parse = parseNode;

    const children = childParser({
      rawParsed: element,
      tag,
      attributes,
      parse,
      sourceFile
    }) || [];

    const newEntry = {
      id,
      tag,
      attributes,
      children,
      rawParsed,
      sourceFile
    };

    if (shouldUpdateExistingEntry(contentCache.byId[id], newEntry)) {
      contentCache.byId[id] = newEntry;
    }
    indexed.push(id);
    return id;
  }

  if (Array.isArray(parsedTree)) {
    parsedTree.forEach(node => parseNode(node));
  } else {
    parseNode(parsedTree);
  }

  return indexed;
}
