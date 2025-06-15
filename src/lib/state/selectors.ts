// src/lib/state/selectors.ts
'use client';
//
// This file supercedes and obsoletes selectors.ts in lo_assess, which should eventually be removed.

import { useSelector, shallowEqual } from 'react-redux';
import { useRef, useEffect, useCallback } from 'react';

import * as lo_event from 'lo_event';
import { FieldSpec } from './fields';
import { scopes } from './scopes';

const UPDATE_INPUT = 'UPDATE_INPUT'; // TODO: Import
const INVALIDATED_INPUT = 'INVALIDATED_INPUT'; // informational

// Unified options type
export interface SelectorOptions<T = any> {
  fallback?: T;
  equalityFn?: (a: T, b: T) => boolean;
  // Consider adding: [key: string]: any; // For future Redux or custom extensions
}
export type SelectorExtraParam<T = any> = SelectorOptions<T> | ((a: T, b: T) => boolean);

// --- Normalize options
function normalizeOptions<T = any>(arg?: SelectorExtraParam<T>): SelectorOptions<T> {
  if (arg === undefined) return {};
  if (typeof arg === 'function') return { equalityFn: arg };
  if (typeof arg === 'object') return arg;
  throw new Error(`[selectors] Invalid selector options: ${arg}`);
}

// --- Selectors ---

export function useApplicationSelector<T = any>(
  selector: (state: any) => T = s => s,
  options?: SelectorExtraParam<T>
): T {
  const { fallback, ...rest } = normalizeOptions(options);
  return useSelector(
    state => {
      const val = selector(state?.application_state);
      return val !== undefined ? val : fallback;
    },
    rest.equalityFn,
  );
}

export function useComponentSelector<T = any>(
  id: string | Record<string, any>,
  selector: (state: any) => T = s => s,
  options?: SelectorExtraParam<T>
): T {
  return useApplicationSelector(
    s => selector(s?.component_state?.[id]),
    options
  );
}

export function useComponentSettingSelector<T = any>(
  tag: string,
  selector: (state: any) => T = s => s,
  options?: SelectorExtraParam<T>
): T {
  return useApplicationSelector(
    s => selector(s?.componentSetting_state?.[tag]),
    options
  );
}

export function useSettingsSelector<T = any>(
  selector: (state: any) => T = s => s,
  options?: SelectorExtraParam<T>
): T {
  return useApplicationSelector(
    s => selector(s?.settings_state),
    options
  );
}

// TODO: We should figure out where this goes.
//
// This should use redux.assertValidField, but we want to be mindful
// of circular imports, etc.

export function useReduxInput(
  props,
  field: FieldSpec,
  fallback = '',
  { updateValidator } = {}
) {
  const scope = field.scope ?? scopes.component;
  const fieldName = field.name;

  let id: string | undefined;
  if (scope === scopes.component) id = props?.id;
  const tag = props?.spec?.OLXName;

  const selectorFn = (state: any) =>
    state && state[fieldName] !== undefined ? state[fieldName] : fallback;

  let value: any;
  let selection: any;

  switch (scope) {
    case scopes.componentSetting:
      value = useComponentSettingSelector(tag, selectorFn);
      selection = useComponentSettingSelector(
        tag,
        s => ({
          selectionStart: s?.[`${fieldName}.selectionStart`] ?? 0,
          selectionEnd: s?.[`${fieldName}.selectionEnd`] ?? 0
        }),
        shallowEqual
      );
      break;
    case scopes.system:
      value = useSettingsSelector(selectorFn);
      selection = useSettingsSelector(
        s => ({
          selectionStart: s?.[`${fieldName}.selectionStart`] ?? 0,
          selectionEnd: s?.[`${fieldName}.selectionEnd`] ?? 0
        }),
        shallowEqual
      );
      break;
    case scopes.component:
    default:
      value = useComponentSelector(id, selectorFn);
      selection = useComponentSelector(
        id,
        s => ({
          selectionStart: s?.[`${fieldName}.selectionStart`] ?? 0,
          selectionEnd: s?.[`${fieldName}.selectionEnd`] ?? 0
        }),
        shallowEqual
      );
  }

  const onChange = useCallback((event) => {
    const val = event.target.value;
    const selStart = event.target.selectionStart;
    const selEnd = event.target.selectionEnd;
    const payload: any = {
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
  normalizeOptions
};
