import { useContext } from "react";
import LocaleContext from "./locale/LocaleContext";
import allLocales from "./locale";

function Header() {
  const localeContext = useContext(LocaleContext);
  const CalendarLocale = allLocales[localeContext.locale];

  return <div className="calendar-header">
    <div className="calendar-header-left">
      <div className="calendar-header-icon">&lt;</div>
      <div className="calendar-header-value">2024 - Mar</div>
      <div className="calendar-header-icon">&gt;</div>
      <div className="calendar-header-btn">{CalendarLocale.today}</div>
    </div>
  </div>
}

export default Header;
