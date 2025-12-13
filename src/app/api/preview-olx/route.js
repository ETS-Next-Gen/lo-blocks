// src/app/api/preview-olx/route.js
// Serves PEG preview OLX files from src/components/blocks/
import { promises as fs } from 'fs';
import path from 'path';

// Only allow reading .pegjs.preview.olx files from specific directories
const ALLOWED_DIRS = [
  'src/components/blocks',
  'src/lib/template'
];

export async function GET(request) {
  const url = new URL(request.url);
  const relPath = url.searchParams.get('path');

  if (!relPath) {
    return Response.json({ ok: false, error: 'Missing path' }, { status: 400 });
  }

  // Security: only allow .pegjs.preview.olx files
  if (!relPath.endsWith('.pegjs.preview.olx')) {
    return Response.json({ ok: false, error: 'Invalid file type' }, { status: 400 });
  }

  // Security: must be in allowed directories
  const normalized = path.normalize(relPath);
  const isAllowed = ALLOWED_DIRS.some(dir => normalized.startsWith(dir + '/') || normalized.startsWith(dir + path.sep));
  if (!isAllowed || normalized.includes('..')) {
    return Response.json({ ok: false, error: 'Path not allowed' }, { status: 400 });
  }

  try {
    const content = await fs.readFile(relPath, 'utf-8');
    return new Response(content, {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return Response.json({ ok: false, error: 'Preview file not found' }, { status: 404 });
    }
    console.error(`[API /preview-olx] ${err.message}`);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
