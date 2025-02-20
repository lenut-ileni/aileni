import { ReactNode } from 'react';

export interface ButtonProps {
  className?: string;
  label?: string;
  icon?: ReactNode;
  disabled: boolean;
  colorVariant?: 'green' | 'red' | 'yellow' | 'neutral';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface DateScrollerProps {
  onSelectDate: (date: string) => void;
}

export interface ErrorMessageProps {
  message: string;
  showLogin?: boolean;
}

export interface LanguageSelectorProps {
  language: 'en' | 'ro';
  onChange: (language: 'en' | 'ro') => void;
}

export interface LevelProps {
  currentLevel: string;
  currentPoints: number;
  minPoints: number;
  maxPoints: number;
  levelNumber: number;
}

export interface LoadingTextProps {
  messages: string[];
  interval: number;
}

export interface PopupProps {
  message: string;
  onClose: () => void;
}

export interface ProgressBarProps {
  currentProgress: number;
  maxProgress: number;
}

export interface Question {
  _id: string;
  quiz: string;
  questionText: string;
  answerChoices: string[];
  correctAnswers: string[]; // Stored as ['A', 'B', etc.]
  points: number;
}

export interface QuizProps {
  id: string;
  userId: string;
  subject: string;
  questions: Question[];
  locked: boolean;
  passingScore: number;
  onLock: () => void;
}

export interface SubjectFormProps {
  onSubmit: (subject: string) => void;
}

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  description: string;
  dueDate: string;
}

export interface TaskCardProps {
  task: Task;
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export interface TaskFormProps {
  onTaskCreated: () => void;
}

export interface TaskListProps {
  selectedDate: string;
  status: boolean;
  refreshTasks: boolean;
  onTaskUpdated: () => void;
}

export interface QuizInterface {
  quizId: string;
  lesson: Lesson;
  totalQuestions: number;
  passingScore: number;
  completed: boolean;
  pointsEarned: number;
  questions: Question[];
  user: string;
  locked: boolean;
}

export interface Lesson {
  _id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
  user: string;
  quizzes: string[];
}

export interface Badge {
  _id: string;
  name: string;
  description: string;
}

export interface Achievement {
  _id: string;
  title: string;
  description: string;
}

export interface Quiz {
  _id: string;
  lesson: Lesson;
  pointsEarned: number;
  locked: boolean;
}

export interface Level {
  name: string;
  description: string;
  minPoints: number;
  maxPoints: number;
  badge: Badge;
  levelNumber: number;
}

export interface User {
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
