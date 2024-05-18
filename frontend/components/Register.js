import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    try {
      const encodedData = { email, password, username };
      const response = await fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encodedData),
      });
      const data = await response.json();
      console.log('Success:', data);
      navigate('/libraries');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className='App'>
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-header">Register</h2>
      <div className="form-group">
        <label className="form-label" htmlFor="fullName">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          className="form-input"
          placeholder="Full name"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
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
          placeholder="New Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
      </div>
    );
  }
  
  export default Register;
  