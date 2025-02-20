import React, { useState, useEffect } from 'react';
import './Quiz.css';
import Popup from './Popup';
import { QuizProps } from '../types';
import Button from './Button';

const Quiz: React.FC<QuizProps> = ({
  id,
  userId,
  subject,
  questions,
  locked,
  passingScore,
  onLock,
}) => {
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const API =
    process.env.REACT_APP_ENV === 'dev'
      ? process.env.REACT_APP_BACKEND_LOCAL_API
      : process.env.REACT_APP_BACKEND_API;

  const handleAnswerChange = (index: number, choiceIndex: number) => {
    if (locked) return; // Prevent selection if quiz is locked

    const answerLabel = String.fromCharCode(65 + choiceIndex);
    setAnswers((prev) => {
      const newAnswers = prev[index]?.includes(answerLabel)
        ? prev[index].filter((a) => a !== answerLabel)
        : [...(prev[index] || []), answerLabel];

      return { ...prev, [index]: newAnswers };
    });
  };

  // Calculate Score
  const calculateScore = () => {
    let correctCount = 0;

    questions.forEach((question, index) => {
      const correctAnswers = question.correctAnswers.sort();
      const userAnswers = (answers[index] || []).sort();

      if (JSON.stringify(correctAnswers) === JSON.stringify(userAnswers))
        correctCount++;
    });

    const newScore = (correctCount / questions.length) * 100;
    setScore(newScore);
  };

  // Update user total points when score is updated
  const updateUserTotalPointsAndPointEarned = async () => {
    if (score === null) return;

    try {
      // Calculate the total points the user earned based on their score
      const points = Math.round((score / 100) * passingScore);

      await fetch(`${API}/api/user/${userId}/points`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      });

      await fetch(`${API}/api/quiz/${id}/points`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      });
    } catch (error) {
      console.error('Error calculating total points:', error);
    }
  };

  // Lock Quiz API Call
  const lockQuizByQuizId = async () => {
    try {
      await fetch(`${API}/api/quiz/${id}/lock`, {
        method: 'GET',
      });
      onLock(); // Update locked state in parent component
    } catch (error) {
      console.error('Failed to lock the quiz', error);
    }
  };

  // Handle Quiz Submission
  const handleQuizSubmit = async () => {
    if (locked) return; // Prevent submission if quiz is already locked

    const isAllAnswered = questions.every(
      (_, index) => (answers[index] || []).length > 0,
    );
    if (!isAllAnswered) {
      setShowWarning(true);
      return;
    }

    setQuizSubmitted(true);
    calculateScore(); // Calculate the score

    // Lock quiz after submission
    await lockQuizByQuizId();
  };

  // Use effect to call updateUserTotalPointsAndPointEarned after score is updated
  useEffect(() => {
    if (score !== null) {
      updateUserTotalPointsAndPointEarned();
    }
  }, [score]); // Dependency array ensures this runs whenever score changes

  return (
    <div className='quiz-container'>
      <h3>Quiz for: {subject}</h3>

      {locked && <p className='locked-message'>⚠️ This quiz is locked.</p>}

      {questions.map((question, index) => (
        <div key={index} className='quiz-question'>
          <p>
            <strong>Question {index + 1}: </strong> {question.questionText}
          </p>
          {question.answerChoices.map((choice, choiceIndex) => {
            const choiceLabel = String.fromCharCode(65 + choiceIndex); // 'A', 'B', 'C', ...
            return (
              <label key={choiceIndex} className='quiz-option'>
                <input
                  type='checkbox'
                  name={`question-${index}`}
                  value={choice}
                  checked={answers[index]?.includes(choiceLabel) || false}
                  onChange={() => handleAnswerChange(index, choiceIndex)}
                  disabled={locked} // Prevent selection if locked
                />
                <span>{choice}</span>
              </label>
            );
          })}
        </div>
      ))}

      {/* Hide the Submit button if the quiz is locked */}
      {!locked && (
        <Button
          disabled={false}
          label='Submit Answers'
          colorVariant='green'
          onClick={() => handleQuizSubmit()}
        />
      )}

      {showWarning && (
        <Popup
          message='⚠️ Please answer all questions before submitting!'
          onClose={() => setShowWarning(false)}
        />
      )}

      {quizSubmitted && (
        <div className='quiz-feedback'>
          <h3>Quiz Feedback</h3>
          <ul>
            {questions.map((question, index) => (
              <li key={index} className='quiz-feedback-item'>
                <strong>{question.questionText}</strong>
                <br />
                Your answer: {answers[index]?.join(', ') || 'No answer'}
                <br />
                Correct answer: {question.correctAnswers.join(', ')}
                <br />
                {JSON.stringify(answers[index]?.sort()) ===
                JSON.stringify(question.correctAnswers.sort()) ? (
                  <span className='correct'>✔️ Correct!</span>
                ) : (
                  <span className='incorrect'>❌ Incorrect</span>
                )}
              </li>
            ))}
          </ul>
          {score !== null && (
            <p className='quiz-score'>Score: {score.toFixed(2)}%</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
