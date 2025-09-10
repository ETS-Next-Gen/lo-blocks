// src/scripts/code-quality.test.js
import { test, expect } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Test to check for trailing whitespace in source and content files
 * This helps maintain clean code standards and prevent git diff noise
 */
test('no trailing whitespace in src/ and content/ directories', async () => {
  // Define file patterns to check for trailing whitespace
  const patterns = [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.json',
    'src/**/*.md',
    'content/**/*.xml',
    'content/**/*.md',
    'content/**/*.txt',
    'content/**/*.json',
    'content/**/*.chatpeg',
    'content/**/*.textHighlight',
    'content/**/*.sortpeg'
  ];

  const violations = [];

  for (const pattern of patterns) {
    const files = await glob(pattern, {
      ignore: ['**/node_modules/**', '**/.next/**', '**/out/**', '**/public/**']
    });

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const lines = content.split('\n');

        // Check each line for trailing whitespace
        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
          const line = lines[lineNum];

          // Check if line ends with whitespace (but not if it's the final line and just a newline)
          if (line.match(/\s+$/)) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: lineNum + 1, // Human readable line numbers start at 1
              content: line,
              trailingChars: line.match(/\s+$/)[0]
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read (e.g., binary files, permission issues)
        if (error.code !== 'EISDIR') {
          console.warn(`Warning: Could not read ${file}: ${error.message}`);
        }
      }
    }
  }

  // Create detailed error message if violations found
  if (violations.length > 0) {
    const errorMessage = `Found ${violations.length} line(s) with trailing whitespace:\n\n` +
      violations.slice(0, 10).map(v => {
        const whitespaceDesc = v.trailingChars
          .replace(/ /g, '·')  // Show spaces as middle dots
          .replace(/\t/g, '→'); // Show tabs as arrows

        return `  📁 ${v.file}:${v.line}\n` +
               `     Line: "${v.content}"\n` +
               `     Trailing: "${whitespaceDesc}"\n`;
      }).join('\n') +
      (violations.length > 10 ? `\n... and ${violations.length - 10} more violations.\n` : '') +
      `\n💡 TIP: Remove trailing whitespace with your editor or run:\n` +
      `   find src content -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.xml" -o -name "*.md" \\) -exec sed -i 's/[[:space:]]*$//' {} \\;\n`;

    // Log violations for debugging but don't fail the test in CI environments
    console.error(errorMessage);

    // Fail the test - this encourages clean code practices
    expect(violations).toHaveLength(0);
  }
}, 30000); // 30 second timeout for large codebases

/**
 * Additional test for specific whitespace patterns that commonly cause issues
 */
test('no mixed tabs and spaces for indentation', async () => {
  const patterns = [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx'
  ];

  const violations = [];

  for (const pattern of patterns) {
    const files = await glob(pattern, {
      ignore: ['**/node_modules/**', '**/.next/**', '**/out/**', '**/public/**']
    });

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const lines = content.split('\n');

        // Check for lines that start with both tabs and spaces (mixed indentation)
        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
          const line = lines[lineNum];

          // Look for lines that start with spaces followed by tabs, or tabs followed by spaces
          if (line.match(/^( +\t|\t+ )/)) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: lineNum + 1,
              content: line
            });
          }
        }
      } catch (error) {
        if (error.code !== 'EISDIR') {
          console.warn(`Warning: Could not read ${file}: ${error.message}`);
        }
      }
    }
  }

  if (violations.length > 0) {
    const errorMessage = `Found ${violations.length} line(s) with mixed tabs and spaces:\n\n` +
      violations.slice(0, 5).map(v => {
        const indentation = v.content.match(/^[\s]*/)[0]
          .replace(/ /g, '·')  // Show spaces as middle dots
          .replace(/\t/g, '→'); // Show tabs as arrows

        return `  📁 ${v.file}:${v.line}\n` +
               `     Indentation: "${indentation}"\n`;
      }).join('\n') +
      (violations.length > 5 ? `\n... and ${violations.length - 5} more violations.\n` : '') +
      `\n💡 TIP: Configure your editor to use consistent indentation (either tabs or spaces, not both).\n`;

    console.error(errorMessage);
    expect(violations).toHaveLength(0);
  }
}, 30000);