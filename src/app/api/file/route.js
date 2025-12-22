// src/app/api/file/route.js
import { FileStorageProvider } from '@/lib/storage/providers/file';
import { VersionConflictError } from '@/lib/storage/types';
import { validateContentPath } from '@/lib/storage/contentPaths';

const provider = new FileStorageProvider('./content');

export async function GET(request) {
  const url = new URL(request.url);
  const relPath = url.searchParams.get('path');

  const validation = validateContentPath(relPath);
  if (!validation.valid) {
    return Response.json({ ok: false, error: validation.error }, { status: 400 });
  }

  try {
    const result = await provider.read(validation.relativePath);
    return Response.json({ ok: true, content: result.content, metadata: result.metadata });
  } catch (err) {
    const isNotFound = err.code === 'ENOENT' || err.message?.includes('not found');
    const status = isNotFound ? 404 : 500;
    const error = isNotFound ? `File not found: ${relPath}` : err.message;
    console.error(`[API /file GET] ${error}`);
    return Response.json({ ok: false, error }, { status });
  }
}

export async function POST(request) {
  const { path: relPath, content, previousMetadata, force } = await request.json();

  const validation = validateContentPath(relPath);
  if (!validation.valid) {
    return Response.json({ ok: false, error: validation.error }, { status: 400 });
  }

  if (content?.length > 100_000) {
    return Response.json({ ok: false, error: 'File too large (max 100KB)' }, { status: 400 });
  }

  try {
    await provider.write(validation.relativePath, content, { previousMetadata, force });
    return Response.json({ ok: true });
  } catch (err) {
    // Handle version conflict specially
    if (err instanceof VersionConflictError || err.name === 'VersionConflictError') {
      console.warn(`[API /file POST] Conflict: ${err.message}`);
      return Response.json({
        ok: false,
        conflict: true,
        error: err.message,
        metadata: err.currentMetadata,
      }, { status: 409 });
    }
    console.error(`[API /file POST] ${err.message}`);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const relPath = url.searchParams.get('path');

  const validation = validateContentPath(relPath);
  if (!validation.valid) {
    return Response.json({ ok: false, error: validation.error }, { status: 400 });
  }

  try {
    await provider.delete(validation.relativePath);
    return Response.json({ ok: true });
  } catch (err) {
    const isNotFound = err.code === 'ENOENT' || err.message?.includes('not found');
    const status = isNotFound ? 404 : 500;
    const error = isNotFound ? `File not found: ${relPath}` : err.message;
    console.error(`[API /file DELETE] ${error}`);
    return Response.json({ ok: false, error }, { status });
  }
}

export async function PUT(request) {
  const { path: relPath, newPath } = await request.json();

  const srcValidation = validateContentPath(relPath);
  if (!srcValidation.valid) {
    return Response.json({ ok: false, error: srcValidation.error }, { status: 400 });
  }

  const dstValidation = validateContentPath(newPath);
  if (!dstValidation.valid) {
    return Response.json({ ok: false, error: dstValidation.error }, { status: 400 });
  }

  try {
    await provider.rename(srcValidation.relativePath, dstValidation.relativePath);
    return Response.json({ ok: true });
  } catch (err) {
    const isNotFound = err.code === 'ENOENT' || err.message?.includes('not found');
    const status = isNotFound ? 404 : 500;
    const error = isNotFound ? `File not found: ${relPath}` : err.message;
    console.error(`[API /file PUT] ${error}`);
    return Response.json({ ok: false, error }, { status });
  }
}
