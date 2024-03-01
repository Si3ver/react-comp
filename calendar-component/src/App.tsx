import dayjs from 'dayjs';
import Calendar from './Calendar';

function App() {
  return (
    <div className="App">
      <Calendar
        className={'aaa'}
        // style={{background: 'pink'}}
        value={dayjs('2024-3-2')}
        onChange={(date) => {
          alert(date.format('YYYY-MM-DD'));
        }}
        // locale="en-US"
        // dateRender={(value) => {
        //   return <div>
        //     <p style={{background: 'yellowgreen', height: '300px'}}>{value.format('YYYY-MM-DD')}</p>
        //   </div>
        // }}
        // dateInnerContent={(value) => {
        //   return <div>
        //     <p style={{background: 'yellowgreen', height: '30px'}}>{value.format('YYYY-MM-DD')}</p>
        //   </div>
        // }}
      />
    </div>
  );
}

export default App;
