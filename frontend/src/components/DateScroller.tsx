import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import './DateScroller.css';
import { DateScrollerProps } from '../types';
import Button from './Button';

const DateScroller: React.FC<DateScrollerProps> = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );

  // Generate an array of 7 days starting from currentDate
  const getDaysArray = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(format(addDays(startDate, i), 'yyyy-MM-dd'));
    }
    return days;
  };

  const days = getDaysArray(currentDate);

  const handleLeftArrowClick = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleRightArrowClick = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleDayClick = (day: string) => {
    setSelectedDate(day);
    onSelectDate(day);
  };

  return (
    <div className='date-scroller'>
      <button className='arrow-button' onClick={handleLeftArrowClick}>
        &lt;
      </button>

      <div className='dates-container'>
        {days.map((day) => (
          <div
            key={day}
            className={`date-item ${selectedDate === day ? 'selected' : ''}`}
            onClick={() => handleDayClick(day)}
          >
            {format(new Date(day), 'EEE, MMM dd')}
          </div>
        ))}
      </div>

      <Button
        className='arrow-button'
        disabled={false}
        label='&gt;'
        colorVariant='green'
        onClick={() => handleRightArrowClick()}
      />
    </div>
  );
};

export default DateScroller;
