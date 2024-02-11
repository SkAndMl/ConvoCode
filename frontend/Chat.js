import React, { useState } from 'react';
import { MainContainer,ChatContainer, Sidebar, ConversationList, Conversation, MessageInput, ConversationHeader, Message, MessageList } from "@chatscope/chat-ui-kit-react";
import {useChat} from  "@chatscope/use-chat";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './chat.css'
const Chat=()=>{
        const [textMessages, setTextMessages] = useState([
        {
            message: 'hello i am your friendly chatbot',
            direction: 'incoming'
        }
    ]);
    const botResponse=()=>{
            setTextMessages(prevMessages => [
                ...prevMessages,
                {
                    message:  "bot response",
                    direction: 'incoming'
                }
            ]);
    }
    const handleSendMessage = () => {
            // Add the new message to the array
            const element = document.getElementById('iamid');
            setTextMessages(prevMessages => [
                ...prevMessages,
                {
                    message: element.innerText,
                    direction: 'outgoing'
                }
            ]);
            botResponse();
    }

    return(
        <div className="chatPage-div">
            <MainContainer>
                <Sidebar position="left">
                    <ConversationList>
                        <Conversation name='Gopi'>

                        </Conversation>
                    </ConversationList>
                </Sidebar>
                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Content userName='Gopi'>

                        </ConversationHeader.Content>
                    </ConversationHeader>
                    <MessageList>
                    {textMessages.map((msg, index) => (
                            <Message
                                key={index}
                                model={{
                                    message: msg.message,
                                    direction: msg.direction
                                }}
                            />
                        ))}
                    </MessageList>
                    <MessageInput
                    id='iamid'
  placeholder='Type here'
  onSend={handleSendMessage}
  className="input-field"
/>
                </ChatContainer>
            </MainContainer>
        </div>
    )
}
export default Chat;