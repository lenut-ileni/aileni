import React, { useState, useEffect } from 'react';
import './LoadingText.css';
import { LoadingTextProps } from '../types';

const LoadingText: React.FC<LoadingTextProps> = ({ messages, interval }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, interval);

    return () => clearInterval(messageInterval);
  }, [messages, interval]);

  return (
    <div className='loading-text'>
      <p>{messages[currentMessageIndex]}</p>
    </div>
  );
};

export default LoadingText;
