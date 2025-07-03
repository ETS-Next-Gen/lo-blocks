// src/components/chat/EditorLLMChat.jsx
'use client';

import { useState } from 'react';
import { ChatComponent, InputFooter } from '@/components/common/ChatComponent';

// TODO: Implement a state machine to disable the footer while waiting for a
// response. This will likely leverage Redux and src/lib/llm/client.jsx.

const tools = [{
  type: "function",
  function: {
    name: "helloInGerman",
    description: "Returns the phrase 'Hello, World!' in German.",
    parameters: { type: "object", properties: {}, required: [] }
  }
}];

const toolFunctions = {
  helloInGerman: async () => "Hallo, Welt!",
};

function useChat(props) {
  const [messages, setMessages] = useState([
    { type: 'SystemMessage', text: 'Ask the LLM a question.' }
  ]);

  const sendMessage = async (text) => {
    const userMessage = { type: 'Line', speaker: 'You', text };
    setMessages((m) => [...m, userMessage]);

    const history = [...messages, userMessage]
      .filter((msg) => msg.type === 'Line')
      .map((msg) => ({
        role: msg.speaker === 'You' ? 'user' : 'assistant',
        content: msg.text,
      }));

    try {
      const res = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: history, tools }),
      });
      const json = await res.json();
      if('content' in json.response) {
        setMessages((m) => [...m, { type: 'Line', speaker: 'LLM', text: json.response.content }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { type: 'SystemMessage', text: 'Error contacting LLM' }]);
    }
  };

  return { messages, sendMessage };
}

export default function EditorLLMChat() {
  const { messages, sendMessage } = useChat();
  const footer = <InputFooter onSendMessage={sendMessage} />;

  return (
    <ChatComponent id="editor_llm_chat" messages={messages} footer={footer} height="flex-1" />
  );
}
