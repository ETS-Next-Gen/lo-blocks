// src/lib/state/selectors.ts
'use client';
//
// This file supercedes and obsoletes selectors.ts in lo_assess, which should eventually be removed.

import { useSelector, shallowEqual } from 'react-redux';
import { useRef, useEffect, useCallback } from 'react';
import * as idResolver from '../blocks/idResolver';

import * as lo_event from 'lo_event';
import { FieldInfo } from '../types';
import { scopes } from './scopes';

const UPDATE_INPUT = 'UPDATE_INPUT'; // TODO: Import
const INVALIDATED_INPUT = 'INVALIDATED_INPUT'; // informational


export interface SelectorOptions<T> {
  id?: string;
  tag?: string;
  selector?: (state) => T;
  fallback?: T;
  equalityFn?: (a: T, b: T) => boolean;
}

// --- Selectors ---
export function useFieldSelector<T>(
  props,  // TODO: Change to props type
  field: FieldInfo,
  options: SelectorOptions<T> = {}
): T {
  // HACK. Selector should run over s.?[field], but it's part of our code migration.
  const { id: optId, tag: optTag, fallback, selector = (s: any) => s?.[field.name], ...rest } = options;
  const scope = field.scope; // Default of scopes.component is handled in field creation

  return useSelector(
    state => {
      const s = state?.application_state?.[scope];
      let val;
      switch (scope) {
        case scopes.componentSetting:
          const tag = optTag ?? props?.blueprint?.OLXName ?? props.nodeInfo?.node?.tag;
          val = selector(s?.[tag]);
          break;
        case scopes.system:
          val = selector(s);
          break;
        case scopes.storage:
        case scopes.component:
          const id = optId ?? idResolver.reduxId(props);
          val = selector(s?.[id]);
          break;
        default:
          throw Error("Unrecognized scope");
      }
      return val !== undefined ? val : fallback;
    },
    rest
  );
}

// TODO: We should figure out where this goes.
//
// This should use redux.assertValidField, but we want to be mindful
// of circular imports, etc.

export function useReduxInput(
  props,
  field: FieldInfo,
  fallback = '',
  { updateValidator } = {}
) {
  const scope = field.scope ?? scopes.component;
  const fieldName = field.name;

  const selectorFn = (state) =>
    state && state[fieldName] !== undefined ? state[fieldName] : fallback;

  const value = useFieldSelector(props, field, { selector: selectorFn, fallback });

  const selection = useFieldSelector(
    props,
    field,
    {
      selector: s => ({
        selectionStart: s?.[`${fieldName}.selectionStart`] ?? 0,
        selectionEnd: s?.[`${fieldName}.selectionEnd`] ?? 0
      }),
      equalityFn: shallowEqual
    }
  );

  const id = idResolver.reduxId(props);
  const tag = props?.blueprint.OLXName;

  const onChange = useCallback((event) => {
    const val = event.target.value;
    const selStart = event.target.selectionStart;
    const selEnd = event.target.selectionEnd;
    const payload = {
      scope,
      [fieldName]: val,
      [`${fieldName}.selectionStart`]: selStart,
      [`${fieldName}.selectionEnd`]: selEnd
    };
    if (scope === scopes.component) payload.id = id;
    if (scope === scopes.componentSetting) payload.tag = tag;

    if (updateValidator && !updateValidator(val)) {
      lo_event.logEvent(INVALIDATED_INPUT, payload);
      return;
    }

    lo_event.logEvent(UPDATE_INPUT, payload);
  }, [id, tag, fieldName, updateValidator, scope]);

  const ref = useRef();

  useEffect(() => {
    const input = ref.current;
    if (
      input &&
      document.activeElement === input &&
      selection.selectionStart != null &&
      selection.selectionEnd != null
    ) {
      try {
        input.setSelectionRange(selection.selectionStart, selection.selectionEnd);
      } catch (e) { /* ignore */ }
    }
  }, [value, selection.selectionStart, selection.selectionEnd]);

  // Put ref in the returned props object!
  return [
    value,
    {
      name: fieldName,
      value,
      onChange,
      ref
    }
  ];
}

// Export internals for test
export const __testables = {
};
