# Edit Page & Live Preview Design Options

This document outlines approaches to fix the broken edit page and support
editing OLX and auxiliary files (e.g. `.chatpeg`) with a live preview.

## Current state

The preview pane parses the edited file with `parseOLX` and merges the
result with the global `idMap` fetched from `/api/content/all`.
`parseOLX` now supports an optional storage provider and asynchronous
operations, but the edit page still calls it without a provider:

```ts
candidate = await parseOLX(content, prov);
```
(see `src/app/edit/[[...path]]/page.tsx` lines 206–211)

This means blocks like `<Chat src="sba.chatpeg"/>` cannot load their
external content.  The `/api/file` route also rejects non‐XML files,
blocking edits of `.chatpeg` scripts:

```ts
if (!full.endsWith('.xml') && !full.endsWith('.olx')) {
  throw new Error('Invalid file type');
}
```
(from `src/app/api/file/route.js` lines 23–26)

## Goals
- Allow authors to edit XML/OLX files and related assets (`.chatpeg`, etc.)
- Show a preview that reflects unsaved edits across all referenced files
- Keep the interface responsive (re-render on change)

## Proposed building blocks

### 1. Storage provider overlay
Implement a `ReduxStorageProvider` that wraps an existing provider
(e.g. `FileStorageProvider`).  It would:
- look up unsaved edits from Redux using the path as key
- fall back to the underlying provider when no override exists
- expose the same `read`, `write`, `update` API

This allows `parseOLX` to load referenced sources using in-memory
content when available.  The provider can be constructed in the edit
page and passed to `parseOLX`.

### 2. Passing the provider to the preview
`PreviewPane` should create a provider instance each time content or
related state changes:
```ts
const provider = new ReduxStorageProvider(baseProvider, reduxState);
const prov = path ? [`file://${path}`] : [];
const candidate = await parseOLX(content, prov, provider);
```
Updating this call ensures `<Chat src="..."/>` resolves correctly.

### 3. Relax file type checks
Update `/api/file` to allow non‑XML text files such as `.chatpeg`.  This
lets the editor load and save auxiliary files.  A simple extension check
could whitelist `.chatpeg` while still blocking unknown types.

### 4. Choosing what to preview
There is often no one-to-one mapping between the file being edited and
what should render.  A `.chatpeg` file may be referenced in multiple OLX
files.  Two possible strategies:

1. **Explicit preview target** – the URL (or a drop-down) specifies both
the edit file and the OLX file to preview.  When editing an auxiliary
file the editor defaults to the first referencing OLX document.
2. **Automatic detection** – build a reverse index from the global
`idMap` to locate parents that use the current file.  If only one parent
is found, preview it automatically; otherwise prompt the user.

Both approaches rely on `parseOLX` + `ReduxStorageProvider` so preview
always uses the latest in-memory content.

### 5. Triggering re-render
`ReduxStorageProvider` can emit a custom event or update Redux state
whenever a file changes.  The preview pane subscribes to these changes
(via a React hook) and re-runs `parseOLX` for the preview target.  This
keeps the UI responsive without polling.

## Recommendation
Start with the explicit preview target (#4 option 1) and the storage
provider overlay.  They introduce minimal complexity and unblock author
workflows.  Automatic parent detection and richer collaboration features
can be layered on later.

