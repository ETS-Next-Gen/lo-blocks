// src/components/blocks/TabularMCQ/_TabularMCQ.jsx
'use client';

import React from 'react';
import { useReduxState } from '@/lib/state';
import { renderCompiledKids } from '@/lib/render';
import { DisplayError } from '@/lib/util/debug';

/**
 * Parse YAML-style array string or return array as-is
 * Handles: "['item1', 'item2']" or ["item1", "item2"]
 */
function parseArrayAttribute(attr) {
  if (Array.isArray(attr)) return attr;
  if (typeof attr !== 'string') return [];

  try {
    // Try parsing as JSON (handles ['a', 'b'] format)
    const parsed = JSON.parse(attr.replace(/'/g, '"'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // If JSON parsing fails, try simple comma split
    return attr.split(',').map(s => s.trim()).filter(Boolean);
  }
}

export default function _TabularMCQ(props) {
  const { fields } = props;

  // Parse rows and cols attributes
  const rows = parseArrayAttribute(props.rows);
  const cols = parseArrayAttribute(props.cols);

  // State: { rowIndex: colIndex }
  const [value, setValue] = useReduxState(props, fields.value, {});

  // Validation
  if (!Array.isArray(rows) || rows.length === 0) {
    return (
      <DisplayError
        props={props}
        name="TabularMCQ Error"
        message={`No rows provided. Use rows attribute with YAML list. Received: ${JSON.stringify(props.rows)}`}
      />
    );
  }

  if (!Array.isArray(cols) || cols.length === 0) {
    return (
      <DisplayError
        props={props}
        name="TabularMCQ Error"
        message={`No columns provided. Use cols attribute with YAML list. Received: ${JSON.stringify(props.cols)}`}
      />
    );
  }

  const handleChange = (rowIndex, colIndex) => {
    setValue({
      ...value,
      [rowIndex]: colIndex
    });
  };

  return (
    <div className="tabular-mcq">
      {renderCompiledKids(props)}
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-100 p-2"></th>
            {cols.map((col, colIndex) => (
              <th key={colIndex} className="border border-gray-300 bg-gray-100 p-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-300 p-2 font-medium">{row}</td>
              {cols.map((col, colIndex) => (
                <td key={colIndex} className="border border-gray-300 p-2 text-center">
                  <input
                    type="radio"
                    name={`tabular-mcq-row-${props.id}-${rowIndex}`}
                    checked={value[rowIndex] === colIndex}
                    onChange={() => handleChange(rowIndex, colIndex)}
                    className="cursor-pointer"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
