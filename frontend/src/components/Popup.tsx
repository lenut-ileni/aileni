import React, { useEffect } from 'react';
import './Popup.css';
import { PopupProps } from '../types';

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    // Automatically close the popup after 3 seconds
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [onClose]);

  return (
    <div className='popup-overlay'>
      <div className='popup-content'>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Popup;
