import { loadContentTree } from '@/lib/content/loadContentTree';
import { FileStorageProvider } from '@/lib/storage';

it('parses HTML children inside CapaProblem', async () => {
  const { idMap } = await loadContentTree(new FileStorageProvider('content/demos'));
  const root = idMap['CapaDemo'];
  expect(root).toBeDefined();
  const graderId = root.kids[0].id;
  const grader = idMap[graderId];
  expect(grader).toBeDefined();
  const hasP = grader.kids.some(k => k.type === 'html' && k.tag === 'p');
  expect(hasP).toBe(true);
});
