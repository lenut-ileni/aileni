import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import './Level.css';
import { LevelProps } from '../types';

const Level: React.FC<LevelProps> = ({
  currentLevel,
  currentPoints,
  minPoints,
  maxPoints,
  levelNumber,
}) => {
  // State to track scroll position
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Scroll event listener to track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // Set state when scrolled down
      } else {
        setIsScrolled(false); // Set state when at the top
      }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate the progress as the percentage of the level's range
  const progress = Math.max(currentPoints - minPoints, 0); // Ensure it doesn't go below 0
  const levelProgress = maxPoints - minPoints;

  // Calculate progress percentage based on the range of minPoints to maxPoints
  const progressPercentage = (progress / levelProgress) * 100; // Correct percentage

  return (
    <div className={`level-container ${isScrolled ? 'scrolled' : ''}`}>
      <h2>
        Level {levelNumber}: {currentLevel}
      </h2>
      <div className='level-info'>
        <p>
          Points: {currentPoints} / {maxPoints}
        </p>
        {/* Pass dynamic maxProgress based on the level's range */}
        <ProgressBar
          currentProgress={progressPercentage}
          maxProgress={levelProgress}
        />
      </div>
    </div>
  );
};

export default Level;
