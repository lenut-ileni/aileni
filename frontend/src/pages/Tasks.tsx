import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import DateScroller from '../components/DateScroller';

const Tasks: React.FC = () => {
  const [taskCreated, setTaskCreated] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [refreshTasks, setRefreshTasks] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }

    const currentDate = new Date().toISOString().split('T')[0];
    setSelectedDate(currentDate);
  }, [navigate]);

  const handleTaskCreated = () => {
    setTaskCreated(!taskCreated);
    setRefreshTasks((prev) => !prev);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setRefreshTasks((prev) => !prev);
  };

  const handleTaskUpdated = () => {
    setRefreshTasks((prev) => !prev);
  };

  return (
    <div className='container'>
      <h1>Your Tasks</h1>

      <DateScroller onSelectDate={handleDateSelect} />

      <div className='card'>
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>

      <div className='card'>
        <TaskList
          selectedDate={selectedDate}
          status={true}
          refreshTasks={refreshTasks}
          onTaskUpdated={handleTaskUpdated}
        />
        <TaskList
          selectedDate={selectedDate}
          status={false}
          refreshTasks={refreshTasks}
          onTaskUpdated={handleTaskUpdated}
        />
      </div>
    </div>
  );
};

export default Tasks;
