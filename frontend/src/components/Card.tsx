import React from 'react';
import './Card.css';
import { CardProps } from '../types';

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div className={`card ${className || ''}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
