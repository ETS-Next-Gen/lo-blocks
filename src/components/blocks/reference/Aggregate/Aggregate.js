// src/components/blocks/utility/Aggregate/Aggregate.js
//
// Aggregation block
// -----------------
// Gathers values from a set of target blocks and exposes a single aggregated
// value via getValue(). This is useful for composing scores (e.g., sums),
// joining values, or templating a string from collected inputs.

import { core } from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import { componentFieldByName, fieldSelector, valueSelector } from '@/lib/state';
import _Noop from '../../layout/_Noop';

/**
 * Parse a comma/whitespace separated target list into a unique array.
 */
function parseTargetList(rawTargets = '') {
  return Array.from(
    new Set(
      String(rawTargets)
        .split(/[\n\s,]+/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    )
  );
}

function resolveTargetValue(props, state, targetId, fieldName) {
  try {
    if (fieldName) {
      const field = componentFieldByName(props, targetId, fieldName);
      return { id: targetId, value: fieldSelector(state, props, field, { id: targetId }) };
    }

    return { id: targetId, value: valueSelector(props, state, targetId, { fallback: undefined }) };
  } catch (error) {
    return { id: targetId, error: error?.message ?? String(error) };
  }
}

function toNumber(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function aggregateValues(strategy, entries, { separator = ', ', template } = {}) {
  const definedEntries = entries.filter(({ value }) => value !== undefined && value !== null);
  const definedValues = definedEntries.map(({ value }) => value);

  if (strategy === 'join') {
    return definedValues.map((value) => String(value)).join(separator);
  }

  if (strategy === 'template') {
    const joinedValues = definedValues.map((value) => String(value)).join(separator);
    const valueMap = definedEntries.reduce((map, { id, value }) => {
      map[id] = String(value);
      return map;
    }, {});

    return String(template ?? '{{values}}').replace(/{{\s*([^}\s]+)\s*}}/g, (match, key) => {
      if (key === 'values') {
        return joinedValues;
      }

      return key in valueMap ? valueMap[key] : '';
    });
  }

  const numericValues = definedValues.map(toNumber).filter((value) => value !== undefined);
  if (!numericValues.length) {
    return null;
  }

  return numericValues.reduce((sum, value) => sum + value, 0);
}

const Aggregate = core({
  ...parsers.ignore(),
  name: 'Aggregate',
  description: 'Aggregates values from multiple targets without rendering UI output.',
  component: _Noop,
  internal: false,
  getValue: (props, state, id) => {
    const aggregateNode = props.idMap?.[id];
    const targetAttr = aggregateNode?.attributes?.target;
    const fieldName = aggregateNode?.attributes?.field;
    const strategy = aggregateNode?.attributes?.strategy ?? 'sum';
    const separator = aggregateNode?.attributes?.separator ?? ', ';
    const template = aggregateNode?.attributes?.template;

    const targets = parseTargetList(targetAttr);
    const entries = targets.map((targetId) => resolveTargetValue(props, state, targetId, fieldName));
    const resolvedEntries = entries.filter((entry) => entry.error === undefined);

    return aggregateValues(strategy, resolvedEntries, { separator, template });
  },
});

export default Aggregate;