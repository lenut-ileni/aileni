import React from 'react';
import './LanguageSelector.css';
import { LanguageSelectorProps } from '../types';

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onChange,
}) => {
  return (
    <div className='language-selector'>
      <label htmlFor='language'>Select Lesson Language:</label>
      <select
        id='language'
        value={language}
        onChange={(e) => onChange(e.target.value as 'en' | 'ro')}
      >
        <option value='en'>English</option>
        <option value='ro'>Romanian</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
