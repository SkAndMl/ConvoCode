import  {useState,useEffect } from "react";
import {useLocation} from 'react-router-dom';
import Message from "./Message";
import Input from "./Input";

import useKeyPress from "../hooks/useKeyPress";

import "./styles.css"
import "./ChatBot1.css"

const ChatBot1=()=>{

  const enterPress = useKeyPress("Enter");
  const location = useLocation();
  const handleSubmit = async () => {
    const prompt = {
      role: "user",
      content: input,
    };

    setMessages([...messages, prompt]);
    const query = input;
    const user_id = location.state.uid;
    const library_name = location.state.libName;
    const encodedQuery = { query , user_id, library_name };
    console.log(encodedQuery);
    await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(encodedQuery)
              })
      .then((data) => data.json())
      .then((data) => {
        const res = data["answer"];
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: res,
          },
        ]);
        setInput("");
      });
     
  };

  const clear = () => {
    setMessages([]);
  };


  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  return (
    <div className="ChatBot">
      <div className="Column">
        <h3 className="Title">Chat Messages</h3>
        <div className="Content">
          {messages.map((el, i) => {
            return <Message key={i} role={el.role} content={el.content} />;
          })}
        </div>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={input ? handleSubmit : undefined}
        />
      </div>
    </div>
  );
}
export default ChatBot1;
