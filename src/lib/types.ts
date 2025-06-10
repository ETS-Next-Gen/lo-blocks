export interface FileProvenance {
  type: 'file';
  path: string;
  [key: string]: any;
}

export interface GitProvenance {
  type: 'git';
  repo: string;
  path: string;
  [key: string]: any;
}

export interface PostgresProvenance {
  type: 'postgres';
  db: string;
  [key: string]: any;
}

export interface GenericProvenance {
  type: string;
  path?: string;
  [key: string]: any;
}

/** Primary representation for provenance references */
export type Provenance = string[];

/** Structured representation used in debug output */
export type ProvenanceStruct =
  | FileProvenance
  | GitProvenance
  | PostgresProvenance
  | GenericProvenance;

export type ProvenanceItem = string | ProvenanceStruct;

export function parseProvenance(uri: string): ProvenanceStruct {
  const [type, suffix] = uri.split('://');
  if (!type || suffix === undefined) {
    throw new Error(`Invalid provenance URI: ${uri}`);
  }

  const converters: Record<string, (suf: string) => Record<string, any>> = {
    file: suf => {
      const [pathPart, queryPart] = suf.split('?');
      const result: Record<string, any> = {
        path: pathPart.startsWith('/') ? pathPart : `/${pathPart}`
      };
      if (queryPart) {
        const params = new URLSearchParams(queryPart);
        if (params.has('path')) {
          throw new Error(`Malformed file provenance: path duplicated in query`);
        }
        params.forEach((v, k) => {
          result[k] = v;
        });
      }
      return result;
    },
    git: suf => {
      const [repoPart, queryPart] = suf.split('?');
      const result: Record<string, any> = { repo: repoPart };
      if (queryPart) {
        const params = new URLSearchParams(queryPart);
        params.forEach((v, k) => {
          result[k] = v;
        });
      }
      if (!result.path) {
        throw new Error(`Malformed git provenance: missing path`);
      }
      return result;
    },
    postgres: suf => {
      const [dbPart, queryPart] = suf.split('?');
      const result: Record<string, any> = { db: dbPart };
      if (queryPart) {
        const params = new URLSearchParams(queryPart);
        params.forEach((v, k) => {
          result[k] = v;
        });
      }
      return result;
    }
  };

  if (!(type in converters)) {
    throw new Error(`Unknown provenance type: ${type}`);
  }

  return { type, ...converters[type](suffix) } as ProvenanceStruct;
}

export function parseProvenanceList(list: string[]): ProvenanceStruct[] {
  return list.map(parseProvenance);
}

export function formatProvenance(item: ProvenanceStruct | string): string {
  if (typeof item === 'string') return item;
  const converters: Record<string, (obj: any) => string> = {
    file: (obj: FileProvenance) => {
      const { path, type, ...rest } = obj;
      const query = new URLSearchParams(rest).toString();
      return `file://${path}${query ? `?${query}` : ''}`;
    },
    git: (obj: GitProvenance) => {
      const { repo, type, ...rest } = obj;
      const query = new URLSearchParams(rest).toString();
      return `git://${repo}${query ? `?${query}` : ''}`;
    },
    postgres: (obj: PostgresProvenance) => {
      const { db, type, ...rest } = obj;
      const query = new URLSearchParams(rest).toString();
      return `postgres://${db}${query ? `?${query}` : ''}`;
    }
  };

  const conv = converters[item.type];
  if (!conv) throw new Error(`Unknown provenance type: ${item.type}`);
  return conv(item);
}

export function formatProvenanceList(list: (ProvenanceStruct | string)[]): string[] {
  return list.map(formatProvenance);
}
