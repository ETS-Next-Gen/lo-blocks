// src/lib/olx/parsers.js
import { XMLBuilder } from 'fast-xml-parser';

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  format: true,
  indentBy: '  ',
  suppressEmptyNode: false
});

// Simple decorator for common OLX-style nested XBlocks
export function childParser(fn, fn_name) {
  fn._isChildParser = true;

  const name = fn_name || fn.name || 'anonymous_child_parser';

  const wrapped = function wrappedParser(ctx) {
    const raw = ctx.rawParsed;
    const children = Array.isArray(raw) ? raw : [raw];
    return fn({ ...ctx, rawChildren: children });
  };

  Object.defineProperty(wrapped, 'name', { value: `childParser(${name})` });

  return wrapped;
}

export const xml = function xmlParser({ rawParsed }) { return [
  { type: 'xml', xml: builder.build(rawParsed) }
];};

export const xblocks = childParser(function xblocksParser({ rawChildren, parse }) {
  return rawChildren
    .filter(child => {
      const tag = Object.keys(child).find(k => !['#text', '#comment', ':@'].includes(k));
      return !!tag;
    })
    .map(child => ({ type: 'xblock', id: parse(child) }))
    .filter(entry => entry.id);
});

export const ignore = childParser(function ignoreParser() {
  return null;
});

export const xmljson = childParser(function xmljsonParser({ rawParsed }) {
  return [{ type: 'node', rawParsed }];
});

export const text = childParser(function textParser({ rawParsed }) {
  if (
    Array.isArray(rawParsed) &&
    rawParsed.length === 1 &&
    rawParsed[0]['#text']
  ) {
    return [{ type: 'text', text: rawParsed[0]['#text'] }];
  }

  console.warn("⚠️ XML found in text field — fallback to raw XML");
  return [{ type: 'xml', xml: builder.build(rawParsed) }];
});

export const cdata = childParser(function cdataParser({ rawParsed }) {
  const node = Array.isArray(rawParsed) ? rawParsed[0] : rawParsed;
  const cdata = node['#cdata'];
  return cdata
    ? [{ type: 'cdata', value: cdata }]
    : [{ type: 'xml', xml: builder.build(rawParsed) }];
});
