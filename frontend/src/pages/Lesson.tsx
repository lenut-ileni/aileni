import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Quiz from '../components/Quiz';
import parse from 'html-react-parser';
import ErrorMessage from '../components/ErrorMessage';
import { QuizInterface, Question, User } from '../types';
import Level from '../components/Level';

const Lesson: React.FC = () => {
  const { lessonId } = useParams();
  const [lessonResult, setLessonResult] = useState<React.ReactNode | null>(
    null,
  );
  const [quizzes, setQuizzes] = useState<QuizInterface[]>([]);
  const [user, setUser] = useState<User>();
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isQuizLocked, setIsQuizLocked] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginButton, setShowLoginButton] = useState<boolean | undefined>(
    undefined,
  );
  const userId = localStorage.getItem('userId');
  const API =
    process.env.REACT_APP_ENV === 'dev'
      ? process.env.REACT_APP_BACKEND_LOCAL_API
      : process.env.REACT_APP_BACKEND_API;

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

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError('Failed to load user data');
    }
  };

  // Fetch lesson data and quizzes based on lessonId
  useEffect(() => {
    if (!lessonId) return;

    if (!userId) {
      setError(
        'You do not have permission to view this lesson. Did you log in?',
      );
      setShowLoginButton(true);
      return;
    }

    // Fetch lesson content
    const fetchLesson = async (lessonId: string) => {
      const response = await fetch(`${API}/api/lesson/${lessonId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lesson');
      }
      return response.json();
    };

    // Fetch quizzes related to the lesson
    const fetchQuiz = async (lessonId: string) => {
      const response = await fetch(`${API}/api/${lessonId}/quizzes`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }
      return response.json();
    };

    // Fetch questions for a specific quiz
    const fetchQuizQuestions = async (quizId: string) => {
      const response = await fetch(`${API}/api/${quizId}/questions`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz questions');
      }
      return response.json(); // Parse the JSON response directly
    };

    // Load lesson data, quizzes, and questions
    const loadLessonData = async () => {
      if (!lessonId) return;

      try {
        const lessonResponse = await fetchLesson(lessonId);
        setLessonResult(parse(lessonResponse.content));

        const quizResponse = await fetchQuiz(lessonId);
        const quizData = quizResponse.quizzes;
        setQuizzes(quizData);
        setIsQuizLocked(quizData[0].locked);

        if (quizData.length > 0) {
          const quizQuestionsData = await fetchQuizQuestions(
            quizData[0].quizId,
          );
          setQuizQuestions(quizQuestionsData.questions);
        } else {
          setQuizQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching lesson or quizzes:', error);
        setLessonResult('An error occurred while fetching the lesson.');
      }
    };

    loadLessonData();
    fetchUserData();
  }, [lessonId]);

  // Lock the quiz when it's completed
  const onLock = () => {
    setIsQuizLocked(true);
    fetchUserData();
  };

  return (
    <div>
      {user && (
        <Level
          currentLevel={user.level.name}
          currentPoints={user.totalPoints}
          minPoints={user.level.minPoints}
          maxPoints={user.level.maxPoints}
          levelNumber={user.level.levelNumber}
        />
      )}
      <div className='container'>
        {/* Display error message if there's an error */}
        {error && <ErrorMessage message={error} showLogin={showLoginButton} />}

        {/* Display lesson content once it's fetched */}
        {lessonResult && !error && (
          <div className='card'>
            <div>{lessonResult}</div>
          </div>
        )}

        {/* Display quizzes if available */}
        {quizzes.length > 0 &&
          !error &&
          userId &&
          quizzes.map((quiz) => (
            <Quiz
              key={quiz.quizId}
              userId={userId}
              id={quiz.quizId}
              subject={quiz.lesson.subject}
              questions={quizQuestions}
              locked={isQuizLocked}
              passingScore={quiz.passingScore}
              onLock={onLock}
            />
          ))}
      </div>
    </div>
  );
};

export default Lesson;
