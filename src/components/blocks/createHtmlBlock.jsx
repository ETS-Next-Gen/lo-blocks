// src/components/blocks/createHtmlBlock.jsx
import React from 'react';

import * as parsers from '@/lib/content/parsers';
import { core } from '@/lib/blocks';
import { renderCompiledKids } from '@/lib/render';

// Common HTML elements with their typical attributes
const HTML_ELEMENT_CONFIGS = {
  // Text formatting
  B: { tag: 'b', attributes: [] },
  I: { tag: 'i', attributes: [] },
  U: { tag: 'u', attributes: [] },
  Strong: { tag: 'strong', attributes: [] },
  Em: { tag: 'em', attributes: [] },
  Small: { tag: 'small', attributes: [] },
  Mark: { tag: 'mark', attributes: [] },
  Code: { tag: 'code', attributes: [] },
  Pre: { tag: 'pre', attributes: [] },

  // Headings
  H1: { tag: 'h1', attributes: [] },
  H2: { tag: 'h2', attributes: [] },
  H3: { tag: 'h3', attributes: [] },
  H4: { tag: 'h4', attributes: [] },
  H5: { tag: 'h5', attributes: [] },
  H6: { tag: 'h6', attributes: [] },

  // Block elements
  P: { tag: 'p', attributes: [] },
  Div: { tag: 'div', attributes: [] },
  Span: { tag: 'span', attributes: [] },
  Section: { tag: 'section', attributes: [] },
  Article: { tag: 'article', attributes: [] },
  Header: { tag: 'header', attributes: [] },
  Footer: { tag: 'footer', attributes: [] },
  Main: { tag: 'main', attributes: [] },
  Nav: { tag: 'nav', attributes: [] },
  Aside: { tag: 'aside', attributes: [] },

  // Lists
  Ul: { tag: 'ul', attributes: ['type'] },
  Ol: { tag: 'ol', attributes: ['type', 'start', 'reversed'] },
  Li: { tag: 'li', attributes: ['value'] },
  Dl: { tag: 'dl', attributes: [] },
  Dt: { tag: 'dt', attributes: [] },
  Dd: { tag: 'dd', attributes: [] },

  // Table elements
  Table: { tag: 'table', attributes: ['border', 'cellpadding', 'cellspacing', 'width'] },
  Thead: { tag: 'thead', attributes: [] },
  Tbody: { tag: 'tbody', attributes: [] },
  Tfoot: { tag: 'tfoot', attributes: [] },
  Tr: { tag: 'tr', attributes: [] },
  Th: { tag: 'th', attributes: ['colspan', 'rowspan', 'scope'] },
  Td: { tag: 'td', attributes: ['colspan', 'rowspan'] },
  Caption: { tag: 'caption', attributes: [] },

  // Links and media
  A: { tag: 'a', attributes: ['href', 'target', 'rel', 'download'] },
  Img: { tag: 'img', attributes: ['src', 'alt', 'width', 'height', 'loading'] },


  // Quote and citation
  Blockquote: { tag: 'blockquote', attributes: ['cite'] },
  Q: { tag: 'q', attributes: ['cite'] },
  Cite: { tag: 'cite', attributes: [] },

  // Other common elements
  Hr: { tag: 'hr', attributes: [] },
  Br: { tag: 'br', attributes: [] },
  Sub: { tag: 'sub', attributes: [] },
  Sup: { tag: 'sup', attributes: [] }
};

/**
 * Creates an HTML block component that renders a specific HTML element
 * with support for common attributes and children.
 *
 * @param {string} elementName - The name of the element (e.g., 'B', 'Div', 'Table')
 * @param {Object} config - Configuration object with tag and attributes
 * @returns {Object} Block component ready for registration
 */
function createHtmlBlock(elementName, config = null) {
  const elementConfig = config || HTML_ELEMENT_CONFIGS[elementName];

  if (!elementConfig) {
    throw new Error(`HTML element "${elementName}" is not configured. Add it to HTML_ELEMENT_CONFIGS or provide a config object.`);
  }

  const { tag, attributes = [] } = elementConfig;

  function HtmlComponent(props) {
    const { kids = [], ...restProps } = props;

    // Filter props to only include configured attributes and standard HTML attributes
    const allowedAttributes = new Set([
      ...attributes,
      'className', 'id', 'style', // Always allow these common attributes
      'onClick', 'onMouseOver', 'onMouseOut', // Common event handlers
      'title', 'role', 'aria-label', 'aria-describedby' // Accessibility
    ]);

    const htmlProps = {};
    Object.keys(restProps).forEach(key => {
      if (allowedAttributes.has(key)) {
        htmlProps[key] = restProps[key];
      }
    });

    // Handle self-closing tags
    const isSelfClosing = ['br', 'hr', 'img', 'input'].includes(tag);

    if (isSelfClosing) {
      return React.createElement(tag, htmlProps);
    }

    // Use renderCompiledKids to convert OLX kids to React children
    const children = renderCompiledKids(props);
    return React.createElement(tag, htmlProps, children);
  }

  // Set component display name for debugging
  HtmlComponent.displayName = `Html${elementName}`;

  return core({
    name: elementName,
    component: HtmlComponent,
    description: `HTML ${tag} element with support for ${attributes.length > 0 ? attributes.join(', ') : 'standard'} attributes`,
    ...parsers.blocks(),
    requiresUniqueId: false
  });
}

/**
 * Creates multiple HTML blocks from the configured elements
 * @returns {Object} Object with all HTML blocks ready for export
 */
function createAllHtmlBlocks() {
  const blocks = {};

  Object.keys(HTML_ELEMENT_CONFIGS).forEach(elementName => {
    blocks[elementName] = createHtmlBlock(elementName);
  });

  return blocks;
}

export default createHtmlBlock;
export { createAllHtmlBlocks, HTML_ELEMENT_CONFIGS };