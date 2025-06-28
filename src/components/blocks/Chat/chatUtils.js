// chatUtils.js

import { parse } from './_clipParser.js';

/*
 * Utiility functions to help manage chat transcripts, e.g. find by ID, cut out sections, etc.
 */

export function byId(conversation, id) {
  const { body } = conversation;
  const idx = body.findIndex(line => line?.metadata?.id === id);
  return idx !== -1 ? idx : false;
}

export function listSections(conversation) {
  return conversation.body.filter(line => line.type === "SectionHeader");
}

export function listIds(conversation) {
  return conversation.body
    .map(line => line?.metadata?.id)
    .filter(Boolean);
}

export function section(conversation, title) {
  const { body } = conversation;
  const start = body.findIndex(line => line.type === "SectionHeader" && line.title.trim() === title.trim());
  if (start === -1) return null;
  const next = body.slice(start + 1).findIndex(line => line.type === "SectionHeader");
  const end = next === -1 ? body.length - 1 : start + next;
  return { start, end };
}

function process(conversation, ast) {
  let idx, sectionRange;
  if(ast === null) {
    return {start: NaN, end: NaN};
  }
  switch(ast.type) {
  case 'number':
    return {start: ast.value, end: ast.value};
  case 'identifier':
    idx = byId(conversation, ast.value);
    if(idx !== false) return {start: idx, end: idx};
    sectionRange = section(conversation, ast.value);
    if(sectionRange) return sectionRange;
    throw Error(`Unidentified range location: ${ast.value}`);
  case 'quoted':
    sectionRange = section(conversation, ast.value);
    if(sectionRange) return sectionRange;
    idx = byId(conversation, ast.value);
    if(idx !== false) return {start: idx, end: idx};
    throw Error(`Unidentified range location: ${ast.value}`);
  case 'range':
    ast.start = process(conversation, ast.start);
    ast.end = process(conversation, ast.end);
    return {
      start: ast.open === '(' ? ast.start.end + 1 : ast.start.start,
      end: ast.close === ')' ? ast.end.start - 1 : ast.end.end
    };
  default:
    console.log(ast);
    throw Error(`Unidentified type: ${ast.type}`);
  }
}

export function clip(conversation, input) {
  const body = conversation.body;
  const len = body.length;

  const parsed = parse(input);
  try {
    const processed = process(conversation, parsed);
    if (isNaN(processed.start)) processed.start = 0;
    if (isNaN(processed.end)) processed.end = body.length - 1;

    const valid = processed.start <= processed.end;

    return {
      start: Math.max(processed.start, 0),
      end: Math.min(processed.end, body.length - 1),
      valid,
      message: valid ? null : "Invalid clip (start > end)"
    };
  } catch {
    return false;
  }
}
