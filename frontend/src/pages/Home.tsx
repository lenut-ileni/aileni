import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/learning'); // Redirect to learning page if logged in
    } else {
      navigate('/login'); // Redirect to login page if not logged in
    }
  };

  return (
    <div className='container'>
      <h1>Welcome to AiLeni</h1>

      {isLoggedIn ? (
        <div className='card'>
          <h3>Welcome Back!</h3>
          <p>
            The all-in-one learning platform designed to make education
            engaging, accessible, and personalized. Whether you're learning a
            new skill, advancing in your career, or exploring a passion, we’ve
            got you covered.
          </p>
          <Button
            disabled={false}
            label='Go to Learning Page'
            colorVariant='green'
            onClick={() => handleGetStarted()}
          />
        </div>
      ) : (
        <>
          <div className='card'>
            <h3>Manage Your Tasks Efficiently</h3>
            <p>
              Stay on top of your tasks and deadlines. Our smart task management
              system helps you prioritize and organize your day effortlessly.
            </p>
          </div>

          <div className='card'>
            <h3>AI-Powered Recommendations</h3>
            <p>
              Let the app suggest smart prioritization based on your habits. Our
              AI analyzes your behavior and helps you get more done.
            </p>
          </div>

          <div className='card'>
            <h3>Easy Task Tracking</h3>
            <p>
              Track your task progress with intuitive dashboards and task
              completion analytics.
            </p>
          </div>

          <div className='card'>
            <h3>Get Started Now!</h3>
            <p>
              Sign up or log in to start organizing your life and boost
              productivity.
            </p>
            <Button
              disabled={false}
              label='Get Started'
              colorVariant='green'
              onClick={() => handleGetStarted()}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
