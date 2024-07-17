// src/AuthForm.js
import React, { useState } from 'react';
import '../style/auth.css';
import SignUpForm from './signup';
import LoginForm from './login';

const AuthForm = () => {
  const [authMode, setAuthMode] = useState('login');

  return (
    <div className="auth-form-container">
      <div className="auth-mode-switch">
        {authMode !== 'signUp' && (
          <button onClick={() => setAuthMode('signUp')}>Sign Up</button>
        )}
        {authMode !== 'login' && (
          <button onClick={() => setAuthMode('login')}>Login</button>
        )}
      </div>

      {authMode === 'signUp' ? <SignUpForm /> : <LoginForm />}
    </div>
  );
};

export default AuthForm;
