import React, { useState } from 'react';
import {useLocation} from 'react-router-dom';
import { MainContainer,ChatContainer, Sidebar, ConversationList, Conversation, MessageInput, ConversationHeader, Message, MessageList, Button } from "@chatscope/chat-ui-kit-react";
var element,jsonData;
const ChatBot=()=>{
        const location = useLocation();
        const greetings = "hello i am your friendly chatbot,ask me anything about " + location.state.libName;
        const [isVisible, setIsVisible] = useState(true);
        const [containerWidth, setContainerWidth] = useState('100%');
        const[buttonPos,setButtonPos]=useState('275px')
        const [textMessages, setTextMessages] = useState([
        {
            message: greetings,
            direction: 'incoming'
        }
    ]);
    const botResponse=async()=>{
        const query = element.innerText;
        const user_id = location.state.uid;
        const library_name = location.state.libName;
        const encodedQuery = { query , user_id, library_name };
        if(query=="👍" || query=="👎")
          {
            if(query=="👍")
            {
              console.log(query);
            }
            else{
              console.log(query);
            }
          }
        console.log(encodedQuery)
        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(encodedQuery)
              });
            const data = await response.json();
            console.log(data)
            setTextMessages(prevMessages => [
                ...prevMessages,
                {
                    message:  data["answer"],
                    direction: 'incoming'
                }
            ]);
          } catch (error) {
            setTextMessages(prevMessages => [
                ...prevMessages,
                {
                    message:  error.message,
                    direction: 'incoming'
                }
            ]);
            console.error('Error: not working', error.message);
          }
            
      }
    const fetchData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/number');
          jsonData = await response.json();
          console.log(jsonData)
        } catch (error) {
            jsonData = "thalapathy"
          console.error('Error fetching data:', error);console.log(jsonData)
        }
      };
    const handleSendMessage = () => {
            element = document.getElementById('iamid');
            setTextMessages(prevMessages => [
                ...prevMessages,
                {
                    message: element.innerText,
                    direction: 'outgoing'
                }
            ]);
                botResponse()
    }
    const handleDisableCodeEditor=()=>{
        setContainerWidth('100%');
        setButtonPos('1075px');
        setIsVisible(false);
    }
    const handleEnableCodeEditor=()=>{
        setContainerWidth('40%');
        setButtonPos('275px');
        setIsVisible(true);
    }
    return(
        <div className="chatPage-div">
            <MainContainer  style={{ width: containerWidth,position: 'absolute', right: '0',height:'90vh',background: '#f5f5f5', borderRadius: '4px' }}>
                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Content userName='Chat interface'>

                        </ConversationHeader.Content>
                    </ConversationHeader>
                    <MessageList style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
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
export default ChatBot;