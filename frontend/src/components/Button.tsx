import React from 'react';
import './Button.css';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({
  className,
  label,
  icon,
  disabled = false,
  colorVariant = 'green',
  type = 'button',
  onClick,
}) => {
  return (
    <button
      type={type}
      className={`custom-button ${colorVariant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && label ? (
        <>
          {icon} {label}
        </>
      ) : (
        icon || label
      )}
    </button>
  );
};

export default Button;
