import { loadContentTree } from '@/lib/content/loadContentTree.js';

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const { idMap, parsed } = await loadContentTree();

    if (!id || !idMap[id]) {
      return Response.json(
        {
          ok: false,
          error: `No content found for ID: ${id}`,
        },
        { status: 404 }
      );
    }

    return Response.json({
      ok: true,
      idMap,
      parsed,
    });
  } catch (error) {
    console.error('Error loading content:', error);

    return Response.json(
      {
        ok: false,
        error: error.message ?? 'Unknown error',
      },
      { status: 500 }
    );
  }
}
