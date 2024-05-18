import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Decision.css'
function Decision() {
  const location = useLocation();
  const uid = location.state.uid;
  console.log(uid);
  const navigate = useNavigate();

  const handleLibraryClick1 = () => {
    navigate('/libraries', { state: { uid } });
  };
  const handleLibraryClick2 = () => {
    navigate('/codeEditor', { state: {uid} });
  };

  return (
    <div className="button-container">
      <div className='welcome'>
        <h1>select the desired feature you want to interact</h1>  
      </div>    
      <div className="button-group">
        <button onClick={handleLibraryClick1} className="library-button">
          ChatBot
        </button>
        <button onClick={handleLibraryClick2} className="library-button">
          CodeEditor
        </button>
      </div>
    </div>
  );
}

export default Decision;
