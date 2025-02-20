import React from 'react';
import './ProgressBar.css';
import { ProgressBarProps } from '../types';

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentProgress,
  maxProgress,
}) => {
  const progressPercentage = Math.min(currentProgress, maxProgress); // Ensure it doesn't exceed maxProgress

  return (
    <div className='progress-container'>
      <div
        className='progress-bar'
        style={{ width: `${progressPercentage}%` }} // Apply width based on progress percentage
      ></div>
    </div>
  );
};

export default ProgressBar;
