// src/LoginForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/login.css';

const apiUrl = process.env.REACT_APP_BACKEND_BASE_URL
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    username: '',
    password: ''
  });
  const [notification, setNotification] = useState('')
  const [loginMethod, setLoginMethod] = useState('otp');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}generate-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await response.json();
      if (response.ok) {
        setIsEmailSent(true)
        setNotification("OTP email sent successfully")
      } else {
        setError(data.message || 'Something went wrong, please try again.');
      }
    } catch (err) {
      setError('Network error, please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(()=>{
        setNotification("")
      },5000)
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email, otp: formData.otp })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/profile');
      } else {
        setError(data.message || 'Invalid OTP, please try again.');
      }
    } catch (err) {
      setError('Network error, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/profile');
      } else {
        setError(data.message || 'Invalid username or password, please try again.');
      }
    } catch (err) {
      setError('Network error, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <h1 className="cardheader">Login</h1>
      {notification && <p className="notif">{notification}</p>}
      <div className="login-method-switch">
        <button onClick={() => setLoginMethod('otp')} disabled={loginMethod === 'otp'}>
          Login with OTP
        </button>
        <button onClick={() => setLoginMethod('password')} disabled={loginMethod === 'password'}>
          Login with Username
        </button>
      </div>

      {loginMethod === 'otp' && (
        <>
          {!isEmailSent ? (
            <form onSubmit={handleEmailSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="otp">OTP:</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}
        </>
      )}

      {loginMethod === 'password' && (
        <form onSubmit={handlePasswordLoginSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}

      <div className="signup-link">
        <Link to="/signup">Don't have an account? Sign Up</Link>
      </div>
    </div>
  );
};

export default LoginForm;
