// src/components/blocks/CapaProblem/CapaProblemNew.js
//
// New CapaProblem implementation using clean architecture:
// - parsers.blocksWithHtml() for clean parsing
// - Chrome components for input decorations
// - Locals for educational logic separation

import { COMPONENT_MAP } from '@/components/componentMap.js';
import * as parsers from '@/lib/content/parsers';
import { core } from '@/lib/blocks';
import { createChromeComponent } from '@/lib/chromeComponents';
import { inferRelatedNodes } from '@/lib/blocks/olxdom';
import _CapaProblemNew from './_CapaProblemNew';

// Enhanced blocksWithHtml parser that creates chrome components
function createCapaParser() {
  return {
    parser: async function capaParser(ctx) {
      const { id, rawParsed, storeEntry } = ctx;
      
      // First, use the standard blocksWithHtml parser
      const standardResult = await parsers.blocksWithHtml().parser(ctx);
      
      // Then, discover inputs and create chrome components for them
      const inputs = await discoverInputs(ctx);
      
      inputs.forEach(inputId => {
        const chromeId = `${inputId}_chrome`;
        createChromeComponent(chromeId, inputId, {
          type: 'indicator'
        }, storeEntry);
      });
      
      return standardResult;
    },
    staticKids: parsers.blocksWithHtml.staticKids
  };
}

// Helper to discover input components during parsing
async function discoverInputs(ctx) {
  const { rawParsed, componentMap = COMPONENT_MAP } = ctx;
  const inputs = [];
  
  // Recursively find all Learning Observer blocks that are inputs
  function findInputs(nodes) {
    if (!Array.isArray(nodes)) nodes = [nodes];
    
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue;
      
      const tag = Object.keys(node).find(k => !['#text', '#comment', ':@'].includes(k));
      if (!tag) continue;
      
      const component = componentMap[tag];
      if (component?.blueprint?.getValue) {
        const attributes = node[':@'] || {};
        const nodeId = attributes.id || `input_${inputs.length}`;
        inputs.push(nodeId);
      }
      
      // Recursively search children
      const kids = node[tag];
      if (kids) {
        findInputs(Array.isArray(kids) ? kids : [kids]);
      }
    }
  }
  
  findInputs(rawParsed);
  return inputs;
}

const CapaProblem = core({
  name: 'CapaProblemNew',
  component: _CapaProblemNew,
  ...createCapaParser(),
  description: 'Educational problem with grading and input chrome'
}, {
  // Educational logic moved to locals
  graders: (props) => {
    const graderIds = inferRelatedNodes(props, {
      selector: n => n.blueprint?.isGrader,
      infer: props.infer,
      targets: props.targets
    });
    console.log('CapaProblemNew: Found graders:', graderIds);
    return graderIds;
  },
  
  inputs: (props) => inferRelatedNodes(props, {
    selector: n => n.blueprint?.getValue,
    infer: props.infer
  })
});

export default CapaProblem;