import { useEffect, useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import { renderXmlTree } from '@/lib/renderXml';

export default function TestLesson() {
  const [rendered, setRendered] = useState(null);

  useEffect(() => {
    async function loadLesson() {
      const res = await fetch('/content/linear-algebra/eigenvalues/lesson1.xml');
      const xml = await res.text();

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        preserveOrder: true
      });

      const parsed = parser.parse(xml);

      const urlMap = {};
      function indexNodes(nodes) {
        for (const node of nodes) {
          const tag = Object.keys(node).find(k => k !== '#text' && k !== ':@');
          if (!tag) continue;
          const element = node[tag];
          const attrs = node[':@'] || {};
          
          if (attrs.url_name) {
            urlMap[attrs.url_name] = {
              tag,
              children: element,
              attributes: attrs
            };
          }

          if (Array.isArray(element)) {
            indexNodes(element);
          }
        }
      }
      indexNodes(parsed);
      const jsx = renderXmlTree(parsed, urlMap);
      setRendered(jsx);
    }

    loadLesson();
  }, []);

  return (<><h1>Test Page</h1><div className="p-8 space-y-4">{rendered}</div></>);
}
