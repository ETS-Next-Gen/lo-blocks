// src/app/api/docs/grammar/[name]/route.js
//
// Grammar documentation API - serves metadata and content for PEG grammars.
// See ../DESIGN.md for architectural decisions and alternatives considered.
//
import { promises as fs } from 'fs';
import path from 'path';
import { resolveSafeReadPath } from '@/lib/storage/providers/file';
import { grammarInfo, PEG_CONTENT_EXTENSIONS } from '@/generated/parserRegistry';

/**
 * Extract description from the comment block at the top of a .pegjs file.
 */
function extractDescription(content) {
  const blockMatch = content.match(/^\/\*\*?\s*\n?([\s\S]*?)\*\//);
  if (blockMatch) {
    const lines = blockMatch[1]
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, '').trim())
      .filter(line => line.length > 0);

    const descLines = [];
    for (const line of lines) {
      if (line.match(/^[-=]{3,}/) || line.match(/^(Example|Future|TODO|Note):/i)) break;
      descLines.push(line);
    }
    return descLines.join(' ').trim() || null;
  }

  const lineComments = [];
  for (const line of content.split('\n')) {
    const match = line.match(/^\/\/\s*(.*)/);
    if (match) {
      lineComments.push(match[1]);
    } else if (line.trim() && !line.startsWith('//')) {
      break;
    }
  }
  return lineComments.join(' ').trim() || null;
}

export async function GET(request, { params }) {
  const { name } = await params;
  const projectRoot = process.cwd();

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

  const grammarDirPath = info.grammarDir.replace(/^@\//, 'src/');
  const grammarFileName = `${info.grammarName}.pegjs`;
  const grammarFilePath = `${grammarDirPath}/${grammarFileName}`;

  const result = {
    name: info.grammarName,
    extension: ext,
    fileExtension: `.${ext}`,
    source: grammarFilePath,
    grammarDir: grammarDirPath,
    description: null,
    grammar: null,  // The .pegjs source
    preview: null,
    readme: null,
    examples: []
  };

  // Read grammar file
  try {
    const fullPath = await resolveSafeReadPath(projectRoot, grammarFilePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    result.grammar = content;
    result.description = extractDescription(content);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`[API /docs/grammar] Could not read ${grammarFilePath}: ${err.message}`);
    }
  }

  // Load preview template if it exists
  const previewPath = `${grammarDirPath}/${info.grammarName}.pegjs.preview.olx`;
  try {
    const fullPath = await resolveSafeReadPath(projectRoot, previewPath);
    result.preview = await fs.readFile(fullPath, 'utf-8');
  } catch (err) {
    if (err.code !== 'ENOENT' && !err.message?.includes('not found')) {
      console.warn(`[API /docs/grammar] Could not read preview for ${name}: ${err.message}`);
    }
  }

  // Load README if it exists (try grammar-specific first, then directory README)
  const readmePaths = [
    `${grammarDirPath}/${info.grammarName}.pegjs.md`,
    `${grammarDirPath}/README.md`
  ];
  for (const readmePath of readmePaths) {
    try {
      const fullPath = await resolveSafeReadPath(projectRoot, readmePath);
      result.readme = {
        path: readmePath,
        content: await fs.readFile(fullPath, 'utf-8')
      };
      break;
    } catch {
      // Try next path
    }
  }

  // Load example files (files with the grammar's extension)
  try {
    const dirFullPath = await resolveSafeReadPath(projectRoot, grammarDirPath);
    const files = await fs.readdir(dirFullPath);
    const exampleFiles = files.filter(f => f.endsWith(`.${ext}`));

    for (const filename of exampleFiles) {
      const examplePath = `${grammarDirPath}/${filename}`;
      try {
        const fullPath = await resolveSafeReadPath(projectRoot, examplePath);
        result.examples.push({
          path: examplePath,
          filename,
          content: await fs.readFile(fullPath, 'utf-8')
        });
      } catch (err) {
        console.warn(`[API /docs/grammar] Could not read example ${examplePath}: ${err.message}`);
      }
    }
  } catch {
    // Can't read directory - that's fine
  }

  return Response.json({ ok: true, grammar: result });
}
