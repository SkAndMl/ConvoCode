import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Decision.css'
function Decision() {
  const navigate = useNavigate();

  const handleLibraryClick1 = () => {
    navigate('/login');
  };
  const handleLibraryClick2 = () => {
    navigate('/register');
  };

  return (
    <div className="button-container">
      <div className='welcome'>
        <h1>Welcome to Codex</h1>  
      </div>  
      <div className="button-group">
        <button onClick={handleLibraryClick1} className="library-button">
          Login
        </button>
        <button onClick={handleLibraryClick2} className="library-button">
          Register
        </button>
      </div>
    </div>
  );
}

export default Decision;
