import React, { useState } from 'react';
import Button from './Button';
import './SubjectForm.css';
import { SubjectFormProps } from '../types';

const SubjectForm: React.FC<SubjectFormProps> = ({ onSubmit }) => {
  const [subject, setSubject] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (subject.trim() !== '') {
      onSubmit(subject);
    }
  };

  return (
    <form className='subject-form' onSubmit={handleSubmit}>
      <div className='subject-form-container'>
        <input
          type='text'
          className='subject-input'
          value={subject}
          onChange={handleChange}
          placeholder='Choose a subject'
          required
        />
        <Button disabled={false} label='Create a lesson' type='submit' />
      </div>
    </form>
  );
};

export default SubjectForm;
