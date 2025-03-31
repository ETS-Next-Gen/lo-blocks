import { loadContentTree } from '@/lib/content/loadContentTree.js';

export default async function handler(req, res) {
  const {
    query: { id }
  } = req;

  try {
    const { idMap, parsed } = await loadContentTree();

    if (!id || !idMap[id]) {
      return res.status(404).json({
        ok: false,
        error: `No content found for ID: ${id}`
      });
    }

    res.status(200).json({
      ok: true,
      idMap,
      parsed
    });
  } catch (error) {
    console.error('Error loading content:', error);
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
