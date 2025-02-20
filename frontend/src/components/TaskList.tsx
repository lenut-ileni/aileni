import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import { TaskListProps } from '../types';
import { Task } from '../types';

const TaskList: React.FC<TaskListProps> = ({
  selectedDate,
  status,
  refreshTasks,
  onTaskUpdated,
}) => {
  const [tasks, setTasks] = useState<any[]>([]); // Tasks state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(''); // State for error messages
  const API =
    process.env.REACT_APP_ENV === 'dev'
      ? process.env.REACT_APP_BACKEND_LOCAL_API
      : process.env.REACT_APP_BACKEND_API;

  // Fetch tasks for the selected date and status
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(''); // Reset error before fetching
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await fetch(
          `${API}/api/tasks?selectedDate=${selectedDate}&status=${status}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          setError('Failed to fetch tasks for the selected date');
        }
      } catch (error) {
        setError('Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchTasks();
    }
  }, [selectedDate, status, refreshTasks]); // Re-run when selectedDate, status, or refreshTasks changes

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    onTaskUpdated();
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task,
      ),
    );
    onTaskUpdated();
  };

  return (
    <div>
      <h2>{status === true ? 'Completed tasks' : 'Tasks to complete'}</h2>
      {error && <div className='error-message'>{error}</div>}{' '}
      {/* Display error if any */}
      {tasks.length === 0 ? (
        <p>No tasks for this day</p>
      ) : (
        <ul>
          {tasks.map((task: any) => (
            <TaskCard
              key={task._id}
              task={task}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
