export interface FileProvenance {
  type: 'file';
  uri: string;
}

// Planned: database-backed content
export interface DatabaseProvenance {
  type: 'database';
  id: string;
  table?: string;
}

// Planned: git sources
export interface GitProvenance {
  type: 'git';
  repo: string;
  path: string;
  commit?: string;
}

// For now we only expose FileProvenance. Additional types above will be enabled
// once implemented.
export type ProvenanceSource =
  | FileProvenance;
  // | DatabaseProvenance
  // | GitProvenance

export type Provenance = ProvenanceSource[];

export function fileSource(uri: string): FileProvenance {
  return { type: 'file', uri };
}
