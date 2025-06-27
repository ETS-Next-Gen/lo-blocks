// src/lib/state/redux.ts
import * as lo_event from 'lo_event';
import * as idResolver from '../blocks/idResolver';

import { useFieldSelector } from './selectors.ts';
import { useCallback } from 'react';
import { Scope, scopes } from '../state/scopes';
import { FieldInfo, FieldInfoByEvent, FieldInfoByField } from '../types';
import { assertValidField } from './fields';


export function updateReduxField(
  props,
  field: FieldInfo,
  newValue,
  { id, tag }: { id?: string; tag?: string } = {}
) {
  assertValidField(field);
  const scope = field.scope ?? scopes.component;
  const fieldName = field.name;
  const resolvedId = id ?? (scope === scopes.component ? idResolver.reduxId(props) : undefined);
  const resolvedTag = tag ?? props?.blueprint?.OLXName;

  lo_event.logEvent(field.event, {
    scope,
    [fieldName]: newValue,
    ...(scope === scopes.component || scope === scopes.storage ? { id: resolvedId } : {}),
    ...(scope === scopes.componentSetting ? { tag: resolvedTag } : {})
  });
}

export function useReduxState(
  props,
  field: FieldInfo,
  fallback,
  { id, tag }: { id?: string; tag?: string } = {}
) {
  assertValidField(field);

  const value = useFieldSelector(props, field, { fallback, id, tag });

  const setValue = (newValue) => updateReduxField(props, field, newValue, { id, tag });

  return [value, setValue];
}

export function useReduxCheckbox(
  props,
  field: FieldInfo,
  fallback = false,
  opts: { id?: string; tag?: string } = {}
) {
  assertValidField(field);
  const [checked, setChecked] = useReduxState(props, field, fallback, opts);
  const onChange = useCallback((event) => setChecked(event.target.checked), [setChecked]);
  return [checked, { name: field.name, checked, onChange }];
}
