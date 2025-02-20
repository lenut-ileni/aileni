import React, { useState, useEffect } from 'react';
import './UserPage.css';
import ErrorMessage from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import Level from '../components/Level';
import { Badge, Achievement, Lesson, Quiz } from '../types';
import Button from '../components/Button';
import UserProfile from '../components/UserProfile';

interface Level {
  name: string;
  description: string;
  minPoints: number;
  maxPoints: number;
  badge: Badge;
  levelNumber: number;
}

interface User {
  email: string;
  firstName: string;
  lastName: string;
  totalPoints: number;
  level: Level;
  progress: number;
  badges: Badge[];
  achievements: Achievement[];
  lessons: Lesson[];
  quizzes: Quiz[];
}

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginButton, setShowLoginButton] = useState<boolean | undefined>(
    undefined,
  );
  const [showBadges, setShowBadges] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [showLessons, setShowLessons] = useState<boolean>(false);
  const [showQuizzes, setShowQuizzes] = useState<boolean>(false);
  const navigate = useNavigate();
  const API =
    process.env.REACT_APP_ENV === 'dev'
      ? process.env.REACT_APP_BACKEND_LOCAL_API
      : process.env.REACT_APP_BACKEND_API;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');

        if (!userId) {
          setError(
            'You do not have permission to view this page. Did you log in?',
          );
          setShowLoginButton(true);
          return;
        }

        const response = await fetch(`${API}/api/user/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        // Await the response.json() to get the user data
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLessonClick = (lessonId: string) => {
    // Redirect to the lesson details page
    navigate(`/lesson/${lessonId}`);
  };

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  if (error) {
    return (
      <div className='error-message'>
        <ErrorMessage message={error} showLogin={showLoginButton} />
      </div>
    );
  }

  if (!user) {
    return <div className='no-user-data'>No user data available</div>;
  }

  return (
    <div className='user-page'>
      {/* User Info */}
      <UserProfile user={user} />

      {/* Collapsible Sections */}
      <section className='user-section'>
        <h2
          className='user-section-title'
          onClick={() => setShowBadges(!showBadges)}
        >
          Badges {showBadges ? '▲' : '▼'}
        </h2>
        {showBadges && (
          <ul>
            {user?.badges.length > 0 ? (
              user.badges.map((badge) => (
                <li key={badge._id}>
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                </li>
              ))
            ) : (
              <p>No badges earned yet.</p>
            )}
          </ul>
        )}
      </section>

      <section className='user-section'>
        <h2
          className='user-section-title'
          onClick={() => setShowAchievements(!showAchievements)}
        >
          Achievements {showAchievements ? '▲' : '▼'}
        </h2>
        {showAchievements && (
          <ul>
            {user?.achievements.length > 0 ? (
              user.achievements.map((achievement) => (
                <li key={achievement._id}>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </li>
              ))
            ) : (
              <p>No achievements unlocked yet.</p>
            )}
          </ul>
        )}
      </section>

      <section className='user-section'>
        <h2
          className='user-section-title'
          onClick={() => setShowLessons(!showLessons)}
        >
          Lessons {showLessons ? '▲' : '▼'}
        </h2>
        {showLessons && (
          <ul>
            {user?.lessons.length > 0 ? (
              user.lessons.map((lesson) => (
                <li
                  key={lesson._id}
                  className='clickable'
                  onClick={() => handleLessonClick(lesson._id)}
                >
                  <h3>{lesson.title}</h3>
                  <p>{lesson.subject}</p>
                </li>
              ))
            ) : (
              <p>No lessons available.</p>
            )}
          </ul>
        )}
      </section>

      <section className='user-section'>
        <h2
          className='user-section-title'
          onClick={() => setShowQuizzes(!showQuizzes)}
        >
          Quizzes {showQuizzes ? '▲' : '▼'}
        </h2>
        {showQuizzes && (
          <ul>
            {user?.quizzes.length > 0 ? (
              user.quizzes.map((quiz) => (
                <li key={quiz._id} className={quiz.locked ? 'locked' : ''}>
                  <h3>{quiz.lesson.title}</h3>
                  <p>Points Earned: {quiz.pointsEarned}</p>
                  <div>
                    {quiz.locked ? (
                      <span className='locked-icon' title='Locked'>
                        🔒
                      </span>
                    ) : (
                      <span className='unlocked-icon' title='Unlocked'>
                        🔓
                      </span>
                    )}
                  </div>
                  <Button
                    colorVariant={quiz.locked ? 'neutral' : 'green'}
                    disabled={quiz.locked}
                    onClick={() => {
                      if (!quiz.locked) {
                        handleLessonClick(quiz.lesson._id);
                      }
                    }}
                    label={quiz.locked ? 'Locked' : 'Take Quiz'}
                  ></Button>
                </li>
              ))
            ) : (
              <p>No quizzes completed yet.</p>
            )}
          </ul>
        )}
      </section>
    </div>
  );
};

export default UserPage;
