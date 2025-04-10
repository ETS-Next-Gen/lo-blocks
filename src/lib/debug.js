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

// 🔥 Safe, debuggable error wrapper
//
// We might want to expand this for more human-friendly debugging and specific contexts (e.g. BrokenBlock when developing blocks)
export function DisplayError({ name = 'Error', message, data, id = 'error' }) {
  // Log raw data for dev console inspection
  debugLog(`[${name}] ${message}`, data);

  // In dev/test, crash hard
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(`[${name}] ${message}`);
  }

  // Helper: stringify safely
  const safe = (value) => {
    if (typeof value === 'string' || typeof value === 'number') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return '[Unserializable]';
    }
  };

  return (
    <pre key={id} className="text-red-500 text-xs bg-red-50 p-2 rounded whitespace-pre-wrap overflow-auto">
      [{safe(name)}]: {safe(message)}
    </pre>
  );
}
