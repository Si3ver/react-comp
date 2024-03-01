import { Dayjs } from "dayjs";
import { CalendarProps } from ".";
import { weekList, LINES } from "./const";
import { useContext } from "react";
import LocaleContext from "./locale/LocaleContext";
import allLocales from "./locale";
import cs from 'classnames';

interface MonthCalendarProps extends CalendarProps {
  curMonth: Dayjs;
  selectHandler?: (date: Dayjs) => void;
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

function renderDays(
  days: Array<{ date: Dayjs, currentMonth: boolean}>,
  dateRender: MonthCalendarProps['dateRender'],
  dateInnerContent: MonthCalendarProps['dateInnerContent'],
  value: Dayjs,
  selectHandler: MonthCalendarProps['selectHandler'],
) {
  const rows = [];
  for (let i = 0; i < LINES; ++i) {
    const row = [];
    for (let j = 0; j < weekList.length; ++j) {
      const item = days[i * weekList.length + j];
      row[j] = <div className={
        "calendar-month-body-cell " + (item.currentMonth ? 'calendar-month-body-cell-current' : '' )
      }
        onClick={() => selectHandler?.(item.date)}
      >
        {
          dateRender ? dateRender(item.date) : (
            <div className="calendar-month-body-cell-date">
              <div className={
                cs('calendar-month-cell-body-date-value',
                  value.format('YYYY-MM-DD') === item.date.format('YYYY-MM-DD')
                    ? 'calendar-month-body-cell-date-selected'
                    : ''
                )
              }>{item.date.date()}</div>
              <div className="calendar-month-cell-body-date-content">{dateInnerContent?.(item.date)}</div>
            </div>
          )
        }
      </div>
    }
    rows[i] = row;
  }
  return rows.map((row, rowIndex) => <div key={`row-${rowIndex}`} className="calendar-month-body-row">{row}</div>)
}

function MonthCalendar(props: MonthCalendarProps) {
  const {
    value,
    curMonth,
    dateRender,
    dateInnerContent,
    selectHandler,
  } = props;

  const localeContext = useContext(LocaleContext);
  const CalendarLocale = allLocales[localeContext.locale];

  const allDays = getAllDays(curMonth);

  return <div className="calendar-month">
    <div className="calendar-month-week-list">
      {
        weekList.map((weekKey) => (
          <div className="calendar-month-week-list-item" key={weekKey}>
            {CalendarLocale.week[weekKey]}
          </div>
        ))
      }
    </div>
    <div className="calendar-month-body">
      {
        renderDays(allDays, dateRender, dateInnerContent, value, selectHandler)
      }
    </div>
  </div>
}

export default MonthCalendar;
