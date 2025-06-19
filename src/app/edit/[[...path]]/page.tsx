// src/app/edit/[[...path]]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { xml } from '@codemirror/lang-xml';
import { useParams } from 'next/navigation';
import { indexXml, setTagNameTransformer } from '@/lib/content/indexXml';
import { transformTagName } from '@/lib/content/xmlTransforms';
import { render, makeRootNode } from '@/lib/render';
import { COMPONENT_MAP } from '@/components/componentMap';

setTagNameTransformer(transformTagName);

import Split from "react-split";
import EditorLLMChat from '@/components/chat/EditorLLMChat';
import FileNav from '@/components/navigation/FileNav';
import ComponentNav from '@/components/navigation/ComponentNav';
import SearchNav from '@/components/navigation/SearchNav';
import AppHeader from '@/components/common/AppHeader';
import { useRouter, useSearchParams } from 'next/navigation';

// This causes CoadMirror not to load on all pages (it gets its own
// chunk for pages that need it).
//
// We use it enough that if this causes problems outside of next.js, it's
// fine to switch to:
// import CodeMirror from '@uiw/react-codemirror';
const CodeMirror = dynamic(() => import('@uiw/react-codemirror').then(mod => mod.default), { ssr: false });


// We should probably pull this out into its own component file
function EditControl({ path, content, onChange, onSave, status }) {
  if (!path) return <div className="p-4">No path provided</div>;

  return (
    <div className="p-4 flex flex-col h-full space-y-4">
      <div className="font-mono text-sm">Editing: {path}</div>
      <div className="flex-1">
        <CodeMirror value={content} height="100%" extensions={[xml()]} onChange={onChange} />
      </div>
      <div>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={status === 'Saving...'}
        >Save</button>
        {status && <div className="text-sm">{status}</div>}
      </div>
    </div>
  );
}

// We should probably pull this out into its own component file
function FourPaneLayout({
  Navigation,
  Chat,
  Editor,
  Preview,
}) {
  // You can replace the placeholders with your actual controls/components
  return (
    <div className="h-full w-full">
      {/* Vertical split: Left and Right */}
      <Split
        className="flex h-full"
        sizes={[25, 75]}
        minSize={200}
        gutterSize={6}
        direction="horizontal"
        style={{ display: "flex" }}
      >
        {/* LEFT: Navigation (top), Chat (bottom) */}
        <Split
          className="flex flex-col h-full"
          sizes={[60, 40]}
          minSize={100}
          gutterSize={6}
          direction="vertical"
        >
          <div className="p-2 overflow-auto border-b border-gray-200">
            {Navigation || <div>Navigation</div>}
          </div>
          <div className="p-2 overflow-auto h-full flex flex-col">
            {Chat || <div>Chat</div>}
          </div>
        </Split>
        {/* RIGHT: Editor (top), Preview (bottom) */}
        <Split
          className="flex flex-col h-full"
          sizes={[70, 30]}
          minSize={100}
          gutterSize={6}
          direction="vertical"
        >
          <div className="p-2 overflow-auto border-b border-gray-200 h-full flex flex-col">
            {Editor || <div>Editor</div>}
          </div>
          <div className="p-2 overflow-auto">{Preview || <div>Preview</div>}</div>
        </Split>
      </Split>
    </div>
  );
}

function PreviewPane({ content, idMap, path }) {
  const [element, setElement] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!idMap) return;
    const t = setTimeout(() => {
      try {
        const localMap: Record<string, any> = {};
        const ids = indexXml(content, [path], localMap);
        if (!ids.length) throw new Error('No root element');
        const combined = { ...idMap, ...localMap };
        const el = render({
          node: ids[0],
          idMap: combined,
          nodeInfo: makeRootNode(),
          componentMap: COMPONENT_MAP,
        });
        setElement(el);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Parse error');
      }
    }, 300);
    return () => clearTimeout(t);
  }, [content, idMap, path]);

  if (error) {
    return <pre className="text-red-600 whitespace-pre-wrap">{error}</pre>;
  }
  return <div className="space-y-4">{element}</div>;
}

function EditWrapper() {
  const path = (useParams().path || []).join('/');

  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [systemMap, setSystemMap] = useState(null);

  useEffect(() => {
    if (!path) return;
    setStatus('Loading...');
    fetch(`/api/file?path=${encodeURIComponent(path)}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setContent(data.content);
          setStatus('');
        } else {
          setStatus(`Error: ${data.error}`);
        }
      })
      .catch(err => setStatus(`Error: ${err.message}`));
  }, [path]);

  // Fetch system idMap once we know the root ID
  useEffect(() => {
    if (!content || systemMap) return;
    try {
      const temp: Record<string, any> = {};
      const ids = indexXml(content, [path], temp);
      if (!ids.length) return;
      fetch(`/api/content/${encodeURIComponent(ids[0])}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok) setSystemMap(data.idMap);
        });
    } catch (_) { /* ignore parse errors on load */ }
  }, [content, path, systemMap]);

  const handleChange = useCallback((val) => setContent(val), []);

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      const res = await fetch('/api/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
      });
      const json = await res.json();
      if (json.ok) setStatus('Saved');
      else setStatus(`Error: ${json.error}`);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <FourPaneLayout
      Navigation={<NavigationPane />}
      Editor={<EditControl path={path} content={content} onChange={handleChange} onSave={handleSave} status={status} />}
      Chat={<EditorLLMChat />}
      Preview={<PreviewPane content={content} idMap={systemMap} path={path} />}
    />
  );
}

function NavigationPane() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<'files' | 'components' | 'search'>(
    (searchParams.get('nav') as 'files' | 'components' | 'search') || 'files'
  );

  const updateMode = (m: 'files' | 'components' | 'search') => {
    const params = new URLSearchParams(searchParams.toString());
    if (m === 'files') params.delete('nav');
    else params.set('nav', m);
    router.push('?' + params.toString());
    setMode(m);
  };

  return (
    <div className="text-sm space-y-2">
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => updateMode('files')}
          className={mode === 'files' ? 'font-bold underline' : ''}
        >Files</button>
        <button
          onClick={() => updateMode('components')}
          className={mode === 'components' ? 'font-bold underline' : ''}
        >Components</button>
        <button
          onClick={() => updateMode('search')}
          className={mode === 'search' ? 'font-bold underline' : ''}
        >Search</button>
      </div>
      {mode === 'files' && <FileNav />}
      {mode === 'components' && <ComponentNav />}
      {mode === 'search' && <SearchNav />}
    </div>
  );
}


export default function EditPage() {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <div className="flex-1 overflow-hidden">
        <EditWrapper />
      </div>
    </div>
  );
}
