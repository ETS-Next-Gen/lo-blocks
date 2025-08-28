// src/components/blocks/_Visible.jsx
/*
 * Factory for creating components that conditionally render their children.
 * When visible is true, children are rendered like a no-op container.
 * When visible is false, children are processed but not displayed.
 */

import React from 'react';
import { renderCompiledKids } from '@/lib/render';

export default function makeVisible(visible = true) {
  return function Visible(props) {
    if (visible) {
      return <>{props.kids && renderCompiledKids(props)}</>;
    }
    if (props.kids) {
      renderCompiledKids(props);
    }
    return null;
  };
}
