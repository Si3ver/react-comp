import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { TOTAL_LINE, weekNames, monthNames } from './const';
import './App.css';

interface CalendarProps {
  value?: Date,
  onChange?: (date: Date) => void,
}

interface CalendarRef {
  getDate: () => Date,
  setDate: (date: Date) => void,
}

const InternalCalendar: React.ForwardRefRenderFunction<CalendarRef, CalendarProps> = (props, ref) => {
  const {
    value = new Date(),
    onChange,
  } = props;

  const [date, setDate] = useState(value);

  useImperativeHandle(ref, () => {
    return {
      getDate() {
        return date;
      },
      setDate(date: Date) {
        setDate(date);
      },
    };
  });

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

    // last Month
    for (let i = 0; i > -firstDay; --i) {
      const dayToShow = new Date(date.getFullYear(), date.getMonth(), i).getDate();
      days.unshift(<div key={`empty-${i}`} className="disabled">{dayToShow}</div>);
    }
    for (let i = 1; i <= daysCount; ++i) {
      const clickHandler = onChange?.bind(null, new Date(date.getFullYear(), date.getMonth(), i));
      if (i === date.getDate()) {
        days.push(<div key={i} className="day selected" onClick={clickHandler}>{i}</div>)
      } else {
        days.push(<div key={i} className="day" onClick={clickHandler}>{i}</div>)
      }
    }
    // next month
    const count = TOTAL_LINE * weekNames.length - days.length;
    for (let i = 1; i <= count; ++i) {
      days.push(<div key={`empty-${i}`} className="disabled">{i}</div>);
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

const Calendar = forwardRef(InternalCalendar);

function Test() {
  const calendarRef = useRef<CalendarRef>(null);

  useEffect(() => {
    console.log(calendarRef.current?.getDate().toLocaleDateString());

    setTimeout(() => {
      calendarRef.current?.setDate(new Date(2025, 2, 1));
    }, 3000);
  }, []);

  return <div>
    <Calendar value={new Date(2024, 1, 29)} onChange={(date: Date) => {
      alert(date.toLocaleDateString());
    }} />
    <Calendar ref={calendarRef} value={new Date(2024, 2)} />
  </div>
}

export default Test;
