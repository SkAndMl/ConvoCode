import React, { useState } from 'react';
import './Login.css'; 
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    try {
      const encodedData = { email, password };
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encodedData),
      });
      const data = await response.json();
      console.log('Success:', data);
      var uid = data["user_id"];
      console.log(uid);
      sessionStorage.setItem('myUserID', JSON.stringify(uid));
      navigate('/decision', { state: { uid } });
      
    } catch (error) {
      console.error('Error:', error.message);
     
    }
  };

  return (
    <div className='App'>
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-header">Login</h2>
      <div className="form-group">
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="form-input"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="form-input"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type="submit" className="submit-button">
        Login
      </button>
    </form>
    </div>
  );
}

export default Login;
