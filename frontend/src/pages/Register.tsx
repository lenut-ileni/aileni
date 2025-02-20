import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../theme.css';
import Popup from '../components/Popup';
import Button from '../components/Button';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!firstName || !lastName) {
      setError('First Name and Last Name are required');
      return;
    }

    try {
      const response = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        setPopupMessage('Registration successful!');
        setIsPopupVisible(true);
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        if (errorData.message === 'User already exists') {
          setError(
            'This email is already registered. Please try logging in or use another email.',
          );
        } else {
          setError('Failed to register. Try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='container'>
      <h1 style={headerStyle}>Register</h1>

      {isPopupVisible && (
        <Popup
          message={popupMessage}
          onClose={() => setIsPopupVisible(false)}
        />
      )}
      <div className='card'>
        <form onSubmit={handleSubmit}>
          <div className='input-container'>
            <label htmlFor='firstName'>First Name:</label>
            <input
              type='text'
              id='firstName'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder='Enter your first name'
            />
          </div>

          <div className='input-container'>
            <label htmlFor='lastName'>Last Name:</label>
            <input
              type='text'
              id='lastName'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder='Enter your last name'
            />
          </div>

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

          <div className='input-container'>
            <label htmlFor='confirm-password'>Confirm Password:</label>
            <input
              type='password'
              id='confirm-password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder='Confirm your password'
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button
            disabled={false}
            label='Register'
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

export default Register;
