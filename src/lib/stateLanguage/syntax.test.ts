// src/lib/stateLanguage/syntax.test.ts
//
// Doctest-style tests from syntax.md
// Parses >>> lines as expressions, compares to expected AST if provided.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse, parseResult } from './parser';
import { extractReferences } from './references';

interface DocTest {
  expression: string;
  expected: object | null;  // null = just verify it parses
  line: number;
}

/**
 * Parse syntax.md and extract doctest cases.
 * Format:
 *   >>> expression
 *   { "expected": "ast" }  // optional - if missing, just verify parse
 */
function extractDocTests(markdown: string): DocTest[] {
  const lines = markdown.split('\n');
  const tests: DocTest[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('>>> ')) {
      const expression = line.slice(4).trim();
      const lineNum = i + 1;

      // Look for expected AST on following lines
      let expectedJson = '';
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith('>>>') && lines[j].trim() !== '') {
        // Skip markdown prose (lines that don't look like JSON)
        const trimmed = lines[j].trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[') || expectedJson) {
          expectedJson += trimmed;
        } else if (trimmed.startsWith('#') || /^[A-Z]/.test(trimmed)) {
          // Markdown header or prose - stop looking
          break;
        }
        j++;
      }

      let expected: object | null = null;
      if (expectedJson) {
        try {
          expected = JSON.parse(expectedJson);
        } catch (e) {
          console.warn(`Line ${lineNum}: Invalid JSON for expected AST: ${expectedJson}`);
        }
      }

      tests.push({ expression, expected, line: lineNum });
      i = j;
    } else {
      i++;
    }
  }

  return tests;
}

// Load and parse syntax.md
const syntaxMd = readFileSync(join(__dirname, 'syntax.md'), 'utf-8');
const docTests = extractDocTests(syntaxMd);

describe('State Language (syntax.md doctests)', () => {
  it(`found ${docTests.length} test cases`, () => {
    expect(docTests.length).toBeGreaterThan(40);
  });

  for (const test of docTests) {
    const testName = test.expected
      ? `line ${test.line}: ${test.expression}`
      : `line ${test.line}: ${test.expression} (parse only)`;

    it(testName, () => {
      const result = parseResult(test.expression);

      if (!result.success) {
        throw new Error(`Parse error: ${result.error}`);
      }

      if (test.expected) {
        expect(result.ast).toEqual(test.expected);
      }
    });
  }
});

// Reference extraction tests (still useful to have explicit tests)
describe('extractReferences', () => {
  it('extracts @ reference', () => {
    expect(extractReferences('@essay')).toEqual([
      { sigil: '@', id: 'essay', fields: [] }
    ]);
  });

  it('extracts @ reference with fields', () => {
    expect(extractReferences('@essay.value')).toEqual([
      { sigil: '@', id: 'essay', fields: ['value'] }
    ]);
  });

  it('extracts mixed sigils', () => {
    const refs = extractReferences('@user + #greeting + $locale');
    expect(refs).toHaveLength(3);
    expect(refs).toContainEqual({ sigil: '@', id: 'user', fields: [] });
    expect(refs).toContainEqual({ sigil: '#', id: 'greeting', fields: [] });
    expect(refs).toContainEqual({ sigil: '$', id: 'locale', fields: [] });
  });

  it('deduplicates identical references', () => {
    expect(extractReferences('@x + @x')).toHaveLength(1);
  });

  it('extracts from nested expressions', () => {
    expect(extractReferences('children.every(c => c.id === @selected)')).toEqual([
      { sigil: '@', id: 'selected', fields: [] }
    ]);
  });
});
