import dayjs, { Dayjs } from "dayjs";
import Header from "./Header";
import MonthCalendar from "./MonthCalendar";
import "./index.scss";
import { CSSProperties, ReactNode, useState } from "react";
import cs from "classnames";
import LocaleContext from "./locale/LocaleContext";

export interface CalendarProps {
  style?: CSSProperties;
  className?: string | string[];
  value: Dayjs,
  onChange?: (date: Dayjs) => void;
  dateRender?: (currentDate: Dayjs) => ReactNode;
  dateInnerContent?: (currentDate: Dayjs) => ReactNode;
  locale?: string;
}

function Calendar(props: CalendarProps) {
  const {
    style,
    className,
    value,
    onChange,
    locale,
  } = props;

  const classNames = cs('calendar', className);

  const [curValue, setCurValue] = useState<Dayjs>(value);
  const [curMonth, setCurMonth] = useState<Dayjs>(value);

  function changeDate(date: Dayjs) {
    setCurValue(date);
    setCurMonth(date);
    onChange?.(date);
  }

  return <LocaleContext.Provider value={{
    locale: locale || navigator.language
  }}>
    <div className={classNames} style={style}>
      <Header curMonth={curMonth}
        prevMonthHandler={() => {
          setCurMonth(curMonth.subtract(1, 'month'));
        }}
        nextMonthHandler={() => {
          setCurMonth(curMonth.add(1, 'month'));
        }}
        todayHandler={() => {
          const today = dayjs(Date.now());
          changeDate(today);
        }}
      />
      <MonthCalendar
        {...props}
        value={curValue}
        curMonth={curMonth}
        selectHandler={changeDate}
      />
    </div>
  </LocaleContext.Provider>
}

export default Calendar;
