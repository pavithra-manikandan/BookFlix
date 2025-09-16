import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material'; // Material-UI components
import '../../style/LoginPage.css'; // CSS for this component
const config = require('../../config.json'); // Config file for server details

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (process.env.NODE_ENV === "development") {
      localStorage.setItem("token", "fake-dev-token");
      navigate("/home");
      return;
    }
    setError(''); // Clear any previous error messages

    try {
      
      const response = await fetch(`http://${config.server_host}:${config.server_port}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email, // Email as username
          password: password, // Password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
        return;
      }

      const data = await response.json();

      // Store JWT token in localStorage
      localStorage.setItem('token', data.token); // Make sure the backend sends a 'token'

      // Navigate to a protected route (e.g., HomePage)
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      {/* BookFlix Logo */}
      <Box sx={{ textAlign: 'center', marginBottom: '40px' }}>
        <Typography
          sx={{
            fontSize: '48px',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            color: '#3cb371', // Light Green
          }}
        >
          Book
        </Typography>
        <Typography
          sx={{
            fontSize: '48px',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            color: '#f44336', // Red
          }}
        >
          Flix
        </Typography>
      </Box>

      {/* Login Form */}
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Login Button */}
          <div className="button-group">
            <button type="submit" className="login-button">Login</button>
          </div>
        </form>

        {/* Sign Up Redirect */}
        <div className="signup-link">
          <button onClick={() => navigate('/signup')} className="signup-button">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
