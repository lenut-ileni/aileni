import React, { useState, useEffect } from 'react';
import './TaskCard.css';
import Button from './Button';
import { format } from 'date-fns';
import { TaskCardProps } from '../types';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const [joke, setJoke] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const API =
    process.env.REACT_APP_ENV === 'dev'
      ? process.env.REACT_APP_BACKEND_LOCAL_API
      : process.env.REACT_APP_BACKEND_API;

  // Fetch the joke from the backend when the component mounts
  useEffect(() => {
    const fetchJoke = async () => {
      try {
        setLoading(true); // Set loading to true when starting to fetch

        const response = await fetch(`${API}/api/generate-joke`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: task.description,
            status: task.completed ? 'completed' : 'incompleted',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate joke');
        }

        const data = await response.json();

        if (data.joke) {
          setJoke(data.joke); // Set the joke to display it in the UI
        } else {
          setJoke('Oops, something went wrong with the joke!');
        }
      } catch (error) {
        console.error('Error fetching joke:', error);
        setJoke('Could not fetch the joke! Something went wrong.');
      } finally {
        setLoading(false); // Set loading to false when the fetch is done
      }
    };

    fetchJoke();
  }, [task.description, task.completed]);

  const handleToggleCompletion = async () => {
    try {
      const response = await fetch(`${API}/api/tasks/${task._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const updatedTask = { ...task, completed: !task.completed };
        onTaskUpdated(updatedTask); // Notify parent to update the task list
      } else {
        console.log('Failed to update task');
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API}/api/tasks/${task._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        onTaskDeleted(task._id);
      } else {
        console.log('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : 'incomplete'}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Due Date: {format(new Date(task.dueDate), 'MM/dd/yyyy')}</p>
      <p>Status: {task.completed ? 'Completed' : 'Incomplete'}</p>

      {/* Joke section */}
      <div className='task-joke'>
        {loading ? (
          <p>Loading joke...</p> // Display loading text while fetching the joke
        ) : (
          <div>
            <h4>Ionică:</h4>
            <p>{joke}</p>
          </div>
        )}
      </div>

      <Button
        disabled={false}
        label={task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        colorVariant={task.completed ? 'neutral' : 'green'}
        onClick={handleToggleCompletion}
      />
      <Button
        disabled={false}
        label='Delete'
        colorVariant='red'
        onClick={handleDelete}
      />
    </div>
  );
};

export default TaskCard;
