// src/components/blocks/reference/Aggregate/aggregateUtils.js
// Utility helpers for the Aggregate block to collect target IDs and
// compute summary statistics across multiple components.

import { valueSelector } from '@/lib/state';

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(/[,\s]+/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
}

function boolFromProp(value, defaultValue = true) {
  if (value === undefined) return defaultValue;
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    return normalized !== 'false' && normalized !== '0' && normalized !== 'no';
  }
  return Boolean(value);
}

function collectChildIds(props) {
  const renderedKids = props?.nodeInfo?.renderedKids || {};
  return Object.keys(renderedKids);
}

export function getAggregateTargets(props) {
  const targets = normalizeList(props.targets || props.target);
  const includeChildren = boolFromProp(props.includeChildren, true);
  const childIds = includeChildren ? collectChildIds(props) : [];

  return Array.from(new Set([...targets, ...childIds].filter(Boolean)));
}

function stringifyValue(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (typeof value === 'object') {
    if (typeof value.score === 'number') return String(value.score);
    if (typeof value.value !== 'undefined') return stringifyValue(value.value);
    if (typeof value.text === 'string') return value.text;
    try {
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }

  return String(value);
}

export function computeAggregate(props, state) {
  const targets = getAggregateTargets(props);
  const values = {};
  const errors = [];
  const numericValues = [];

  let completed = 0;
  let correct = 0;

  for (const targetId of targets) {
    try {
      const value = valueSelector(props, state, targetId, { fallback: undefined });
      values[targetId] = value;

      const hasValue = value !== undefined && value !== null && value !== '';
      if (hasValue) {
        completed += 1;
      }

      if (typeof value === 'number') {
        numericValues.push(value);
        if (value === 1) correct += 1;
      } else if (typeof value === 'boolean') {
        if (value) correct += 1;
      } else if (value && typeof value === 'object') {
        if (typeof value.score === 'number') {
          numericValues.push(value.score);
        }
        if (value.correct === true || value.isCorrect === true) {
          correct += 1;
        }
        if (value.completed === true) {
          completed += 1;
        }
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  const sum = numericValues.reduce((acc, current) => acc + current, 0);
  const average = numericValues.length ? sum / numericValues.length : null;
  const joinWith = typeof props.joinWith === 'string' ? props.joinWith : ', ';
  const joined = targets
    .map((id) => stringifyValue(values[id]))
    .filter((entry) => entry !== '')
    .join(joinWith);

  return {
    targets,
    total: targets.length,
    completed,
    correct,
    sum,
    average,
    joined,
    values,
    errors,
    joinWith
  };
}

export function applyAggregateTemplate(template, aggregate) {
  if (!template) return '';
  return template.replace(/{{\s*([^}\s]+)\s*}}/g, (match, key) => {
    if (key in aggregate) {
      return stringifyValue(aggregate[key]);
    }
    if (aggregate.values && Object.prototype.hasOwnProperty.call(aggregate.values, key)) {
      return stringifyValue(aggregate.values[key]);
    }
    return match;
  });
}