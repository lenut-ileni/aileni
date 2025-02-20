import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import './Lessons.css';
import { Lesson } from '../types';

const Lessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showLoginButton, setShowLoginButton] = useState<boolean | undefined>(
    undefined,
  );
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const API =
    process.env.REACT_APP_ENV === 'dev'
      ? process.env.REACT_APP_BACKEND_LOCAL_API
      : process.env.REACT_APP_BACKEND_API;

  useEffect(() => {
    if (!userId) {
      setError(
        'You do not have permission to view this lesson. Did you log in?',
      );
      setShowLoginButton(true);
      return; // Prevent further execution if the user is not logged in
    }

    // Fetch lessons associated with the logged-in user
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${API}/api/lessons/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch lessons');
        const data: Lesson[] = await response.json();
        setLessons(data);
      } catch (error) {
        console.error(error);
        setError('Could not load lessons. Please try again.');
      }
    };

    fetchLessons();
  }, [userId, navigate]);

  // Handle when a lesson card is clicked
  const handleLessonClick = (lesson: Lesson) => {
    // Check if the lesson belongs to the current user
    if (lesson.user === userId) {
      navigate(`/lesson/${lesson._id}`); // Navigate to the lesson details page
    } else {
      setError('You do not have permission to view this lesson.');
    }
  };

  return (
    <div className='lessons-container'>
      {/* Display error message if there's an error */}
      {error && <ErrorMessage message={error} showLogin={showLoginButton} />}

      {/* Render the lessons in a grid layout */}
      <div className='lessons-grid'>
        {lessons.map((lesson) => (
          <Card
            key={lesson._id}
            className='lesson-card'
            onClick={() => handleLessonClick(lesson)}
          >
            <h3 className='lesson-title'>{lesson.title}</h3>{' '}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Lessons;
