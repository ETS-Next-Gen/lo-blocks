// src/components/chat/EditorLLMChat.jsx
'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ChatComponent, InputFooter } from '@/components/common/ChatComponent';
import { useChat } from '@/lib/llm/reduxClient.jsx';
import { buildSystemPrompt, getFileType } from '@/lib/editor/context';
import { createEditorTools } from '@/lib/editor/tools';

/**
 * LLM chat for the editor pane.
 *
 * @param {object} props
 * @param {string} props.path - Current file path
 * @param {string} props.content - Current file content
 * @param {function} props.onApplyEdit - Called when LLM applies an edit
 */
export default function EditorLLMChat({ path, content, onApplyEdit }) {
  const [systemPrompt, setSystemPrompt] = useState(null);

  // Keep refs to current values for tool callbacks
  const contentRef = useRef(content);
  const pathRef = useRef(path);
  useEffect(() => { contentRef.current = content; }, [content]);
  useEffect(() => { pathRef.current = path; }, [path]);

  // Build system prompt when path/content changes
  useEffect(() => {
    buildSystemPrompt({ path, content })
      .then(setSystemPrompt)
      .catch(err => console.error('Failed to build system prompt:', err));
  }, [path, content]);

  // Callbacks for tools
  const getCurrentContent = useCallback(() => contentRef.current, []);
  const getCurrentFileType = useCallback(() => getFileType(pathRef.current), []);

  // Create tools with callbacks
  const tools = useMemo(
    () => createEditorTools({
      onApplyEdit,
      getCurrentContent,
      getFileType: getCurrentFileType,
    }),
    [onApplyEdit, getCurrentContent, getCurrentFileType]
  );

  const initialMessage = path
    ? `Editing: ${path}. Ask me to help with this content.`
    : 'Select a file to edit, then ask me for help.';

  const { messages, sendMessage } = useChat({
    tools,
    systemPrompt,
    initialMessage,
  });

  const footer = <InputFooter onSendMessage={sendMessage} />;

  return (
    <ChatComponent
      id="editor_llm_chat"
      messages={messages}
      footer={footer}
      height="flex-1"
    />
  );
}
