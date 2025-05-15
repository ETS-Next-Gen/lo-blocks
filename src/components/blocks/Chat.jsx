import React from 'react';
import { dev } from '../blocks';
import { peggyParser } from '@/lib/olx/parsers';
import * as dp  from './_discussionParser.js'; // <-- Tweak this line
import { _Chat } from './_Chat';

const Chat = dev({
  name: 'Chat',
  component: _Chat,
  parser: peggyParser(dp),
  namespace: 'org.mitros.dev',
  description: 'Example block that parses an SBA dialogue format using PEG.'
});

export default Chat;
