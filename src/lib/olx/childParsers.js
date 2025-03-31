import { XMLBuilder } from 'fast-xml-parser';

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  format: true,
  indentBy: '  ',
  suppressEmptyNode: false
});

export function xml({ rawParsed }) {
  return [{ type: 'xml', xml: builder.build(rawParsed) }];
}

export function xblocks({ rawParsed, parse }) {
  const sourceXBlocks = rawParsed.filter(child => {
    const tag = Object.keys(child).find(k => !['#text', '#comment', ':@'].includes(k));
    return !!tag;
  }); // Skip text tags, comments, and attributes.
  const parsedXBlockIDs = sourceXBlocks.map(child => ({ type: 'xblock', id: parse(child) }));
  return parsedXBlockIDs.filter(entry => entry.id); // Just in case we missed one. This should be a noop
}

export function ignore() {
  return null;
}

export function xmljson({ rawParsed }) {
  return [{ type: 'node', rawParsed }];
}

export function text({ rawParsed }) {
  if (
    Array.isArray(rawParsed) &&
    rawParsed.length === 1 &&
    rawParsed[0]['#text']
  ) {
    return [{ type: 'text', text: rawParsed[0]['#text'] }];
  }

  console.log("XML found in text field. This should raise an exception!");
  // If we ever get malformed input, fall back to xml
  return [{ type: 'xml', xml: builder.build(rawParsed) }];
}

export function cdata({ rawParsed }) {
  const node = Array.isArray(rawParsed) ? rawParsed[0] : rawParsed;
  const cdata = node['#cdata'];
  return cdata
    ? [{ type: 'cdata', value: cdata }]
    : [{ type: 'xml', xml: builder.build(rawParsed) }];
}
