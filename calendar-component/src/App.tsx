import dayjs from 'dayjs';
import Calendar from './Calendar';

function App() {
  return (
    <div className="App">
      <Calendar value={dayjs('2024-3-2')} />
    </div>
  );
}

export default App;
