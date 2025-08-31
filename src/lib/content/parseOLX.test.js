// src/lib/content/parseOLX.test.js
import { parseOLX } from './parseOLX';

const PROV = ['file://test.xml'];

test('returns root id of single element', async () => {
  const xml = '<Vertical id="root"><TextBlock id="child"/></Vertical>';
  const { root, idMap } = await parseOLX(xml, PROV);
  expect(root).toBe('root');
  expect(idMap[root]).toBeDefined();
});

test('returns first element id when multiple roots', async () => {
  const xml = '<Vertical id="one"/><Vertical id="two"/>';
  const { root } = await parseOLX(xml, PROV);
  expect(root).toBe('one');
});

test('parses <Use> with attribute overrides', async () => {
  const xml = '<Vertical id="L"><Chat id="C" clip="[1,2]"/><Use ref="C" clip="[3,4]"/></Vertical>';
  const { idMap, root } = await parseOLX(xml, PROV);
  const lesson = idMap[root];
  const useKid = lesson.kids[1];
  expect(useKid).toEqual({ type: 'block', id: 'C', overrides: { clip: '[3,4]' } });
});

test('CRITICAL: Parser must preserve numeric text as strings (prevents "text.trim is not a function" errors)', async () => {
  // This test ensures fast-xml-parser doesn't convert numeric text to JavaScript numbers
  // If this test fails after upgrading fast-xml-parser, you need to update the parser configuration
  // in parseOLX.ts to prevent automatic type conversion.
  //
  // Current v5 config: parseTagValue: false, parseAttributeValue: false
  // v6 equivalent: tags: { valueParsers: [] }, attributes: { valueParsers: [] }

  const xml = `
    <CapaProblem id="test">
      <TextBlock>42</TextBlock>
      <TextBlock>-5</TextBlock>
      <TextBlock>0</TextBlock>
      <TextBlock>true</TextBlock>
      <TextBlock index="1">123</TextBlock>
    </CapaProblem>
  `;

  const result = await parseOLX(xml, PROV);

  // Find TextBlock nodes in the parsed result
  const textBlocks = Object.values(result.idMap).filter(node => node.tag === 'TextBlock');

  expect(textBlocks.length).toBeGreaterThan(0);

  // Every TextBlock should have text content that remains as strings, never converted to numbers/booleans
  textBlocks.forEach((block, index) => {
    const kids = block.kids;

    // Kids should be an array of {type: 'text', text: string} objects
    expect(Array.isArray(kids)).toBe(true);

    kids.forEach((kid, kidIndex) => {
      if (kid.type === 'text') {
        // This is the critical test - text content should be string, not number
        expect(typeof kid.text).toBe('string',
          `TextBlock ${index}, kid ${kidIndex}: text should be string but got ${typeof kid.text} (value: ${kid.text}). ` +
          `This usually means fast-xml-parser is auto-converting numbers/booleans. ` +
          `Check parseTagValue/parseAttributeValue settings in parseOLX.ts. ` +
          `For v6 upgrade, use: tags: { valueParsers: [] }, attributes: { valueParsers: [] }`
        );

        // Verify we can call string methods (this would throw if kid.text was a number)
        expect(() => kid.text.trim()).not.toThrow();

        // Test specific cases that commonly get auto-converted
        if (['42', '-5', '0', '123', 'true'].includes(kid.text)) {
          // These values should be strings, not their converted types
          expect(kid.text).toEqual(expect.any(String));
          expect(typeof kid.text).not.toBe('number');
          expect(typeof kid.text).not.toBe('boolean');
        }
      }
    });
  });

  // Also check that index attributes remain strings
  const blockWithIndex = textBlocks.find(block => block.attributes?.index);
  if (blockWithIndex) {
    expect(typeof blockWithIndex.attributes.index).toBe('string',
      `Attribute values should be strings. Check parseAttributeValue setting.`
    );
  }
});
