import TextBlock from '@/components/blocks/TextBlock';
import QuestionBlock from '@/components/blocks/QuestionBlock';
import Lesson from '@/components/blocks/Lesson';
const COMPONENT_MAP = {
  TextBlock,
  QuestionBlock,
  Lesson,
  problem: ({ kids, urlMap }) => <div className="border p-4 space-y-2">{renderXmlTree(kids, urlMap)}</div>
};


import React from 'react';

function isJSXElement(x) {
  return React.isValidElement(x);
}

function isXmlNode(x) {
  return typeof x === 'object' && x !== null && !React.isValidElement(x);
}

export function renderXmlTree(tree, urlMap = {}) {
  return tree.map((node, i) => {
    if (isJSXElement(node)) return node; // Already rendered

    const tag = Object.keys(node).find(k => k !== '#text' && k !== ':@');
    if (!tag) return (<pre>[No Tag]</pre>);

    const element = node[tag];
    const attributes = node[':@'] || {};
    const children = Array.isArray(element)
      ? renderXmlTree(element, urlMap)
      : element?.['#text'] || null;

    const Component =
      COMPONENT_MAP[tag] ||
      COMPONENT_MAP[tag.charAt(0).toUpperCase() + tag.slice(1)];

    return Component ? (
      <Component key={i} {...attributes} urlMap={urlMap} kids={element}>
      </Component>
    ) : (
      <pre key={i}>[NULL: unknown tag "{tag}"]</pre>
    );
  });
}

