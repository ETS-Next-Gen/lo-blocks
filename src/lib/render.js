import React from 'react';
import { debug, Trace, debugLog } from '@/lib/debug';
import { COMPONENT_MAP } from '@/components/componentMap';

export function render({ node, idMap, key }) {
  if (!node) return null;

  // JSX passthrough
  if (React.isValidElement(node)) return node;

  // Handle list of children
  if (Array.isArray(node)) {
    return renderCompiledChildren({ children: node, idMap });
  }

  // Handle string ID
  if (typeof node === 'string') {
    const entry = idMap?.[node];
    if (!entry) {
      return (
        <pre key={key} className="text-red-500">
          [Missing ID: "{node}"]
        </pre>
      );
    }
    return render({ node: entry, idMap, key });
  }

  // Handle normalized block node
  const { tag, attributes, children } = node;
  const Component =
    COMPONENT_MAP[tag] ||
    COMPONENT_MAP[tag.charAt(0).toUpperCase() + tag.slice(1)];

  if (!Component) {
    return (
      <pre key={key} className="text-red-500">
        [Unknown tag: "{tag}"]
      </pre>
    );
  }

  debugLog(`render>> tag: ${tag}`);
  debugLog(`render>> attributes:`, attributes);
  debugLog(`render>> children:`, children);

  return (
    <Trace tag={tag}>
      <Component {...attributes} kids={children} idMap={idMap} />
    </Trace>
  );
}

// Renders mixed child formats like text, xml, xblock
export function renderCompiledChildren({ children, idMap }) {
  if (!Array.isArray(children)) return null;

  return children.map((child, i) => {
    if (typeof child === 'string') {
      return <React.Fragment key={i}>{child}</React.Fragment>;
    }

    if (React.isValidElement(child)) {
      return <React.Fragment key={i}>{child}</React.Fragment>;
    }

    const { type } = child;

    switch (type) {
      case 'xblock':
        return (
          <React.Fragment key={child.id || i}>
            {render({ node: child.id, idMap, key: `${child.id}_${i}` })}
          </React.Fragment>
        );
      case 'text':
        return <span key={i}>{child.text}</span>;
      case 'xml':
        return (
          <pre key={i} className="bg-gray-50 p-2 rounded text-sm overflow-auto">
            {child.xml}
          </pre>
        );
      case 'cdata':
        return (
          <pre key={i} className="bg-yellow-50 p-2 rounded text-sm overflow-auto">
            {child.value}
          </pre>
        );
      case 'node':
        return (
          <pre key={i} className="bg-blue-50 p-2 rounded text-xs text-gray-700 overflow-auto">
            {JSON.stringify(child.rawParsed, null, 2)}
          </pre>
        );
      default:
        return (
          <pre key={i} className="text-red-500 text-xs">
            [Unknown child type: {child?.type}]
          </pre>
        );
    }
  });
}
