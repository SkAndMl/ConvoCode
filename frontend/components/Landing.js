import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer,ChatContainer, MessageInput, ConversationHeader, Message, MessageList, Button } from "@chatscope/chat-ui-kit-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import {useLocation} from 'react-router-dom';
import './button.css'
var element,jsonData;

const javascriptDefault = `
`;

const Landing = () => {
  
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


  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [lanVal,setLanVal] = useState("javascript");
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");
  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
    setLanVal(sl.value);
    console.log(sl.value);
  };
  useEffect(()=>{
    if(enterPress){
      console.log("check");
    }
  })
  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      //handleCompile();
    }
  }, [ctrlPress, enterPress]);
  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
        botResponse()
}
const botResponse=async()=>{
  const query = element.innerText;
  const user_id = "6613e53f0d991e3983c4f60d"
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
const handleDisableCodeEditor=()=>{
  setContainerWidth('100%');
  setIsVisible(false);
}
const handleEnableCodeEditor=()=>{
  setContainerWidth('40%');
  setIsVisible(true);
}
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <a
        href="https://github.com/SkAndMl/final-yr-project"
        title="Fork me on GitHub"
        class="github-corner"
        target="_blank"
        rel="noreferrer"
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 250 250"
          className="relative z-20 h-20 w-20"
        >
          <title>Fork me on GitHub</title>
          <path d="M0 0h250v250"></path>
          <path
            d="M127.4 110c-14.6-9.2-9.4-19.5-9.4-19.5 3-7 1.5-11 1.5-11-1-6.2 3-2 3-2 4 4.7 2 11 2 11-2.2 10.4 5 14.8 9 16.2"
            fill="currentColor"
            style={{ transformOrigin: "130px 110px" }}
            class="octo-arm"
          ></path>
          <path
            d="M113.2 114.3s3.6 1.6 4.7.6l15-13.7c3-2.4 6-3 8.2-2.7-8-11.2-14-25 3-41 4.7-4.4 10.6-6.4 16.2-6.4.6-1.6 3.6-7.3 11.8-10.7 0 0 4.5 2.7 6.8 16.5 4.3 2.7 8.3 6 12 9.8 3.3 3.5 6.7 8 8.6 12.3 14 3 16.8 8 16.8 8-3.4 8-9.4 11-11.4 11 0 5.8-2.3 11-7.5 15.5-16.4 16-30 9-40 .2 0 3-1 7-5.2 11l-13.3 11c-1 1 .5 5.3.8 5z"
            fill="currentColor"
            class="octo-body"
          ></path>
        </svg>
      </a>

      <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <div className="px-4 py-2">
          <button onClick={handleEnableCodeEditor}>Enable Code Editor</button>
        </div>
        <div className="px-4 py-2">
          <button onClick={handleDisableCodeEditor}>disable Code Editor</button>
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          {isVisible&&(<CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />)}
        </div>
        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <div className="flex flex-col items-end">
          <MainContainer  style={{ width: containerWidth,position: 'absolute', right: '0',height:'90vh'}}>
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
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Landing;
