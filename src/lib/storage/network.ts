// src/lib/storage/network.ts
// src/lib/storage/network.ts
import type {
  StorageProvider,
  XmlFileInfo,
  XmlScanResult,
  FileSelection,
  FileNode,
} from './index';

export class NetworkStorageProvider implements StorageProvider {
  baseUrl: string;
  filesUrl: string;

  constructor(baseUrl = '/api/file', filesUrl = '/api/files') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.filesUrl = filesUrl.replace(/\/$/, '');
  }

  async loadXmlFilesWithStats(
    _prev: Record<string, XmlFileInfo> = {}
  ): Promise<XmlScanResult> {
    throw new Error('network storage scan not implemented');
  }

  async listFiles(selection: FileSelection = {}): Promise<FileNode> {
    const params = new URLSearchParams();
    if (selection.contains) params.set('contains', selection.contains);
    if (selection.glob) params.set('glob', selection.glob);
    const res = await fetch(
      params.toString()
        ? `${this.filesUrl}?${params.toString()}`
        : this.filesUrl,
    );
    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error || 'Failed to list files');
    }
    return json.tree as FileNode;
  }

  async read(path: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}?path=${encodeURIComponent(path)}`);
    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error || 'Failed to read');
    }
    return json.content as string;
  }

  async write(path: string, content: string): Promise<void> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content }),
    });
    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error || 'Failed to write');
    }
  }

  async update(path: string, content: string): Promise<void> {
    await this.write(path, content);
  }
}
