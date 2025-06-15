// src/lib/blocks/actionsBase.jsx
// Basic action/input mixins without heavy dependencies

export function action({ action }) {
  return { action };
}

export function isAction(blueprint) {
  return typeof blueprint?.action === 'function';
}

export function input({ getValue }) {
  return { getValue };
}

export function isInput(blueprint) {
  return typeof blueprint?.getValue === 'function';
}
