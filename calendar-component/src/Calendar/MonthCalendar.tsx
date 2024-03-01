import { Dayjs } from "dayjs";
import { CalendarProps } from ".";

import { weekList, LINES } from "./const";

interface MonthCalendarProps extends CalendarProps {

}

function getAllDays(date: Dayjs) {
  const startDate = date.startOf('month');
  const day = startDate.day();

  const daysInfo: Array<{date: Dayjs, currentMonth: boolean}> = new Array(6 * 7);
  // last month
  for (let i = 0; i < day; ++i) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, 'day'),
      currentMonth: false,
    }
  }
  // this month & next month
  for (let i = day; i < daysInfo.length; ++i) {
    const calcDate = startDate.add(i - day, 'day');
    daysInfo[i] = {
      date: calcDate,
      currentMonth: calcDate.month() === date.month(),
    }
  }
  return daysInfo;
}

function renderDays(days: Array<{ date: Dayjs, currentMonth: boolean}>) {
  const rows = [];
  for (let i = 0; i < LINES; ++i) {
    const row = [];
    for (let j = 0; j < weekList.length; ++j) {
      const item = days[i * weekList.length + j];
      row[j] = <div className={
        "calendar-month-body-cell " + (item.currentMonth ? 'calendar-month-body-cell-current' : '' )
      }>{item.date.date()}</div>
    }
    rows[i] = row;
  }
  return rows.map(row => <div className="calendar-month-body-row">{row}</div>)
}

function MonthCalendar(props: MonthCalendarProps) {
  const allDays = getAllDays(props.value);
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
    <div className="calendar-month-body">
      {
        renderDays(allDays)
      }
    </div>
  </div>
}

export default MonthCalendar;
