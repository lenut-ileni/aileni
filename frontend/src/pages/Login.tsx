import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../theme.css';
import Popup from '../components/Popup';
import Button from '../components/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');
  const navigate = useNavigate();
  const API =
    process.env.REACT_APP_ENV === 'dev'
      ? process.env.REACT_APP_BACKEND_LOCAL_API
      : process.env.REACT_APP_BACKEND_API;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        setPopupMessage('Login successful!');
        setIsPopupVisible(true);
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1500);
      } else {
        setError('Failed to login. Check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='container'>
      <h1 style={headerStyle}>Login</h1>

      {isPopupVisible && (
        <Popup
          message={popupMessage}
          onClose={() => setIsPopupVisible(false)}
        />
      )}

      <div className='card'>
        <form onSubmit={handleSubmit}>
          {/* Email Input Wrapper */}
          <div className='input-container'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Enter your email'
            />
          </div>

          {/* Password Input Wrapper */}
          <div className='input-container'>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Enter your password'
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button
            disabled={false}
            label='Login'
            colorVariant='green'
            type='submit'
          />
        </form>
      </div>
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  color: 'var(--primary-color)',
  textAlign: 'center',
};

export default Login;
