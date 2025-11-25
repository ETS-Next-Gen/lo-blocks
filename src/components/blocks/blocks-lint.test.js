/**
 * Lint-style tests for block components.
 *
 * Rule 1: Use useReduxState instead of useState
 *
 * Block components should use useReduxState (or useReduxInput, useReduxCheckbox)
 * so that state is persisted and logged. React's useState creates ephemeral state
 * that's lost on re-render and isn't visible to analytics.
 *
 * If useState is genuinely needed for transient UI state (e.g., drag-and-drop),
 * add a comment on the line before:
 *
 *   // useState-ok: drag state doesn't need persistence
 *   const [dragging, setDragging] = useState(false);
 *
 * Rule 2: No JSX in blueprint files (.js)
 *
 * Blocks should be split into two files:
 *   - Name.js   - Blueprint file (block definition, no JSX, works server-side)
 *   - _Name.jsx - Component file (React component with JSX, client-side)
 *
 * This separation allows blueprints to be imported server-side without pulling
 * in React/JSX dependencies. If a .js file contains JSX, it will fail when
 * imported by server-side scripts like xml2json.
 */

import { readFileSync } from 'fs';
import { globSync } from 'glob';
import { relative } from 'path';
import { generateAllRegistryContents } from '@/scripts/generateRegistry.js';

const BLOCKS_DIR = __dirname;

function findComponentFiles() {
  return globSync('**/*.{jsx,tsx}', {
    cwd: BLOCKS_DIR,
    absolute: true,
    ignore: '**/*.test.*'
  });
}

function isExempted(lines, lineIndex) {
  const line = lines[lineIndex];

  // Check current line for inline exemption
  if (line.includes('useState-ok')) return true;

  // Check previous lines for exemption comment covering consecutive useState calls
  for (let i = lineIndex - 1; i >= 0; i--) {
    const prev = lines[i].trim();
    if (prev.includes('useState-ok')) return true;
    if (prev.includes('useState(')) continue;  // Keep looking past other useState lines
    if (prev && !prev.startsWith('//')) break; // Stop at non-comment code
  }

  return false;
}

function findUseStateViolations(filePath) {
  const lines = readFileSync(filePath, 'utf-8').split('\n');
  const violations = [];

  lines.forEach((line, index) => {
    if (line.trimStart().startsWith('import ')) return;
    if (!line.includes('useState(')) return;
    if (isExempted(lines, index)) return;

    violations.push({ line: index + 1, content: line.trim() });
  });

  return violations;
}

describe('Block components should use useReduxState instead of useState', () => {
  const files = findComponentFiles();

  it('finds component files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  files.forEach(filePath => {
    const name = relative(BLOCKS_DIR, filePath);

    it(name, () => {
      const violations = findUseStateViolations(filePath);
      if (violations.length === 0) return;

      const details = violations.map(v => `  Line ${v.line}: ${v.content}`).join('\n');
      expect.fail(
        `Found useState that should be useReduxState:\n${details}\n\n` +
        `To exempt, add a comment: // useState-ok: <reason>`
      );
    });
  });
});

function findJSXInFile(filePath) {
  const lines = readFileSync(filePath, 'utf-8').split('\n');
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track block comments
    if (trimmed.includes('/*')) inBlockComment = true;
    if (trimmed.includes('*/')) { inBlockComment = false; continue; }
    if (inBlockComment) continue;

    // Skip line comments
    if (trimmed.startsWith('//')) continue;

    // Look for JSX: < followed by uppercase (component) or lowercase (html tag)
    const jsxMatch = line.match(/<[A-Za-z]/);
    if (!jsxMatch) continue;

    // Make sure it's not inside a line comment
    const commentIndex = line.indexOf('//');
    if (commentIndex === -1 || jsxMatch.index < commentIndex) {
      return { line: i + 1, content: trimmed };
    }
  }

  return null;
}

describe('Blueprint files (.js) should not contain JSX', () => {
  // Get blueprint files from the registry generator's logic
  const { blocks } = generateAllRegistryContents();

  // Parse the generated content to extract file paths
  // Lines look like: export { default as Name } from './blocks/Name';
  const blueprintFiles = blocks.content
    .split('\n')
    .filter(line => line.startsWith('export'))
    .map(line => {
      const match = line.match(/from '(.+)'/);
      if (!match) return null;
      // Convert relative path to absolute, trying common extensions
      const relPath = match[1];
      for (const ext of ['.js', '.ts', '.jsx', '.tsx']) {
        const fullPath = relPath.replace('./blocks', BLOCKS_DIR) + ext;
        try {
          readFileSync(fullPath);
          return fullPath;
        } catch {}
      }
      return null;
    })
    .filter(Boolean);

  // Only check .js files (not .jsx/.tsx which are expected to have JSX)
  const jsFiles = blueprintFiles.filter(f => f.endsWith('.js'));

  it('finds blueprint .js files to check', () => {
    expect(jsFiles.length).toBeGreaterThan(0);
  });

  jsFiles.forEach(filePath => {
    const name = relative(BLOCKS_DIR, filePath);

    it(name, () => {
      const violation = findJSXInFile(filePath);
      if (!violation) return;

      expect.fail(
        `Blueprint contains JSX at line ${violation.line}:\n` +
        `  ${violation.content}\n\n` +
        `Move JSX to a _Component.jsx file and import it.`
      );
    });
  });
});
