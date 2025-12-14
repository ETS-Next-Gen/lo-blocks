// src/app/api/docs/grammar/[name]/route.js
//
// Grammar documentation API - serves metadata and content for PEG grammars.
// See ../DESIGN.md for architectural decisions and alternatives considered.
//
import { promises as fs } from 'fs';
import { resolveSafeReadPath } from '@/lib/storage/providers/file';
import { grammarInfo, PEG_CONTENT_EXTENSIONS } from '@/generated/parserRegistry';

export async function GET(request, { params }) {
  const { name } = await params;

  // Find grammar by name or extension
  // Accept both "chat" and "chatpeg"
  const ext = name.endsWith('peg') ? name : `${name}peg`;
  const info = grammarInfo[ext];

  if (!info) {
    return Response.json(
      { ok: false, error: `Grammar '${name}' not found` },
      { status: 404 }
    );
  }

  const result = {
    name: info.grammarName,
    extension: ext,
    grammarDir: info.grammarDir,
    preview: null,
    // Future: description, readme, examples
  };

  // Load preview template if it exists
  const previewFileName = `${info.grammarName}.pegjs.preview.olx`;
  const grammarDirPath = info.grammarDir.replace(/^@\//, 'src/');
  const previewPath = `${grammarDirPath}/${previewFileName}`;

  try {
    const fullPath = await resolveSafeReadPath(process.cwd(), previewPath);
    result.preview = await fs.readFile(fullPath, 'utf-8');
  } catch (err) {
    // Preview is optional - not an error if missing
    if (err.code !== 'ENOENT' && !err.message?.includes('not found')) {
      console.warn(`[API /docs/grammar] Could not read preview for ${name}: ${err.message}`);
    }
  }

  return Response.json({ ok: true, grammar: result });
}
