// src/lib/content/loadContentTree.ts
import { StorageProvider, FileStorageProvider } from '@/lib/storage';
import { Provenance } from '@/lib/types';
import { formatProvenance } from '@/lib/storage/provenance';
import { indexXml, setTagNameTransformer } from '@/lib/content/indexXml';
import { transformTagName } from '@/lib/content/xmlTransforms';

setTagNameTransformer(transformTagName);

const contentStore = {
  byProvenance: {},
  byId: {}
};


export async function loadContentTree(provider: StorageProvider = new FileStorageProvider('./content')) {
  const { added, changed, unchanged, deleted } = await provider.loadXmlFilesWithStats(contentStore.byProvenance);

  deleteNodesByProvenance([...Object.keys(deleted), ...Object.keys(changed)]);

  for (const [srcId, fileInfo] of Object.entries({ ...added, ...changed })) {
    const indexedIds = indexXml(fileInfo.content, [srcId], contentStore.byId);
    contentStore.byProvenance[srcId] = {
      nodes: indexedIds,
      ...fileInfo
    };
  }

  return {
    parsed: contentStore.byProvenance,
    idMap: contentStore.byId
  };
}

// Helper: remove all nodes for deleted/changed files
function deleteNodesByProvenance(relativePaths) {
  for (const relPath of relativePaths) {
    const prev = contentStore.byProvenance[relPath];
    if (prev?.nodes) {
      for (const id of prev.nodes) {
        delete contentStore.byId[id];
      }
    }
    delete contentStore.byProvenance[relPath];
  }
}



// Helper: walk directory, collect .xml/.olx files with stat info and detect changes
