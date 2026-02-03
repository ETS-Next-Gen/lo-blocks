// src/components/blocks/SplitPanel/_SplitPanel.jsx
'use client';

import React from 'react';
import Split from 'react-split';
import { useKids } from '@/lib/render';
import { useLocaleAttributes } from '@/lib/i18n/useLocaleAttributes';

function PaneContent({ props, paneKids }) {
  const { kids } = useKids({ ...props, kids: paneKids });
  return <>{kids}</>;
}

export default function _SplitPanel(props) {
  const { kids = {}, sizes = '50,50' } = props;
  const { dir } = useLocaleAttributes();
  const isRtl = dir === 'rtl';

  let firstPane, secondPane;

  // Check if using logical (start/end) or physical (left/right) panes
  const hasStartEnd = Boolean(kids.start || kids.end);
  const hasLeftRight = Boolean(kids.left || kids.right);

  if (hasStartEnd && !hasLeftRight) {
    // Logical panes: StartPane and EndPane adapt to text direction via dir attribute
    // No additional swapping needed - just render in logical order
    firstPane = kids.start ?? [];
    secondPane = kids.end ?? [];
  } else {
    // Physical panes: LeftPane and RightPane need swapping in RTL
    // to keep "left" visually on the left side of the screen
    if (isRtl) {
      firstPane = kids.right ?? [];
      secondPane = kids.left ?? [];
    } else {
      firstPane = kids.left ?? [];
      secondPane = kids.right ?? [];
    }
  }

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
          <PaneContent props={props} paneKids={firstPane} />
        </div>
        <div className="p-2 overflow-auto flex flex-col h-full">
          <PaneContent props={props} paneKids={secondPane} />
        </div>
      </Split>
    </div>
  );
}
