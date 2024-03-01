import { useState } from 'react';
import { weekNames, monthNames } from './const';
import './App.css';

function Calendar() {
  const [date, setDate] = useState(new Date());

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  // eg. 2024-02 有 29 天，daysOfMonth(2024, 1) --> 29
  const daysOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // eg. 2024-03-01 是周五，firstDayOfMonth(2024, 2) --> 5
  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderDays = () => {
    const days = [];
    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

    for (let i = 0; i < firstDay; ++i) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }
    for (let i = 1; i <= daysCount; ++i) {
      days.push(<div key={i} className="day">{i}</div>)
    }

    return days;
  }

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <div>{date.getFullYear()} - {monthNames[date.getMonth()]}</div>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="days">
        {weekNames.map((weekName, i) => (<div key={`week-${i}`} className="week">{weekName}</div>))}
        {renderDays()}
      </div>
    </div>
  );
}

export default Calendar;
