// src/lib/storage/network.ts
import type { StorageProvider, XmlFileInfo, XmlScanResult } from './index';

export class NetworkStorageProvider implements StorageProvider {
  baseUrl: string;

  constructor(baseUrl = '/api/file') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async loadXmlFilesWithStats(
    _prev: Record<string, XmlFileInfo> = {}
  ): Promise<XmlScanResult> {
    throw new Error('network storage scan not implemented');
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
