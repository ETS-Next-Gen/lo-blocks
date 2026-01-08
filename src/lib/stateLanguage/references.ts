// src/lib/stateLanguage/references.ts
//
// Extract references from AST by walking the tree.
// No regex - proper AST traversal.

import { parse, tryParse } from './parser';
import type { ASTNode, SigilRef } from './parser';

export interface Reference {
  sigil: '@' | '#' | '$';
  id: string;
  fields: string[];
}

/**
 * Walk an AST node and collect all SigilRef nodes.
 */
function collectSigilRefs(node: ASTNode, refs: SigilRef[]): void {
  if (!node || typeof node !== 'object') return;

  if (node.type === 'SigilRef') {
    refs.push(node);
    return;
  }

  // Recursively walk based on node type
  switch (node.type) {
    case 'BinaryOp':
      collectSigilRefs(node.left, refs);
      collectSigilRefs(node.right, refs);
      break;
    case 'UnaryOp':
      collectSigilRefs(node.argument, refs);
      break;
    case 'Ternary':
      collectSigilRefs(node.condition, refs);
      collectSigilRefs(node.then, refs);
      collectSigilRefs(node.else, refs);
      break;
    case 'Call':
      collectSigilRefs(node.callee, refs);
      for (const arg of node.arguments) {
        collectSigilRefs(arg, refs);
      }
      break;
    case 'MemberAccess':
      collectSigilRefs(node.object, refs);
      break;
    case 'ArrowFunction':
      collectSigilRefs(node.body, refs);
      break;
    case 'TemplateLiteral':
      for (const part of node.parts) {
        if (part.type === 'TemplateExpr') {
          collectSigilRefs(part.expression, refs);
        }
      }
      break;
    // Terminals - no children
    case 'Number':
    case 'String':
    case 'Identifier':
      break;
  }
}

/**
 * Extract all sigil references from an expression string.
 * Returns unique references (deduplicated by sigil+id+fields).
 *
 * @param expression - Expression string to parse
 * @returns Array of unique references
 */
export function extractReferences(expression: string): Reference[] {
  if (!expression || expression.trim() === '') {
    return [];
  }

  const ast = tryParse(expression);
  if (!ast) {
    return [];
  }

  const sigilRefs: SigilRef[] = [];
  collectSigilRefs(ast, sigilRefs);

  // Deduplicate by key
  const seen = new Set<string>();
  const unique: Reference[] = [];

  for (const ref of sigilRefs) {
    const key = `${ref.sigil}:${ref.id}:${ref.fields.join('.')}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push({
        sigil: ref.sigil,
        id: ref.id,
        fields: ref.fields,
      });
    }
  }

  return unique;
}

/**
 * Extract component IDs (@sigil) from an expression.
 */
export function extractComponentIds(expression: string): string[] {
  return extractReferences(expression)
    .filter(ref => ref.sigil === '@')
    .map(ref => ref.id);
}

/**
 * Extract content IDs (#sigil) from an expression.
 */
export function extractContentIds(expression: string): string[] {
  return extractReferences(expression)
    .filter(ref => ref.sigil === '#')
    .map(ref => ref.id);
}

/**
 * Extract global variable names ($sigil) from an expression.
 */
export function extractGlobalVars(expression: string): string[] {
  return extractReferences(expression)
    .filter(ref => ref.sigil === '$')
    .map(ref => ref.id);
}
