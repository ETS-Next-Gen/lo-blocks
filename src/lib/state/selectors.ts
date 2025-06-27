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
export const fieldSelector = <T>(
  state,
  props,
  field: FieldInfo,
  options: SelectorOptions<T> = {}
): T => {
  const {
    id: optId,
    tag: optTag,
    // TODO: This should run over the field. We do this for when we need multiple fields (ReduxInput),
    // but really, field should be a list
    selector = (s: any) => s?.[field.name],
    fallback,
  } = options;

  const { scope } = field;
  const scopedState = state?.application_state?.[scope];

  const value: T | undefined = (() => {
    switch (scope) {
      case scopes.componentSetting: {
        const tag =
          optTag ??
          props?.blueprint?.OLXName ??
          props.nodeInfo?.node?.tag;
        return selector(scopedState?.[tag]);
      }
      case scopes.system:
        return selector(scopedState);
      case scopes.storage:
      case scopes.component: {
        const id = optId ?? idResolver.reduxId(props);
        return selector(scopedState?.[id]);
      }
      default:
        throw new Error('Unrecognized scope');
    }
  })();

  return value === undefined ? (fallback as T) : value;
};


/** React-friendly wrapper that forwards any equalityFn from options. */
export const useFieldSelector = <T>(
  props: any,               // TODO: narrow when convenient
  field: FieldInfo,
  options: SelectorOptions<T> = {}
): T =>
  useSelector(
    (state) => fieldSelector(state, props, field, options),
    options.equalityFn
  );


// TODO: We should figure out where this goes.
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
