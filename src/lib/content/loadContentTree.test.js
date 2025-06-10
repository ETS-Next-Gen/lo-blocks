import { FileStorageProvider } from '../storage';

it('handles added, unchanged, changed, and deleted files via in-memory mutation', async () => {
  const provider = new FileStorageProvider('./content');

  const first = await provider.loadXmlFilesWithStats();
  const prev = { ...first.added };

  const changerKey = Object.keys(prev).find(id => id.endsWith('changer.xml'));
  prev[changerKey] = {
    ...prev[changerKey],
    version: { ...prev[changerKey].version, mtimeMs: prev[changerKey].version.mtimeMs + 1000 }
  };

  const lessonKey = Object.keys(prev).find(id => id.endsWith('lesson1.xml'));
  delete prev[lessonKey];

  prev['file:///dummy/path/deleted.xml'] = {
    id: 'file:///dummy/path/deleted.xml',
    version: { mtimeMs: 1, size: 10 },
    content: 'dummy'
  };

  const second = await provider.loadXmlFilesWithStats(prev);

  expect(Object.keys(second.unchanged).some(id => id.endsWith('simplecheck.xml'))).toBe(true);
  expect(Object.keys(second.changed).some(id => id.endsWith('changer.xml'))).toBe(true);
  expect(Object.keys(second.added).some(id => id.endsWith('lesson1.xml'))).toBe(true);
  expect(Object.keys(second.deleted).some(id => id.endsWith('lesson1.xml'))).toBe(false);
  expect(Object.keys(second.deleted)).toContain('file:///dummy/path/deleted.xml');
});
