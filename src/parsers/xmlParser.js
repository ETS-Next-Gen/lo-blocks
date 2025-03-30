import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  preserveOrder: true
});

export function parseLessonFile(filePath) {
  const xmlString = fs.readFileSync(filePath, 'utf-8');
  const parsed = parser.parse(xmlString);

  const urlMap = {};
  const sourceMeta = { file: filePath };

  function indexNodes(nodes) {
    for (const node of nodes) {
      const tag = Object.keys(node).find(k => k !== '#text');
      if (!tag) continue;
      const element = node[tag];
      if (element.url_name) {
        urlMap[element.url_name] = { tag, ...element, __meta: sourceMeta };
      }
      if (element.children) {
        indexNodes(element.children);
      }
    }
  }

  indexNodes(parsed);

  return {
    tree: parsed,
    urlMap
  };
}
