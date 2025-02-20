import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaStar } from 'react-icons/fa';
import Level from './Level';
import './UserProfile.css';

interface UserProfileProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    totalPoints: number;
    level: {
      name: string;
      minPoints: number;
      maxPoints: number;
      levelNumber: number;
    };
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [emailVisible, setEmailVisible] = useState(false);

  // Toggle the visibility of the email
  const handleEmailClick = () => {
    setEmailVisible((prevState) => !prevState);
  };

  return (
    <div className='user-profile'>
      <div className='user-header'>
        <FaUser className='icon' />
        <h1>
          {user.firstName} {user.lastName}
        </h1>
      </div>
      <p>
        <FaEnvelope className='icon' />{' '}
        {/* Only show email if emailVisible is true */}
        <span
          onClick={handleEmailClick}
          style={{ cursor: 'pointer', color: '#4CAF50' }}
        >
          {emailVisible ? user.email : '********'}
        </span>
      </p>
      <p>
        <FaStar className='icon gold' /> {user.totalPoints} Points
      </p>
      <Level
        currentLevel={user.level.name}
        currentPoints={user.totalPoints}
        minPoints={user.level.minPoints}
        maxPoints={user.level.maxPoints}
        levelNumber={user.level.levelNumber}
      />
    </div>
  );
};

export default UserProfile;
