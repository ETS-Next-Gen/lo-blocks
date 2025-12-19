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
              description: "The exact text to find and replace. Must be non-empty and must exist in the file."
            },
            newText: {
              type: "string",
              description: "The replacement text"
            },
            explanation: {
              type: "string",
              description: "Brief explanation of why this change is being made"
            }
          },
          required: ["oldText", "newText"]
        }
      },
      callback: async ({ oldText, newText, explanation }) => {
        // Validate oldText is not empty
        if (!oldText || oldText.trim() === '') {
          return 'Error: oldText cannot be empty. You must specify exact text to replace.';
        }

        const currentContent = getCurrentContent?.() || '';
        const fileType = getFileType?.() || 'olx';

        // Check if oldText exists in content
        if (!currentContent.includes(oldText)) {
          return `Error: Could not find the text to replace. Make sure oldText exactly matches text in the file.`;
        }

        // Apply the edit
        const newContent = currentContent.replace(oldText, newText);

        // Validate XML for OLX files
        if (fileType === 'olx' || fileType === 'xml') {
          const xmlError = validateXML(newContent);
          if (xmlError) {
            return `Error: The edit would create invalid XML. Line ${xmlError.line}, column ${xmlError.col}: ${xmlError.msg}. Please fix and try again.`;
          }
        }

        // All good - apply the edit
        if (onApplyEdit) {
          onApplyEdit({ oldText, newText, explanation });
        }
        return `Edit applied: ${explanation || 'change made'}`;
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
    }
  ];
}
