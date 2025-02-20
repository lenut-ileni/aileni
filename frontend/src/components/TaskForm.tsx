import React, { useState } from 'react';
import { format } from 'date-fns';
import './TaskForm.css';
import Button from './Button';
import { TaskFormProps } from '../types';

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const API =
    process.env.REACT_APP_ENV === 'dev'
      ? process.env.REACT_APP_BACKEND_LOCAL_API
      : process.env.REACT_APP_BACKEND_API;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the due date is filled before proceeding
    if (!dueDate) {
      alert('Please provide a due date for the task.');
      return; // Prevent submission if due date is not provided
    }

    const token = localStorage.getItem('authToken');
    if (!token) return;

    // Convert the due date to 'yyyy-MM-dd' format before sending
    const formattedDueDate = format(new Date(dueDate), 'yyyy-MM-dd');

    try {
      const response = await fetch(`${API}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          dueDate: formattedDueDate,
        }),
      });

      if (response.ok) {
        onTaskCreated();
        setTitle('');
        setDescription('');
        setDueDate('');
      } else {
        const errorData = await response.json();
        console.error('Failed to create task:', errorData.message);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className='task-form-container'>
      <h2>Create a New Task</h2>
      <form onSubmit={handleSubmit} className='task-form'>
        <div className='form-group'>
          <label htmlFor='task-title'>Task Title</label>
          <input
            type='text'
            id='task-title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder='Enter task title'
            className='task-input'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='task-description'>Description (Optional)</label>
          <textarea
            id='task-description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter task description'
            className='task-input task-textarea'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='task-due-date'>Due Date</label>
          <input
            type='date'
            id='task-due-date'
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className='task-input'
          />
        </div>

        <Button
          disabled={false}
          label='Create Task'
          colorVariant='green'
          type='submit'
        />
      </form>
    </div>
  );
};

export default TaskForm;
