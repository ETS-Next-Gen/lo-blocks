import React from 'react';
import { debugLog, DisplayError } from '@/lib/debug';
import { COMPONENT_MAP } from '@/components/componentMap';

// Main render function: handles single nodes, strings, JSX, and blocks
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
        <DisplayError
          id={`missing-id-${node}`}
          name="render"
          message={`Could not resolve node ID "${node}" in idMap`}
          data={{ node, idMap }}
        />
      );
    }
    return render({ node: entry, idMap, key });
  }

  // Handle structured OLX-style node
  const { tag, attributes = {}, children = [] } = node;
  const Component = COMPONENT_MAP[tag];

  if (!Component) {
    return (
      <DisplayError
        id={`unknown-tag-${tag}`}
        name="render"
        message={`No component found for tag "${tag}"`}
        data={node}
      />
    );
  }

  return (
    <Component {...attributes} kids={children} idMap={idMap} />
  );
}


// Render children array that may include: text, JSX, OLX, etc.
export function renderCompiledChildren({ children, idMap }) {
  if (!Array.isArray(children)) {
    return [
      <DisplayError
        name="renderCompiledChildren"
        message={`Expected children to be an array, got ${typeof children}`}
        data={children}
      />
    ];
  }

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
          <DisplayError
            name="renderCompiledChildren"
            message={`Unknown child type: "${type}"`}
            data={child}
          />
        );
    }
  });
}
