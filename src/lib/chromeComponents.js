// src/lib/chromeComponents.js
//
// Chrome component system for educational blocks like CapaProblem.
// 
// Allows parent components to create "chrome" components (checkboxes, validation indicators, etc.)
// that child components can optionally render alongside themselves.

import React from 'react';
import { core } from '@/lib/blocks';
import * as state from '@/lib/state';

// Registry for chrome components
const chromeRegistry = new Map();

/**
 * Creates a chrome component and registers it for later use
 * @param {string} chromeId - Unique ID for this chrome component
 * @param {string} targetId - ID of the component this chrome is for
 * @param {Object} chromeConfig - Configuration for the chrome component
 * @returns {string} - The chrome component ID
 */
export function createChromeComponent(chromeId, targetId, chromeConfig, storeEntry) {
  const { type = 'indicator', initialState = {} } = chromeConfig;
  
  // Create appropriate chrome component based on type
  let ChromeComponent;
  
  switch (type) {
    case 'indicator':
      ChromeComponent = createIndicatorChrome(targetId);
      break;
    case 'checkbox':
      ChromeComponent = createCheckboxChrome(targetId);
      break;
    default:
      throw new Error(`Unknown chrome type: ${type}`);
  }
  
  // Create the chrome block entry
  const chromeBlock = core({
    name: `${type}Chrome`,
    component: ChromeComponent,
    requiresUniqueId: false
  });
  
  // Store the chrome component in the idMap like a normal block
  const chromeEntry = {
    id: chromeId,
    tag: `${type}Chrome`,
    attributes: { id: chromeId, targetId },
    kids: [],
    chromeTarget: targetId,
    chromeType: type
  };
  
  if (storeEntry) {
    storeEntry(chromeId, chromeEntry);
  }
  
  // Register for lookup by useChrome
  chromeRegistry.set(targetId, chromeId);
  
  return chromeId;
}

/**
 * Hook to get the chrome component ID for a given target component
 * @param {string} targetId - ID of the component to get chrome for
 * @returns {string|null} - Chrome component ID or null if no chrome exists
 */
export function useChrome(targetId) {
  return chromeRegistry.get(targetId) || null;
}

/**
 * Component to render a chrome component by ID
 * @param {string} chromeId - ID of the chrome component to render
 * @param {Object} props - Additional props to pass to the chrome component
 */
export function ChromeRenderer({ chromeId, ...props }) {
  if (!chromeId) return null;
  
  // This would ideally use renderComponentById, but for now we'll implement inline
  // TODO: Integrate with the main rendering system
  return <div data-chrome-id={chromeId}>Chrome: {chromeId}</div>;
}

// Chrome component factories

function createIndicatorChrome(targetId) {
  return function IndicatorChrome(props) {
    const { id } = props;
    
    // Use state to track correctness of the target
    const correctnessField = state.componentFieldByName(props, targetId, 'correct');
    const correctness = state.useFieldSelector(
      props,
      correctnessField,
      { id: targetId, fallback: null, selector: s => s?.correct }
    );
    
    const getIndicatorClass = () => {
      if (!correctness) return 'chrome-indicator chrome-indicator--neutral';
      if (correctness === 'correct') return 'chrome-indicator chrome-indicator--correct';
      if (correctness === 'incorrect') return 'chrome-indicator chrome-indicator--incorrect';
      if (correctness === 'invalid') return 'chrome-indicator chrome-indicator--invalid';
      return 'chrome-indicator chrome-indicator--neutral';
    };
    
    const getIndicatorSymbol = () => {
      if (!correctness) return '○';
      if (correctness === 'correct') return '✓';
      if (correctness === 'incorrect') return '✗';
      if (correctness === 'invalid') return '!';
      return '○';
    };
    
    return (
      <span className={getIndicatorClass()} data-target={targetId}>
        {getIndicatorSymbol()}
      </span>
    );
  };
}

function createCheckboxChrome(targetId) {
  return function CheckboxChrome(props) {
    const { id } = props;
    
    // Use state to track correctness of the target
    const correctnessField = state.componentFieldByName(props, targetId, 'correct');
    const correctness = state.useFieldSelector(
      props,
      correctnessField,
      { id: targetId, fallback: null, selector: s => s?.correct }
    );
    
    const isChecked = correctness === 'correct';
    const isIndeterminate = correctness === 'invalid';
    
    return (
      <input
        type="checkbox"
        checked={isChecked}
        ref={input => {
          if (input) input.indeterminate = isIndeterminate;
        }}
        disabled
        className="chrome-checkbox"
        data-target={targetId}
      />
    );
  };
}

/**
 * Clear the chrome registry (useful for testing)
 */
export function clearChromeRegistry() {
  chromeRegistry.clear();
}