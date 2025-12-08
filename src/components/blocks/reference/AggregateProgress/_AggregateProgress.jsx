// src/components/blocks/reference/AggregateProgress/_AggregateProgress.jsx
'use client';

import React, { useMemo } from 'react';
import { useReduxStates, componentFieldByName } from '@/lib/state';

function normalizeTargets(rawTargets) {
  if (!rawTargets) return [];

  if (Array.isArray(rawTargets)) {
    return rawTargets.filter(Boolean);
  }

  if (typeof rawTargets === 'string') {
    return rawTargets
      .split(/[\s,]+/)
      .map((id) => id.trim())
      .filter(Boolean);
  }

  return [];
}

/**
 * Simple visualization component for the useReduxStates hook.
 *
 * Provide one or more target IDs and a field name (default: "value"). The
 * hook reads the same field across each target and renders the results in a
 * list for quick inspection.
 */
export function _AggregateProgress(props) {
  const {
    target,
    targets,
    ids,
    field = 'value',
    fallback = '',
    asObject = false,
    heading = 'Aggregated state values'
  } = props;

  const targetIds = useMemo(
    () => normalizeTargets(targets ?? ids ?? target),
    [targets, ids, target]
  );

  if (targetIds.length === 0) {
    return (
      <pre className="text-red-500">
        [UseReduxStates requires at least one target id]
      </pre>
    );
  }

  // Validate that each target exposes the requested field; use the first
  // field reference for the hook invocation.
  const fieldInfo = componentFieldByName(props, targetIds[0], field);
  targetIds.slice(1).forEach((id) => componentFieldByName(props, id, field));

  const values = useReduxStates(props, fieldInfo, targetIds, { fallback, asObject });

  const entries = asObject
    ? Object.entries(values)
    : targetIds.map((id, index) => [id, values[index]]);

  return (
    <div className="space-y-2">
      <div className="font-semibold">{heading}</div>
      <ul className="list-disc pl-4">
        {entries.map(([id, value]) => (
          <li key={id}>
            <span className="font-mono">{id}</span>: <span>{String(value ?? fallback ?? '')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default _AggregateProgress;