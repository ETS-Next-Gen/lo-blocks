// src/components/blocks/Image/Image.js
import { z } from 'zod';
import { core } from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import { baseAttributes } from '@/lib/blocks/attributeSchemas';
import _Image from './_Image';

// Custom parser to resolve relative image paths during content loading
//
// This could move to render time, but we'd eventually like more
// checks during loading (e.g. does image exist) for better error
// handling earlier in the process.
function imageParser({ id, tag, attributes, provenance, rawParsed, storeEntry, provider }) {
  const { src, ...otherAttributes } = attributes;

  let resolvedSrc = src;

  // Resolve relative paths using storage provider during parsing
  if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//') && !src.startsWith('/')) {
    // This is a relative path - resolve it using storage provider
    if (provenance && provenance.length > 0 && provider?.resolveRelativePath) {
      const currentProvenance = provenance[provenance.length - 1];
      resolvedSrc = provider.resolveRelativePath(currentProvenance, src);
    }
  }

  const entry = {
    id,
    tag,
    attributes: { ...otherAttributes, src: resolvedSrc },
    provenance,
    rawParsed,
    kids: []
  };

  storeEntry(id, entry);
  return id;
}

const Image = core({
  parser: imageParser,
  staticKids: () => [],
  name: 'Image',
  description: 'Displays images from content directory or external URLs',
  component: _Image,
  attributes: baseAttributes.extend({
    src: z.string({ required_error: 'src is required' }).describe('Image source path (relative, content-absolute, platform //, or external URL)'),
    alt: z.string().optional().describe('Alternative text for accessibility'),
    width: z.string().optional().describe('Image width in pixels (not available in some contexts)'), // TODO: Figure out why this didn't work...
    height: z.string().optional().describe('Image height in pixels (not available in some contexts)'),
  }),
});

export default Image;
