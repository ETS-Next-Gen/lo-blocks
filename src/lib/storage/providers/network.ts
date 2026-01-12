// src/lib/storage/providers/network.ts
//
// Network storage provider - HTTP-based content access for Learning Observer.
//
// Enables Learning Observer to load content from remote servers via HTTP APIs,
// supporting scenarios like:
// - Content served from a separate CMS or authoring system
// - Multi-tenant deployments with shared content repositories
// - Content distribution networks for large-scale delivery
//
// The provider translates storage operations into HTTP requests against
// configurable endpoints, maintaining the same interface as local file storage.
//
import type { ProvenanceURI } from '../../types';
import {
  type StorageProvider,
  type XmlFileInfo,
  type XmlScanResult,
  type FileSelection,
  type UriNode,
  type ReadResult,
  type WriteOptions,
  type GrepOptions,
  type GrepMatch,
  VersionConflictError,
} from '../types';

export interface NetworkProviderOptions {
  /** Endpoint for single-file operations (read/write/delete) */
  readEndpoint?: string;
  /** Endpoint for file listing and glob */
  listEndpoint?: string;
  /** Endpoint for grep */
  grepEndpoint?: string;
  /** Endpoint for image validation (HEAD requests) */
  imageEndpoint?: string;
}

export class NetworkStorageProvider implements StorageProvider {
  readEndpoint: string;
  listEndpoint: string;
  grepEndpoint: string;
  imageEndpoint: string;

  constructor(options: NetworkProviderOptions = {}) {
    this.readEndpoint = (options.readEndpoint ?? '/api/file').replace(/\/$/, '');
    this.listEndpoint = (options.listEndpoint ?? '/api/files').replace(/\/$/, '');
    this.grepEndpoint = (options.grepEndpoint ?? '/api/grep').replace(/\/$/, '');
    this.imageEndpoint = (options.imageEndpoint ?? '/content').replace(/\/$/, '');
  }

  /**
   * Resolve a relative path against a base provenance URI.
   * Works client-side by manipulating path strings.
   */
  resolveRelativePath(baseProvenance: ProvenanceURI, relativePath: string): string {
    // Extract path from provenance URI
    // Provenance format varies: "file://...", "network://...", or just a path
    let basePath: string;
    if (baseProvenance.includes('://')) {
      // URI format - extract path after protocol
      const url = new URL(baseProvenance);
      basePath = url.pathname;
    } else {
      // Plain path
      basePath = baseProvenance;
    }

    // Get directory of base file
    const lastSlash = basePath.lastIndexOf('/');
    const baseDir = lastSlash >= 0 ? basePath.slice(0, lastSlash) : '';

    // Resolve relative path
    const parts = (baseDir + '/' + relativePath).split('/').filter(Boolean);
    const resolved: string[] = [];

    for (const part of parts) {
      if (part === '..') {
        resolved.pop();
      } else if (part !== '.') {
        resolved.push(part);
      }
    }

    return resolved.join('/');
  }

  /**
   * Check if an image file exists via HEAD request.
   */
  async validateImagePath(imagePath: string): Promise<boolean> {
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    if (!imageExts.some(ext => imagePath.toLowerCase().endsWith(ext))) {
      return false;
    }

    try {
      const res = await fetch(`${this.imageEndpoint}/${imagePath}`, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Incremental file scanning is not supported over network.
   *
   * This would require streaming large amounts of metadata from the server
   * and maintaining state about previous scans. For network deployments,
   * use listFiles() + read() instead, or implement server-side change detection.
   */
  async loadXmlFilesWithStats(
    _prev: Record<ProvenanceURI, XmlFileInfo> = {}
  ): Promise<XmlScanResult> {
    throw new Error(
      'NetworkStorageProvider does not support incremental file scanning. ' +
      'Use listFiles() to get current file tree, or implement change detection server-side.'
    );
  }

  async listFiles(selection: FileSelection = {}): Promise<UriNode> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(selection)) {
      if (value != null) params.set(key, String(value));
    }
    const url = params.toString()
      ? `${this.listEndpoint}?${params.toString()}`
      : this.listEndpoint;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error ?? 'Failed to list files');
    }
    return json.tree as UriNode;
  }

  async read(path: string): Promise<ReadResult> {
    const res = await fetch(
      `${this.readEndpoint}?path=${encodeURIComponent(path)}`,
    );
    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error ?? 'Failed to read');
    }
    return {
      content: json.content as string,
      metadata: json.metadata,
    };
  }

  async write(path: string, content: string, options: WriteOptions = {}): Promise<void> {
    const { previousMetadata, force = false } = options;
    const res = await fetch(this.readEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content, previousMetadata, force }),
    });
    const json = await res.json();
    if (!json.ok) {
      if (json.conflict) {
        throw new VersionConflictError(json.error, json.metadata);
      }
      throw new Error(json.error ?? 'Failed to write');
    }
  }

  async update(path: string, content: string): Promise<void> {
    await this.write(path, content);
  }

  async delete(path: string): Promise<void> {
    const res = await fetch(
      `${this.readEndpoint}?path=${encodeURIComponent(path)}`,
      { method: 'DELETE' }
    );
    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error ?? 'Failed to delete');
    }
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    const res = await fetch(this.readEndpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: oldPath, newPath }),
    });
    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error ?? 'Failed to rename');
    }
  }

  /**
   * Find files matching a glob pattern.
   * Calls the list endpoint with a pattern parameter.
   */
  async glob(pattern: string, basePath?: string): Promise<string[]> {
    const params = new URLSearchParams({ pattern });
    if (basePath) params.set('path', basePath);

    const res = await fetch(`${this.listEndpoint}?${params.toString()}`);
    const json = await res.json();

    if (!json.ok) {
      throw new Error(json.error ?? 'Failed to glob');
    }

    return json.files as string[];
  }

  /**
   * Search file contents for a pattern.
   */
  async grep(pattern: string, options: GrepOptions = {}): Promise<GrepMatch[]> {
    const params = new URLSearchParams({ pattern });
    if (options.basePath) params.set('path', options.basePath);
    if (options.include) params.set('include', options.include);
    if (options.limit) params.set('limit', String(options.limit));

    const res = await fetch(`${this.grepEndpoint}?${params.toString()}`);
    const json = await res.json();

    if (!json.ok) {
      throw new Error(json.error ?? 'Failed to grep');
    }

    return json.matches as GrepMatch[];
  }
}
