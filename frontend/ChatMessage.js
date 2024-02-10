import { Message } from '@chatscope/chat-ui-kit-react';
import React, { useState } from 'react';

const ChatMessage = ({ text, isUser }) => {
  return (
    <div>
        {console.log("working")}
      <Message model={
        {
            message : 'hello i am bot',
        }
      }>

      </Message>
    </div>
  );
};
export default ChatMessage;