import React from 'react';
import './ErrorMessage.css';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { ErrorMessageProps } from '../types';

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, showLogin }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className='error-message'>
      <p>{message}</p>
      {/* Only render the Login button if showLogin is true */}
      {showLogin && (
        <Button
          disabled={false}
          label='Login'
          colorVariant='green'
          onClick={handleLogin}
        />
      )}
    </div>
  );
};

export default ErrorMessage;
