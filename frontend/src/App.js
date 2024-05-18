import "./App.css";
import Landing from "./components/Landing";
import Libraries from "./components/Libraries"
import Decision from "./components/Decision"
import CodeEditor from "./components/CodeEditor"
import ChatBot from "./components/ChatBot"
import Login from "./components/Login"
import Register from "./components/Register"
import FirstPage from "./components/FirstPage"
import ChatBot1 from "./components/ChatBot1";
import { Route, Routes } from 'react-router-dom';

function App() {
  return ( 
  <Routes>
    <Route path='/' element={<FirstPage/>}/>
    <Route path='/libraries' element={<Libraries/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/decision' element={<Decision/>}/>
    <Route path='/codeEditor' element={<CodeEditor/>}/>
    <Route path='/chatbot' element={<ChatBot1/>}/>
    <Route path='/chat' element={<Landing/>}/>
  </Routes>);
}

export default App;
