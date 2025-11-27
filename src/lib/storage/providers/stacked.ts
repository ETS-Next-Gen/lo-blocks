// src/lib/storage/providers/stacked.ts
//
// Stacked storage provider - layered content access with fallback chain.
//
// Enables content layering where higher-priority providers override lower ones:
// - User edits (highest priority)
// - Course-specific content
// - Institution content
// - Platform defaults (lowest priority)
//
// For read operations, tries each provider in order until content is found.
// Write operations go to the first provider that supports writes.
//
import type { ProvenanceURI } from '../../types';
import type {
  StorageProvider,
  XmlFileInfo,
  XmlScanResult,
  FileSelection,
  UriNode,
} from '../types';

export class StackedStorageProvider implements StorageProvider {
  private providers: StorageProvider[];

  /**
   * Create a stacked provider from multiple providers.
   * Earlier providers in the array have higher priority (are checked first).
   */
  constructor(providers: StorageProvider[]) {
    if (providers.length === 0) {
      throw new Error('StackedStorageProvider requires at least one provider');
    }
    this.providers = providers;
  }

  /**
   * Read from the first provider that has the file.
   * Tries each provider in order until one succeeds.
   */
  async read(path: string): Promise<string> {
    let lastError: Error | null = null;

    for (const provider of this.providers) {
      try {
        return await provider.read(path);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Continue to next provider
      }
    }

    throw lastError || new Error(`File not found in any provider: ${path}`);
  }

  /**
   * Write to the first provider (highest priority layer).
   */
  async write(path: string, content: string): Promise<void> {
    return this.providers[0].write(path, content);
  }

  /**
   * Update in the first provider (highest priority layer).
   */
  async update(path: string, content: string): Promise<void> {
    return this.providers[0].update(path, content);
  }

  /**
   * List files from all providers, merged.
   * Files from higher-priority providers shadow lower ones.
   */
  async listFiles(selection: FileSelection = {}): Promise<UriNode> {
    // For now, just return from the first provider
    // A full implementation would merge trees
    return this.providers[0].listFiles(selection);
  }

  /**
   * Scan all providers and merge results.
   * This is complex because we need to track which provider each file came from.
   */
  async loadXmlFilesWithStats(
    previous: Record<ProvenanceURI, XmlFileInfo> = {}
  ): Promise<XmlScanResult> {
    // For now, delegate to first provider
    // A full implementation would merge from all providers
    return this.providers[0].loadXmlFilesWithStats(previous);
  }

  /**
   * Resolve relative path using the first provider that supports it.
   */
  resolveRelativePath(baseProvenance: ProvenanceURI, relativePath: string): string {
    // Try each provider until one works
    for (const provider of this.providers) {
      try {
        return provider.resolveRelativePath(baseProvenance, relativePath);
      } catch {
        // Continue to next provider
      }
    }
    throw new Error(`Cannot resolve path in any provider: ${relativePath}`);
  }

  /**
   * Check if image exists in any provider.
   */
  async validateImagePath(imagePath: string): Promise<boolean> {
    for (const provider of this.providers) {
      try {
        if (await provider.validateImagePath(imagePath)) {
          return true;
        }
      } catch {
        // Continue to next provider
      }
    }
    return false;
  }
}
