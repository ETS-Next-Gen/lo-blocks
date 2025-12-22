// src/lib/storage/types.ts
//
// Type definitions for the storage abstraction layer.
//
// Defines the StorageProvider interface and related types used across
// all storage implementations (file, network, memory, git, postgres).
//
import { ProvenanceURI } from '../types';
import { FileType } from './fileTypes';

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

export interface FileSelection {
  // Reserved for future filtering options
  [key: string]: any;
}

export interface UriNode {
  uri: string;
  children?: UriNode[];
}

/**
 * Result from reading a file, includes opaque metadata for conflict detection
 */
export interface ReadResult {
  content: string;
  /** Provider-specific metadata (mtime, git hash, etag, etc.) - opaque to consumers */
  metadata?: unknown;
}

/**
 * Options for writing a file with optional conflict detection
 */
export interface WriteOptions {
  /** Metadata from previous read - if provided and doesn't match current, write fails */
  previousMetadata?: unknown;
  /** Force write even if metadata mismatch */
  force?: boolean;
}

/**
 * Error thrown when write conflicts with changed file
 */
export class VersionConflictError extends Error {
  /** Current metadata of the file (for potential retry/merge) */
  currentMetadata?: unknown;

  constructor(message = 'File has been modified', currentMetadata?: unknown) {
    super(message);
    this.name = 'VersionConflictError';
    this.currentMetadata = currentMetadata;
  }
}

export interface StorageProvider {
  /**
   * Scan for XML/OLX files returning added/changed/unchanged/deleted
   * relative to a previous scan. The `_metadata` structure is
   * provider specific (mtime+size, git hash, DB id, etc.).
   */
  loadXmlFilesWithStats(previous?: Record<ProvenanceURI, XmlFileInfo>): Promise<XmlScanResult>;

  read(path: string): Promise<ReadResult>;
  write(path: string, content: string, options?: WriteOptions): Promise<void>;
  update(path: string, content: string): Promise<void>;
  listFiles(selection?: FileSelection): Promise<UriNode>;

  /**
   * Resolve a relative path against a base provenance URI
   * @param baseProvenance - Provenance URI of current OLX file
   * @param relativePath - Relative path from OLX (e.g., "static/image.png")
   * @returns Resolved path relative to content root (e.g., "mycourse/static/image.png")
   */
  resolveRelativePath(baseProvenance: ProvenanceURI, relativePath: string): string;

  /**
   * Check if an image file exists and is valid
   * @param imagePath - Path relative to content root
   * @returns Promise<boolean>
   */
  validateImagePath(imagePath: string): Promise<boolean>;
}
