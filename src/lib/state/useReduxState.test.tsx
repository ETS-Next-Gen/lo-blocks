import React from 'react';
import { Provider } from 'react-redux';
import { renderHook, act } from '@testing-library/react';

import * as reduxLogger from 'lo_event/lo_event/reduxLogger.js';
import { fields, useReduxState } from './redux';
import { updateResponseReducer, store as storeFactory } from './store';

const testFields = fields(['foo']);

function makeStore() {
  const store = storeFactory.init();
  reduxLogger.registerReducer('UPDATE_FOO', updateResponseReducer);
  return store;
}

describe('useReduxState integration', () => {
  it('reads, writes, and re-reads the same Redux slice', async () => {
    const store = makeStore();
    const wrapper = ({ children }: any) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(
      () => useReduxState({ id: 'test' }, testFields.fieldInfoByField.foo, 'bob'),
      { wrapper }
    );

    expect(result.current[0]).toBe('bob');

    act(() => {
      result.current[1]('bar');
    });

    await new Promise(r => setTimeout(r, 0));

    expect(result.current[0]).toBe('bar');
    const state = store.getState();
    expect(state.application_state.component_state['test'].foo).toBe('bar');
  });
});
