// src/lib/storage/index.ts
//
// Storage abstraction layer - pluggable and stackable content persistence.
//
// Provides a unified interface for accessing learning content from multiple sources:
// - FileStorageProvider: Local filesystem access (primary implementation)
// - NetworkStorageProvider: HTTP-based content APIs
// - GitStorageProvider: Version-controlled content (planned)
// - PostgresStorageProvider: Database-backed content (planned)
//
// Key property: STACKING - Storage providers can overlay on each other, enabling
// workflows like: local development content → university database → platform content.
// Developers can work locally with git/file storage while overlaying and pushing
// to institutional databases that reference shared platform content.
//
// Additional features:
// - Change detection for incremental content updates
// - Security sandbox with path validation and symlink prevention
// - Provenance tracking for debugging and error reporting
// - Image path resolution for media assets
//
import path from 'path';
// TODO: Consolidate to fileTypes.ts
import pegExts from '../../generated/pegExtensions.json' assert { type: 'json' };
import { ProvenanceURI } from '../types';
import { fileTypes, FileType } from './fileTypes';

export async function resolveSafePath(baseDir: string, relPath: string) {
  if (typeof relPath !== 'string' || relPath.includes('\0')) {
    throw new Error('Invalid path');
  }
  const full = path.resolve(baseDir, relPath);
  const relative = path.relative(baseDir, full);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Invalid path');
  }
  const fs = await import('fs/promises');
  const stats = await fs.lstat(full).catch(() => null);
  if (stats && stats.isSymbolicLink()) {
    throw new Error('Symlinks not allowed');
  }
  return full;
}
export interface XmlFileInfo {
  id: ProvenanceURI;
  type: FileType;
  _metadata: any;
  content: string;
}

export interface XmlScanResult {
  added: Record<ProvenanceURI, XmlFileInfo>;
  changed: Record<ProvenanceURI, XmlFileInfo>;
  unchanged: Record<ProvenanceURI, XmlFileInfo>;
  deleted: Record<ProvenanceURI, XmlFileInfo>;
}

export interface StorageProvider {
  /**
   * Scan for XML/OLX files returning added/changed/unchanged/deleted
   * relative to a previous scan. The `_metadata` structure is
   * provider specific (mtime+size, git hash, DB id, etc.).
   */
  loadXmlFilesWithStats(previous?: Record<ProvenanceURI, XmlFileInfo>): Promise<XmlScanResult>;

  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
  update(path: string, content: string): Promise<void>;
  listFiles(selection?: FileSelection): Promise<UriNode>;

  /**
   * Resolve a relative path against a base provenance URI
   * @param baseProvenance - Provenance URI of current OLX file
   * @param relativePath - Relative path from OLX (e.g., "static/image.png")
   * @returns Resolved path relative to content root (e.g., "mycourse/static/image.png")
   */
  resolveRelativePath(baseProvenance: ProvenanceURI, relativePath): string;

  /**
   * Check if an image file exists and is valid
   * @param imagePath - Path relative to content root
   * @returns Promise<boolean>
   */
  validateImagePath(imagePath): Promise<boolean>;
}

export interface FileSelection {
  // Reserved for future filtering options
  [key: string]: any;
}

export interface UriNode {
  uri: string;
  children?: UriNode[];
}

/**
 * Build a tree of XML/OLX files from the local content directory.
 * The {@link selection} parameter is reserved for future filtering
 * options but is currently ignored.
 */
export async function listFileTree(
  selection: FileSelection = {},
  baseDir = './content'
): Promise<UriNode> {
  const fs = await import('fs/promises');

  const walk = async (rel = ''): Promise<UriNode> => {
    const dirPath = path.join(baseDir, rel);
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const children: UriNode[] = [];
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const relPath = path.join(rel, entry.name);
      if (entry.isDirectory()) {
        children.push(await walk(relPath));
      } else if (entry.isFile()) {
        const allowed = ['.xml', '.olx', '.md', ...pegExts.map(e => `.${e}`)];
        if (allowed.some(ext => entry.name.endsWith(ext))) {
          children.push({ uri: relPath });
        }
      }
    }
    return {
      uri: rel ?? '',
      children,
    };
  };

  // currently selection is unused but reserved for future features
  void selection;
  return walk('');
}

export class FileStorageProvider implements StorageProvider {
  baseDir: string;

  constructor(baseDir = './content') {
    this.baseDir = path.resolve(baseDir);
  }

