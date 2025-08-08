// src/components/blocks/CapaProblem/_CapaProblem.jsx
'use client';
import React from 'react';
import { renderCompiledKids, render as renderNode } from '@/lib/render';
import { inferRelatedNodes } from '@/lib/blocks/olxdom';
import './capaproblem.css';

export default function _CapaProblem(props) {
  const { id, kids = [] } = props;

  // First render problem content to populate dynamic OLX DOM (renderedKids)
  const content = renderCompiledKids({ ...props, kids });

  // Then infer grader targets from the now-populated nodeInfo
  const graderIds = inferRelatedNodes(props, {
    selector: n => n.blueprint?.isGrader,
    infer: props.infer,
    targets: props.targets
  });

  // Build header and footer controls
  const nodes = [];
  if (graderIds.length > 0) {
    const targets = graderIds.join(',');
    nodes.push({ id: `${id}_header_status`, region: 'header', node: { tag: 'Correctness', attributes: { targets }, kids: [] } });
    nodes.push({ id: `${id}_footer_button`, region: 'footer', node: { tag: 'ActionButton', attributes: { label: 'Check', targets }, kids: [] } });
    nodes.push({ id: `${id}_footer_message`, region: 'footer', node: { tag: 'StatusText', attributes: { field: 'message', targets }, kids: [] } });
  }

  const headerNodes = nodes.filter(n => n.region === 'header').map((n, i) =>
    renderNode({ node: { ...n.node, id: n.id }, idMap: props.idMap, nodeInfo: props.nodeInfo, componentMap: props.componentMap, idPrefix: props.idPrefix, key: `${n.id}-${i}` })
  );
  const footerNodes = nodes.filter(n => n.region === 'footer').map((n, i) =>
    renderNode({ node: { ...n.node, id: n.id }, idMap: props.idMap, nodeInfo: props.nodeInfo, componentMap: props.componentMap, idPrefix: props.idPrefix, key: `${n.id}-${i}` })
  );

  const title = props.displayName || props.display_name || props.title || props.id || 'Problem';

  return (
    <div className="lo-problem">
      <div className="lo-problem__header">
        <div className="lo-problem__title">{title}</div>
        <div className="lo-problem__status">{headerNodes}</div>
      </div>
      <div className="lo-problem__content">
        {content}
      </div>
      <div className="lo-problem__footer">
        <div className="lo-problem__actions">{footerNodes}</div>
      </div>
    </div>
  );
}
