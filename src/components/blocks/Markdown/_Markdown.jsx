import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function _Markdown( props ) {
  const { kids } = props;
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{kids}</ReactMarkdown>;
}
