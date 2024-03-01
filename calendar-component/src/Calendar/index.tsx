import { Dayjs } from "dayjs";
import Header from "./Header";
import MonthCalendar from "./MonthCalendar";
import "./index.scss";
import { CSSProperties, ReactNode } from "react";
import cs from "classnames";
import LocaleContext from "./locale/LocaleContext";

export interface CalendarProps {
  value: Dayjs,
  style?: CSSProperties;
  className?: string | string[];
  dateRender?: (currentDate: Dayjs) => ReactNode;
  dateInnerContent?: (currentDate: Dayjs) => ReactNode;
  locale?: string;
  onChange?: (date: Dayjs) => void;
}

function Calendar(props: CalendarProps) {
  const {
    style,
    className,
    locale,
  } = props;

  const classNames = cs('calendar', className);

  return <LocaleContext.Provider value={{
    locale: locale || navigator.language
  }}>
    <div className={classNames} style={style}>
      <Header />
      <MonthCalendar {...props} />
    </div>
  </LocaleContext.Provider>
}

export default Calendar;
