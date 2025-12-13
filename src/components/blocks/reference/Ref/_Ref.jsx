'use client';

// src/components/blocks/_Ref.jsx
import React from 'react';
import { useValue } from '@/lib/state';
import { DisplayError } from '@/lib/util/debug';

export default function _Ref(props) {
  const { target, visible = true, fallback = '', kids = '' } = props;

  // Target can come from attribute or children text (like Element)
  const targetId = target || (typeof kids === 'string' ? kids : String(kids)).trim();

  if (!targetId) {
    return <DisplayError name="Ref" message="No target specified. Use target attribute or provide component ID as content." data={{props}} />;
  }

  // Check if target block exists
  if (!props.idMap || !props.idMap[targetId]) {
    return <DisplayError name="Ref" message={`Target block "${targetId}" not found`} data={{targetId, availableIds: Object.keys(props.idMap || {})}} />;
  }

  // Call Ref's own getValue via useValue - this is the single source of truth
  // for value formatting and field access
  const value = useValue(props, props.id, { fallback });

  if (String(visible) === 'false') {
    // Still subscribe to value but render nothing
    return <></>;
  }

  // getValue returns a string - check if it's JSON for code styling
  const isJson = typeof value === 'string' &&
    value.length > 2 &&
    ((value.startsWith('{') && value.endsWith('}')) ||
     (value.startsWith('[') && value.endsWith(']')));

  if (isJson) {
    return <code style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{value}</code>;
  }

  return <span>{value}</span>;
}