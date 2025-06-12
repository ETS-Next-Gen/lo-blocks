import { loadContentTree } from '@/lib/content/loadContentTree';
import { FileStorageProvider } from '@/lib/storage';

it('wires inputs and graders with default IDs', async () => {
  const { idMap } = await loadContentTree(new FileStorageProvider('content/demos'));
  const root = idMap['CapaDemo'];
  expect(root).toBeDefined();

  const graderId = 'CapaDemo_grader_0';
  const inputId = 'CapaDemo_input_0';

  expect(idMap[graderId]).toBeDefined();
  expect(idMap[inputId]).toBeDefined();
  expect(idMap['CapaDemo_button']).toBeUndefined();
  expect(idMap['CapaDemo_correctness']).toBeUndefined();

  const grader = idMap[graderId];
  const hasP = grader.kids.some(k => k.type === 'html' && k.tag === 'p');
  expect(hasP).toBe(true);

  expect(idMap[graderId].attributes.targets).toBe(inputId);
  expect(root.attributes.targets).toBe(graderId);
});