  async loadXmlFilesWithStats(previous: Record<ProvenanceURI, XmlFileInfo> = {}): Promise<XmlScanResult> {
    const fs = await import('fs/promises');

    function isContentFile(entry: any, fullPath: string) {
      const fileName = entry.name || fullPath.split('/').pop();
      // TODO: Do this in fileTypes.ts
      const allowed = ['.xml', '.olx', '.md', ...pegExts.map(e => `.${e}`)];
      return (
        entry.isFile() &&
        allowed.some(ext => fullPath.endsWith(ext)) &&
        !fileName.includes('~') &&
        !fileName.includes('#') &&
        !fileName.startsWith('.')
      );
    }

    function fileChanged(statA: any, statB: any) {
      if (!statA || !statB) return true;
      return (
        statA.size !== statB.size ||
        statA.mtimeMs !== statB.mtimeMs ||
        statA.ctimeMs !== statB.ctimeMs
      );
    }

    const found: Record<ProvenanceURI, boolean> = {};
    const added: Record<ProvenanceURI, XmlFileInfo> = {};
    const changed: Record<ProvenanceURI, XmlFileInfo> = {};
    const unchanged: Record<ProvenanceURI, XmlFileInfo> = {};

    const walk = async (currentDir: string) => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (isContentFile(entry, fullPath)) {
          const id = `file://${fullPath}` as ProvenanceURI;
          const stat = await fs.stat(fullPath);
          const ext = path.extname(fullPath).slice(1);
          const type = (fileTypes as any)[ext] ?? ext;
          found[id] = true;
          const prev = previous[id];
          if (prev) {
            if (fileChanged(prev._metadata.stat, stat)) {
              const content = await fs.readFile(fullPath, 'utf-8');
              changed[id] = { id, type, _metadata: { stat }, content };
            } else {
              unchanged[id] = prev;
            }
          } else {
            const content = await fs.readFile(fullPath, 'utf-8');
            added[id] = { id, type, _metadata: { stat }, content };
          }
        }
      }
    };

    await walk(this.baseDir);

    const deleted: Record<ProvenanceURI, XmlFileInfo> = Object.keys(previous)
      .filter(id => !(id in found))
      .reduce((out: Record<ProvenanceURI, XmlFileInfo>, id: ProvenanceURI) => {
        out[id] = previous[id];
        return out;
      }, {});

    return { added, changed, unchanged, deleted };
  }

  async read(filePath: string): Promise<string> {
    const fs = await import('fs/promises');
    const full = await resolveSafePath(this.baseDir, filePath);
    return fs.readFile(full, 'utf-8');
  }

  async write(filePath: string, content: string): Promise<void> {
    const fs = await import('fs/promises');
    const full = await resolveSafePath(this.baseDir, filePath);
    await fs.writeFile(full, content, 'utf-8');
  }

  async update(path: string, content: string): Promise<void> {
    await this.write(path, content);
  }

  async listFiles(selection: FileSelection = {}): Promise<UriNode> {
    return listFileTree(selection, this.baseDir);
  }

  resolveRelativePath(baseProvenance: ProvenanceURI, relativePath): string {
    // Extract the file path from provenance URI relative to this provider's baseDir
    // e.g., "file:///home/user/projects/lo-blocks/content/sba/file.xml" -> "sba/file.xml"
    if (!baseProvenance.startsWith('file://')) {
      throw new Error(`Unsupported provenance format: ${baseProvenance}`);
    }

    const filePath = baseProvenance.slice(7); // Remove "file://"
    const relativeFilePath = path.relative(this.baseDir, filePath);

    if (relativeFilePath.startsWith('..')) {
      throw new Error(`Provenance file outside base directory: ${baseProvenance}`);
    }

    const baseDir = path.dirname(relativeFilePath);
    const resolved = path.join(baseDir, relativePath);
    return path.normalize(resolved);
  }

  async validateImagePath(imagePath): Promise<boolean> {
    try {
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
      if (!imageExts.some(ext => imagePath.toLowerCase().endsWith(ext))) {
        return false;
      }

      const fullPath = await resolveSafePath(this.baseDir, imagePath);
      const fs = await import('fs/promises');
      const stat = await fs.stat(fullPath);
      return stat.isFile();
    } catch {
      return false;
    }
  }
}

export class GitStorageProvider implements StorageProvider {
  constructor(public repoPath: string) {}

  async loadXmlFilesWithStats(_prev: Record<ProvenanceURI, XmlFileInfo> = {}): Promise<XmlScanResult> {
    throw new Error('git storage not implemented');
  }

  async read(_path: string): Promise<string> {
    throw new Error('git storage not implemented');
  }

  async write(_path: string, _content: string): Promise<void> {
    throw new Error('git storage not implemented');
  }

  async update(_path: string, _content: string): Promise<void> {
    throw new Error('git storage not implemented');
  }

  async listFiles(_selection: FileSelection = {}): Promise<UriNode> {
    throw new Error('git storage not implemented');
  }

  resolveRelativePath(_baseProvenance: ProvenanceURI, _relativePath): string {
    throw new Error('git storage not implemented');
  }

  async validateImagePath(_imagePath): Promise<boolean> {
    throw new Error('git storage not implemented');
  }
}

export class PostgresStorageProvider implements StorageProvider {
  constructor(public options: Record<string, any>) {}

  async loadXmlFilesWithStats(_prev: Record<ProvenanceURI, XmlFileInfo> = {}): Promise<XmlScanResult> {
    throw new Error('postgres storage not implemented');
  }

  async read(_path: string): Promise<string> {
    throw new Error('postgres storage not implemented');
  }

  async write(_path: string, _content: string): Promise<void> {
    throw new Error('postgres storage not implemented');
  }

  async update(_path: string, _content: string): Promise<void> {
    throw new Error('postgres storage not implemented');
  }

  async listFiles(_selection: FileSelection = {}): Promise<UriNode> {
    throw new Error('postgres storage not implemented');
  }

  resolveRelativePath(_baseProvenance: ProvenanceURI, _relativePath): string {
    throw new Error('postgres storage not implemented');
  }

  async validateImagePath(_imagePath): Promise<boolean> {
    throw new Error('postgres storage not implemented');
  }
}

export * from './network';

export * from './fileTypes';
export * from './provenance';
