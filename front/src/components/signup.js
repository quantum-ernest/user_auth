// src/SignUpForm.js
import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import '../style/signup.css';

const apiUrl = process.env.REACT_APP_BACKEND_BASE_URL


const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState('')
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate = useNavigate();
  let data;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      // Handle form submission logic here
      try {
        const response = await fetch(`${apiUrl}users/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({username: formData.username, password:formData.confirmPassword, email: formData.email})
        });
        data = await response.json();
        if (response.ok) {
          setNotification("Account created successfully")
          setTimeout(()=>{
            navigate("/")
          },2500)
        } else {
          let error='';
          for(let item in data){error += data[item]; break; }
          setError(data.message || error || 'Account Already Exists');
        }
      } catch (err) {
        let error='';
        for(let item in data){error += data[item]; break;}
        setError(error || 'Network error, please try again.');
      }
    finally {
      setTimeout(()=>{
        setNotification("")
      },1500)
    }
    }
  };

  return (
    <div className="signup-form-container">
      <h1 className="ca">Register</h1>
      {notification && <p className="notif">{notification}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Sign Up</button>
      </form>
      <div className="login-link">
        <Link to="/">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default SignUpForm;
