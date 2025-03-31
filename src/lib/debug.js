import React from 'react';

export const debug = ()=> true;

export const Trace = ({ children, override = debug() }) => {
  if (override) {
    return <pre>{children}</pre>;
  }
  return null;
};

export const debugLog = (...args) => {
  if (debug()) {
    console.log(...args);
  }
};
