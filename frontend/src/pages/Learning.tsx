import React, { useState, useEffect } from 'react';
import SubjectForm from '../components/SubjectForm';
import LanguageSelector from '../components/LanguageSelector';
import LoadingText from '../components/LoadingText';
import Quiz from '../components/Quiz';
import { ClipLoader } from 'react-spinners';
import parse from 'html-react-parser';
import ErrorMessage from '../components/ErrorMessage';
import { QuizInterface, Question, User } from '../types';
import Level from '../components/Level';

const Learning: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'ro'>('en');
  const [lessonResult, setLessonResult] = useState<React.ReactNode | null>(
    null,
  );
  const [quizzes, setQuizzes] = useState<QuizInterface[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isQuizLocked, setIsQuizLocked] = useState<boolean>(false);
  const userId = localStorage.getItem('userId') ?? '';
  const [error, setError] = useState<string | null>(null);
  const [showLoginButton, setShowLoginButton] = useState<boolean | undefined>(
    undefined,
  );
  const [user, setUser] = useState<User | null>(null);
  const API =
    process.env.REACT_APP_ENV === 'dev'
      ? process.env.REACT_APP_BACKEND_LOCAL_API
      : process.env.REACT_APP_BACKEND_API;

  // Check login status and handle redirection
  useEffect(() => {
    fetchUserData();
  }, [userId]);

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
    }
  };

  // Handle subject form submission
  const handleSubjectSubmit = async (subject: string) => {
    setSubject(subject);
    setLoading(true);
    setLessonResult(null);
    setQuizzes([]);

    if (!userId) {
      console.error('User ID not found');
      return;
    }

    // API call to generate lesson and quiz
    const response = await fetch(`${API}/api/generate-lesson-and-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subject, language }),
    });
    const data = await response.json();

    try {
      // Fetch lesson and quizzes based on data from API
      const lessonResponse = await fetchLesson(data.lessonId);
      setLessonResult(parse(lessonResponse.content));

      const quizResponse = await fetchQuiz(data.lessonId);
      const quizData = quizResponse.quizzes;
      setQuizzes(quizData);
      setIsQuizLocked(quizData[0].locked);

      if (quizData.length > 0) {
        const quizQuestionsData = await fetchQuizQuestions(quizData[0].quizId);
        setQuizQuestions(quizQuestionsData.questions);
      } else {
        setQuizQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLessonResult('An error occurred while fetching the lesson.');
    }

    setLoading(false);
  };

  // Helper functions for fetching lesson, quiz, and quiz questions
  const fetchLesson = async (lessonId: string) => {
    const response = await fetch(`${API}/api/lesson/${lessonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch lesson');
    }
    return response.json();
  };

  const fetchQuiz = async (lessonId: string) => {
    const response = await fetch(`${API}/api/${lessonId}/quizzes`);
    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }
    return response.json();
  };

  const fetchQuizQuestions = async (quizId: string) => {
    const response = await fetch(`${API}/api/${quizId}/questions`);
    if (!response.ok) {
      throw new Error('Failed to fetch quiz questions');
    }
    return response.json();
  };

  // Lock quiz when it's completed
  const onLock = () => {
    setIsQuizLocked(true);
    fetchUserData();
  };

  return error === null && userId && user ? (
    <div>
      <Level
        currentLevel={user.level.name}
        currentPoints={user.totalPoints}
        minPoints={user.level.minPoints}
        maxPoints={user.level.maxPoints}
        levelNumber={user.level.levelNumber}
      />
      <div className='container'>
        <h1>Learn with AI</h1>

        <LanguageSelector language={language} onChange={setLanguage} />

        <SubjectForm onSubmit={handleSubjectSubmit} />

        {loading && (
          <div className='loading-container'>
            <ClipLoader size={50} color='#36D7B7' loading={loading} />
            <LoadingText
              messages={[
                "Hang tight! We're preparing your lesson...",
                'Fetching the latest info...',
                'Hold on, learning material is on the way...',
                'Just a moment... crafting your lesson content...',
              ]}
              interval={3000}
            />
          </div>
        )}

        {lessonResult && (
          <div className='card'>
            <h2>Information about: {subject}</h2>
            {lessonResult}
          </div>
        )}

        {quizzes.length > 0 &&
          userId &&
          quizzes.map((quiz) => (
            <Quiz
              key={quiz.quizId}
              id={quiz.quizId}
              userId={userId}
              subject={subject}
              questions={quizQuestions}
              locked={isQuizLocked}
              onLock={onLock}
              passingScore={quiz.passingScore}
            />
          ))}
      </div>
    </div>
  ) : (
    <ErrorMessage message={error as string} showLogin={showLoginButton} />
  );
};

export default Learning;
