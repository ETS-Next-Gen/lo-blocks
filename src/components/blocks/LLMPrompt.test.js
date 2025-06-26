import { parseOLX } from '@/lib/content/parseOLX';

const PROV = ['file://test.xml'];

it('parses curly brace references', async () => {
  const xml = '<Lesson id="root"><TextArea id="essay"/><LLMFeedback id="out"/><LLMButton><LLMPrompt id="prompt" target="out">Rewrite {essay}</LLMPrompt></LLMButton></Lesson>';
  const { idMap } = await parseOLX(xml, PROV);
  const entry = idMap['prompt'];
  expect(entry).toBeDefined();
  expect(Array.isArray(entry.kids)).toBe(true);
  const refKid = entry.kids.find(k => k.type === 'ref');
  expect(refKid).toEqual({ type: 'ref', id: 'essay' });
});
