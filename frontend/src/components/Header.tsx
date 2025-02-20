import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import Button from './Button';
import { AiFillHome } from 'react-icons/ai';
import { FaUser, FaChalkboardTeacher, FaBook } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status
  const [isScrolled, setIsScrolled] = useState<boolean>(false); // Track scroll position
  const navigate = useNavigate();

  // On initial load, check if the user is logged in by checking localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }

    // Scroll event listener to detect scroll position
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // Add transparency after scroll
      } else {
        setIsScrolled(false); // Remove transparency when at the top
      }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    // Clear the token and update the login state
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsLoggedIn(false); // Update state immediately to show logout button
    navigate('/login'); // Redirect to login page after logout
    window.location.reload();
  };

  const handleLogin = () => {
    navigate('/login'); // Navigate to login page
    window.location.reload();
  };

  const handleRegister = () => {
    navigate('/register'); // Navigate to register page
    window.location.reload();
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav>
        <ul className='nav'>
          <li className='nav-item'>
            <Button
              disabled={false}
              colorVariant='yellow'
              onClick={() => navigate('/')}
              icon={<AiFillHome size={20} />}
            />
            <Button
              disabled={false}
              label='Profile'
              colorVariant='green'
              onClick={() => navigate('/user')}
              icon={<FaUser size={20} />}
            />
            <Button
              disabled={false}
              label='Learning'
              colorVariant='green'
              onClick={() => navigate('/learning')}
              icon={<FaChalkboardTeacher size={20} />}
            />
            <Button
              disabled={false}
              label='Lessons'
              colorVariant='green'
              onClick={() => navigate('/lessons')}
              icon={<FaBook size={20} />}
            />
          </li>
          <li className='nav-item'>
            {isLoggedIn ? (
              <Button
                disabled={false}
                label='Logout'
                colorVariant='green'
                onClick={handleLogout}
              />
            ) : (
              <>
                <Button
                  disabled={false}
                  label='Login'
                  colorVariant='green'
                  onClick={handleLogin}
                />
                <Button
                  disabled={false}
                  label='Register'
                  colorVariant='green'
                  onClick={handleRegister}
                />
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
