import React, { useState } from 'react';
import {useLocation} from 'react-router-dom';
import { MainContainer,ChatContainer, Sidebar, ConversationList, Conversation, MessageInput, ConversationHeader, Message, MessageList, Button } from "@chatscope/chat-ui-kit-react";
import {useChat} from  "@chatscope/use-chat";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './chat.css'
var element,jsonData;
const Chat=()=>{
        const location = useLocation();
        const greetings = "hello i am your friendly chatbot,ask me anything about " + location.state.libName;
        const [isVisible, setIsVisible] = useState(true);
        const [containerWidth, setContainerWidth] = useState('40%');
        const[buttonPos,setButtonPos]=useState('275px')
        const [textMessages, setTextMessages] = useState([
        {
            message: greetings,
            direction: 'incoming'
        }
    ]);
    const botResponse=async()=>{
        const uquery = element.innerText;
        const encodedQuery = { uquery };
        console.log(encodedQuery)
        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(encodedQuery)
              });
            //const response =await fetch("http://127.0.0.1:8000/main_test");
            const data = await response.json();
            setTextMessages(prevMessages => [
                ...prevMessages,
                {
                    message:  data,
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
            // Add the new message to the array
            element = document.getElementById('iamid');
            setTextMessages(prevMessages => [
                ...prevMessages,
                {
                    message: element.innerText,
                    direction: 'outgoing'
                }
            ]);
                console.log(test);
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
            {isVisible && (<textarea style={{ width: '59.5%', height: '98.5vh',fontSize: '20px',position: 'absolute', left: '0'}}></textarea>)}
            <MainContainer  style={{ width: containerWidth, right: '0',height:'90vh'}}>
                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Content userName='Chat interface'>

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