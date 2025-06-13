# Issues Log

- Added header comments to all source files. JSON files were skipped because adding comments would break their syntax (e.g., `package.json`, `tsconfig.json`).
- Updated incorrect path comments in `src/lib/llm/azureInterface.js`, `src/lib/llm/client.jsx`, and `src/lib/blocks/factory.tsx`.
- Other files may still include existing comments below the new header lines; they were left in place as they may contain useful context.
- Removed header comments from non-code files like markdown and LICENSE.
