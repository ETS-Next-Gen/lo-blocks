'use client';
import React from 'react';

import { Provider } from 'react-redux';

import * as reduxLogger from 'lo_event/lo_event/reduxLogger.js';
import * as lo_event from 'lo_event';
import * as debug from 'lo_event/lo_event/debugLog.js';
import { consoleLogger } from 'lo_event/lo_event/consoleLogger.js';

lo_event.init(
  "org.ets.sba",
  "0.0.1",
  [consoleLogger(), reduxLogger.reduxLogger([], {})],
  {
    debugLevel: debug.LEVEL.EXTENDED,
    debugDest: [debug.LOG_OUTPUT.CONSOLE],
    useDisabler: false,
    queueType: lo_event.QueueType.IN_MEMORY
  }
);
lo_event.go();

const StoreWrapper = ({ children }) => (
  <Provider store={reduxLogger.store}>
    {children}
  </Provider>
);

export default StoreWrapper;
