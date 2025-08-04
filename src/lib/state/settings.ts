// src/lib/state/settings.ts
//
// Application settings - system-level configuration state.
//
// Defines global settings fields that apply across the entire Learning Observer
// application, using system scope for shared access. Currently includes debug
// mode configuration, but can be extended for other system-wide preferences.
//
// We might move to PMSS in the future.
import { fields } from './fields';
import { scopes } from './scopes';

export const settingsFields = fields([
  { name: 'debug', event: 'SET_DEBUG', scope: scopes.system }
]);
