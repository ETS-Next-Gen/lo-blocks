'use client';
import React from 'react';
import { renderCompiledKids } from '@/lib/render';
import ActionButton from '@/components/blocks/ActionButton';
import Correctness from '@/components/blocks/Correctness';
import StatusText from '@/components/blocks/StatusText';

export default function _CapaProblem(props) {
  const { kids, targets = '', description } = props;
  const graderIds = targets.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="space-y-3 p-4 border rounded bg-gray-50">
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
      {renderCompiledKids({ ...props, kids })}
      <div className="flex items-center gap-2">
        <ActionButton label="Check" targets={targets} />
        <Correctness targets={targets} />
        {graderIds.map((id, i) => (
          <StatusText key={id || i} targets={id} />
        ))}
      </div>
    </div>
  );
}
