// src/components/blocks/LLMAction.js
import * as parsers from '@/lib/content/parsers';
import * as blocks from '@/lib/blocks';
import * as state from '@/lib/state';
import _Noop from './_Noop';

export const fields = state.fields(['loading']);

async function llmAction({ targetId, targetInstance, targetBlueprint, props }) {
  // Server-side imports
  const { updateReduxField } = await import('@/lib/state');

  try {
    // Set loading state using action's own fields
    //
    // TODO: Note that this is wrong and doesn't work. Ergo, the wrapper.
    // Probably, we're not adding fields to props properly in actions.js?
    if (props.fields?.loading) {
      updateReduxField(props, props.fields.loading, true);
    }

    // Extract prompt text directly from this action's content (kids)
    const promptText = await extractPromptText(props.nodeInfo.node, props);

    if (!promptText.trim()) {
      throw new Error('LLMAction: No prompt content found');
    }

    // Call LLM API through OpenAI proxy
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: promptText }
      ],
      max_tokens: 500
    };

    const response = await fetch('/api/openai/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ LLMAction: API error details:', errorText);
      throw new Error(`LLM API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No response';

    // Update target component's value - get target from action's attributes
    const targetElementId = targetInstance?.attributes?.target;
    if (targetElementId) {
      // Get target component's blueprint and fields
      const targetNode = props.idMap[targetElementId];

      const targetBlueprint = props.componentMap[targetNode.tag];

      if (targetBlueprint.blueprint.fields.fieldInfoByField?.value) {
        updateReduxField(
          { ...props, id: targetElementId },
          targetBlueprint.blueprint.fields.fieldInfoByField.value,
          content
        );
      } else {
        console.warn('⚠️ LLMAction: Target component does not have a value field');
        console.log('🔍 LLMAction: targetBlueprint.blueprint.fields:', targetBlueprint?.blueprint?.fields);
        console.log('🔍 LLMAction: Available fieldInfoByField keys:', Object.keys(targetBlueprint?.blueprint?.fields?.fieldInfoByField || {}));
      }
    } else {
      console.warn('⚠️ LLMAction: No target specified in action attributes');
    }
  } catch (error) {
    console.error('LLM generation failed:', error);

    // Update target with error message
    const targetElementId = targetInstance?.attributes?.target;
    if (targetElementId) {
      const targetNode = props.idMap[targetElementId];
      const targetBlueprint = props.componentMap[targetNode?.tag];
      if (targetBlueprint?.blueprint?.fields?.fieldInfoByField?.value) {
        updateReduxField(
          { ...props, id: targetElementId },
          targetBlueprint.blueprint.fields.fieldInfoByField.value,
          `Error: ${error.message}`
        );
      }
    }
  } finally {
    // Clear loading state
    if (props.fields?.loading) {
      updateReduxField(props, props.fields.loading, false);
    }
  }
}

// Helper function to extract prompt text directly from LLMAction content
async function extractPromptText(actionNode, props) {
  const { kids = [] } = actionNode;
  let promptText = '';

  for (const [index, kid] of kids.entries()) {
    // TODO: Are both 'string` and 'text' needed?
    if (typeof kid === 'string') {
      promptText += kid;
    } else if (kid.type === 'text') {
      promptText += kid.text;
    } else if (kid.type === 'block') {
      const blockNode = props.idMap[kid.id];
      const blockBlueprint = props.componentMap[blockNode?.tag];

      if (blockBlueprint?.getValue) {
        // Use the block's getValue method to get the actual value
        const reduxLogger = await import('lo_event/lo_event/reduxLogger.js');
        const state = reduxLogger.store.getState()?.application_state || {};

        const blockValue = blockBlueprint.getValue(
          state,
          kid.id,
          blockNode.attributes,
          props.idMap
        );
        promptText += blockValue;
      } else {
        console.warn(`⚠️ extractPromptText: Block ${blockNode?.tag} (${kid.id}) has no getValue method`);
        const fallback = `[BLOCK_${kid.id}]`;
        promptText += fallback;
      }
    } else {
      console.warn(`❓ extractPromptText: Unknown kid type:`, kid);
    }

  }

  return promptText.trim();
}

// Custom parser that handles mixed text and block content
const llmActionParser = async function({ id, rawParsed, tag, attributes, provenance, provider, parseNode, storeEntry }) {
  const kids = [];

  // Process each child node in the raw parsed XML
  const childNodes = Array.isArray(rawParsed[tag]) ? rawParsed[tag] : [];

  for (const child of childNodes) {
    if (child['#text']) {
      // Text content - add as string
      kids.push(child['#text']);
    } else {
      // Block content - parse as normal
      const childTag = Object.keys(child).find(k => !['#text', '#comment', ':@'].includes(k));
      if (childTag) {
        const parsedChild = await parseNode(child);
        if (parsedChild) {
          kids.push(parsedChild);
        }
      }
    }
  }

  storeEntry(id, {
    id,
    tag,
    attributes,
    kids,
    provenance,
    rawParsed: { [tag]: rawParsed[tag], ':@': rawParsed[':@'] }
  });
};

const LLMAction = blocks.test({
  parser: llmActionParser,
  staticKids: (entry) => {
    return (Array.isArray(entry.kids) ? entry.kids : [])
      .filter(k => k && typeof k === 'object' && k.id)
      .map(k => k.id);
  },
  ...blocks.action({
    action: llmAction,
  }),
  name: 'LLMAction',
  description: 'Executes LLM prompts with embedded Element references and updates target components',
  component: _Noop,
  fields,
});

export default LLMAction;
