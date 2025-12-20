// src/lib/editor/tools.js
//
// Tools for the editor LLM assistant.
//

import { XMLValidator } from 'fast-xml-parser';

/**
 * Validate XML content and return errors if any.
 */
function validateXML(content) {
  const result = XMLValidator.validate(content, {
    allowBooleanAttributes: true,
  });
  if (result === true) {
    return null; // Valid
  }
  return result.err; // { code, msg, line, col }
}

/**
 * Create the tools array for useChat().
 *
 * @param {object} params
 * @param {function} params.onApplyEdit - Called when LLM applies an edit
 * @param {function} params.getCurrentContent - Returns current file content
 * @param {function} params.getFileType - Returns current file type
 */
export function createEditorTools({ onApplyEdit, getCurrentContent, getFileType }) {
  return [
    {
      type: "function",
      function: {
        name: "applyEdit",
        description: "Apply an edit to the current file. The edit is applied immediately. Only use this when the user explicitly asks you to modify, change, add, or fix something in the file. Do NOT use this for summarizing, explaining, or answering questions about the content.",
        parameters: {
          type: "object",
          properties: {
            oldText: {
              type: "string",
              description: "The exact text to find and replace. Must be non-empty and unique in the file (include surrounding context if needed)."
            },
            newText: {
              type: "string",
              description: "The replacement text"
            },
            replaceAll: {
              type: "boolean",
              description: "If true, replace ALL occurrences (use for global renames). Default: false (requires unique match)."
            },
            explanation: {
              type: "string",
              description: "Brief explanation of why this change is being made (like a commit message)"
            }
          },
          required: ["oldText", "newText"]
        }
      },
      callback: async ({ oldText, newText, replaceAll = false, explanation }) => {
        // Validate oldText is not empty
        if (!oldText || oldText.trim() === '') {
          return 'Error: oldText cannot be empty. You must specify exact text to replace.';
        }

        const currentContent = getCurrentContent?.() || '';
        const fileType = getFileType?.() || 'olx';

        // Count occurrences
        const occurrences = currentContent.split(oldText).length - 1;

        if (occurrences === 0) {
          return `Error: Could not find the text to replace. Make sure oldText exactly matches text in the file.`;
        }

        if (occurrences > 1 && !replaceAll) {
          return `Error: Found ${occurrences} occurrences of that text. Either include more surrounding context to make it unique, or set replaceAll: true for a global rename.`;
        }

        // Apply the edit
        const newContent = replaceAll
          ? currentContent.replaceAll(oldText, newText)
          : currentContent.replace(oldText, newText);

        // Validate XML for OLX files
        if (fileType === 'olx' || fileType === 'xml') {
          const xmlError = validateXML(newContent);
          if (xmlError) {
            return `Error: The edit would create invalid XML. Line ${xmlError.line}, column ${xmlError.col}: ${xmlError.msg}. Please fix and try again.`;
          }
        }

        // All good - apply the edit
        if (onApplyEdit) {
          onApplyEdit({ oldText, newText, replaceAll });
        }
        const msg = replaceAll
          ? `Replaced ${occurrences} occurrences`
          : `Edit applied`;
        return explanation ? `${msg}: ${explanation}` : msg;
      }
    },
    {
      type: "function",
      function: {
        name: "getBlockInfo",
        description: "Get detailed documentation for a specific OLX block, including examples.",
        parameters: {
          type: "object",
          properties: {
            blockName: {
              type: "string",
              description: "The block name, e.g. 'Markdown', 'ChoiceInput', 'MasteryBank'"
            }
          },
          required: ["blockName"]
        }
      },
      callback: async ({ blockName }) => {
        try {
          const res = await fetch(`/api/docs/${blockName}`);
          if (!res.ok) {
            return `Block '${blockName}' not found.`;
          }
          const data = await res.json();
          if (!data.ok) {
            return `Block '${blockName}' not found.`;
          }

          const block = data.block;
          let result = `# ${block.name}\n\n`;

          if (block.description) {
            result += `${block.description}\n\n`;
          }

          if (block.readme?.content) {
            result += `## Documentation\n${block.readme.content}\n\n`;
          }

          if (block.examples?.length > 0) {
            result += `## Examples\n`;
            for (const ex of block.examples) {
              result += `### ${ex.filename}\n\`\`\`xml\n${ex.content}\n\`\`\`\n\n`;
            }
          }

          return result;
        } catch (err) {
          return `Error fetching block info: ${err.message}`;
        }
      }
    },
    {
      type: "function",
      function: {
        name: "readFile",
        description: "Read another file from the content library. Use this to see how other files are structured or to reference their content.",
        parameters: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the file, e.g. 'sba/psychology/operant-mastery.olx' or 'demos/text-changer-demo.olx'"
            }
          },
          required: ["path"]
        }
      },
      callback: async ({ path }) => {
        try {
          const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
          if (!res.ok) {
            const err = await res.json();
            return `Error reading file: ${err.error || res.statusText}`;
          }
          const content = await res.text();
          return `# ${path}\n\n\`\`\`\n${content}\n\`\`\``;
        } catch (err) {
          return `Error reading file: ${err.message}`;
        }
      }
    },
  ];
}
