// src/components/blocks/SplitPanel/_SplitPanel.jsx
'use client';

import React, { use, Suspense } from 'react';
import Split from 'react-split';
import { render } from '@/lib/render';
import Spinner from '@/components/common/Spinner';

function PaneContent({ props, node }) {
  const rendered = use(render({ ...props, node }));
  return <>{rendered}</>;
}

export default function _SplitPanel(props) {
  const { kids = {}, sizes = '50,50' } = props;
  const left = kids.left ?? [];
  const right = kids.right ?? [];

  const parsedSizes = sizes
    .split(',')
    .map(s => parseFloat(s.trim()))
    .filter(n => !isNaN(n));
  const splitSizes = parsedSizes.length === 2 ? parsedSizes : [50, 50];

  return (
    <div className="h-full w-full">
      <Split
        className="flex h-full"
        sizes={splitSizes}
        minSize={100}
        gutterSize={6}
        direction="horizontal"
        style={{ display: 'flex' }}
      >
        <div className="p-2 overflow-auto flex flex-col h-full">
          <Suspense fallback={<Spinner>Loading...</Spinner>}>
            <PaneContent props={props} node={left} />
          </Suspense>
        </div>
        <div className="p-2 overflow-auto flex flex-col h-full">
          <Suspense fallback={<Spinner>Loading...</Spinner>}>
            <PaneContent props={props} node={right} />
          </Suspense>
        </div>
      </Split>
    </div>
  );
}
