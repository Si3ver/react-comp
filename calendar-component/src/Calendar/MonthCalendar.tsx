function MonthCalendar() {
  const weekList = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return <div className="calendar-month">
    <div className="calendar-month-week-list">
      {
        weekList.map((week) => (
          <div className="calendar-month-week-list-item" key={week}>
            {week}
          </div>
        ))
      }
    </div>
  </div>
}

export default MonthCalendar;
