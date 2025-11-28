// src/components/blocks/_LikertScale.jsx
'use client';

import React, { useMemo } from 'react';
import { useReduxState } from '@/lib/state';
import { render } from '@/lib/render';

const DEFAULT_SCALE = [
  'Strongly disagree',
  'Disagree',
  'Neither agree nor disagree',
  'Agree',
  'Strongly agree'
];

function normalizeBoolean(value, defaultValue = false) {
  if (value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (['true', '1', 'yes', 'y', 'on'].includes(lower)) return true;
    if (['false', '0', 'no', 'n', 'off'].includes(lower)) return false;
  }
  return defaultValue;
}

function parseScaleOptions({ scale, options, labels, scaleDelimiter }) {
  const source = scale ?? options ?? labels;
  if (!source) {
    return DEFAULT_SCALE;
  }

  const delimiter = typeof scaleDelimiter === 'string' && scaleDelimiter.length > 0
    ? scaleDelimiter
    : (source.includes('|') ? '|' : ',');

  const parsed = source
    .split(delimiter)
    .map(option => option.trim())
    .filter(option => option.length > 0);

  return parsed.length > 0 ? parsed : DEFAULT_SCALE;
}

// TODO this function doesn't really work in our context
// it might be more practical to render the block
function extractStatementLabel(childBlock, fallback) {
  if (!childBlock) return fallback;
  const { attributes = {} } = childBlock;
  return (
    attributes.label ||
    attributes.title ||
    attributes.name ||
    attributes.question ||
    fallback
  );
}

function _LikertScale(props) {
  const {
    kids = [],
    idMap,
    fields,
    componentMap,
    nodeInfo,
    title,
    description,
    scale,
    options,
    labels,
    scaleDelimiter,
    summaryHeading = 'Selections',
    id: componentId,
    allowReset = true,
    readOnly: readOnlyProp,
    showSummary = true
  } = props;

  const defaultResponses = useMemo(() => ({}), []);
  const [responses = defaultResponses, setResponses] = useReduxState(
    props,
    fields.responses,
    defaultResponses
  );

  const scaleOptions = useMemo(
    () => parseScaleOptions({ scale, options, labels, scaleDelimiter }),
    [scale, options, labels, scaleDelimiter]
  );

  const readOnly = useMemo(() => normalizeBoolean(readOnlyProp, false), [readOnlyProp]);
  const summaryEnabled = useMemo(() => normalizeBoolean(showSummary, true), [showSummary]);
  const resetEnabled = useMemo(() => normalizeBoolean(allowReset, true), [allowReset]);

  const statements = useMemo(() => {
    return kids
      .filter(child => child && typeof child === 'object' && child.type === 'block')
      .map((child, index) => {
        const block = idMap?.[child.id];
        console.log(child, block);
        const label = extractStatementLabel(block, `Statement ${index + 1}`);
        return {
          id: child.id,
          child,
          label
        };
      });
  }, [kids, idMap]);

  const handleSelect = (statementId, option, optionIndex) => {
    if (readOnly) return;
    const next = {
      ...responses,
      [statementId]: {
        value: option,
        index: optionIndex
      }
    };
    setResponses(next);
  };

  const handleReset = () => {
    if (readOnly) return;
    if (Object.keys(responses ?? {}).length === 0) return;
    setResponses({});
  };

  if (statements.length === 0) {
    return (
      <div className="likert-scale__empty">
        No statements provided. Add child blocks (e.g., TextBlock or Markdown) inside <code>&lt;LikertScale&gt;</code> to define rows.
      </div>
    );
  }

  return (
    <div className="likert-scale-component">
      {(title || description) && (
        <div className="likert-scale__header">
          {title && <h3 className="likert-scale__title">{title}</h3>}
          {description && <p className="likert-scale__description">{description}</p>}
        </div>
      )}

      <div className="likert-scale__table-wrapper">
        <table className="likert-scale__table">
          <thead>
            <tr>
              <th scope="col">Statement</th>
              {scaleOptions.map((optionLabel, optionIndex) => (
                <th scope="col" key={`likert-header-${optionIndex}`}>
                  {optionLabel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {statements.map((statement, rowIndex) => {
              const response = responses?.[statement.id];
              const name = `${componentId || 'LikertScale'}_${statement.id || rowIndex}`;
              return (
                <tr key={statement.id}>
                  <th scope="row" className="likert-scale__statement">
                    <div className="likert-scale__statement-content">
                      {render({
                        node: statement.child,
                        idMap,
                        nodeInfo,
                        componentMap
                      })}
                    </div>
                  </th>
                  {scaleOptions.map((optionLabel, optionIndex) => {
                    const inputId = `${name}_${optionIndex}`;
                    const isSelected = response?.index === optionIndex;
                    return (
                      <td key={inputId} className="likert-scale__cell">
                        <label className="likert-scale__choice">
                          <input
                            id={inputId}
                            type="radio"
                            name={name}
                            value={optionLabel}
                            className="likert-scale__radio"
                            checked={isSelected}
                            onChange={() => handleSelect(statement.id, optionLabel, optionIndex)}
                            disabled={readOnly}
                          />
                          <span className="likert-scale__sr-only">
                            {`${optionLabel} for ${statement.label}`}
                          </span>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(summaryEnabled || (resetEnabled && !readOnly)) && (
        <div className="likert-scale__footer">
          {summaryEnabled && (
            <div>
              {summaryHeading && (
                <h4 className="likert-scale__summary-title">{summaryHeading}</h4>
              )}
              <dl className="likert-scale__summary-list">
                {statements.map((statement, index) => {
                  const response = responses?.[statement.id];
                  return (
                    <div key={`summary-${statement.id}`} className="likert-scale__summary-item">
                      <dt className="likert-scale__summary-label">
                        {statement.label || `Statement ${index + 1}`}
                      </dt>
                      <dd className="likert-scale__summary-value">
                        {response ? scaleOptions[response.index] : 'No response yet'}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}

          {resetEnabled && !readOnly && (
            <button
              type="button"
              onClick={handleReset}
              className="likert-scale__reset-button"
              disabled={Object.keys(responses ?? {}).length === 0}
            >
              Reset responses
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default _LikertScale;
