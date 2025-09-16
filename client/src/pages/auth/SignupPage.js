import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import '../../style/SingupPage.css'; 
const config = require('../../config.json'); // Make sure this is imported correctly

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent the form from submitting and refreshing the page
        setError(''); // Clear any previous error message
    
        // Ensure passwords match before making the API call
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
    
        try {
            const response = await fetch(`http://${config.server_host}:${config.server_port}/signup`, {
                method: 'POST', // Use POST method
                headers: {
                    'Content-Type': 'application/json', // Indicate that you're sending JSON
                },
                body: JSON.stringify({
                    username: email, // Email as username
                    pw: password,    // Password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Signup failed');
            }

            const resJson = await response.json();

            // Redirect to the login page after successful signup
            navigate('/');
        } catch (err) {
            setError(err.message || 'Signup failed');
            console.error('Error during signup:', err);
        }
    };
    
    return (
        <Box className="signup-page">
            <Typography variant="h4" className="form-header">
                Sign Up
            </Typography>
            <form className="signup-form" onSubmit={handleSignUp}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {error && <Typography color="error" className="error-message">{error}</Typography>}
                    <Button
                        type="submit"
                        variant="contained"
                        className="signup-button"
                    >
                        Sign Up
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default SignUpPage;