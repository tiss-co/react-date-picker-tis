import React from 'react';

import { DateTimePicker } from 'react-date-picker-tis';
import 'react-date-picker-tis/dist/index.css';

const App = () => {
  return (
    <div className='App'>
      <div className='Title'>
        DateTimePicker Tis
      </div>
      <DateTimePicker
        className='DateTimePicker'
        onChange={dateTime => console.log(dateTime)}
        // initialDateTime={today} // dateTime object
        // min={today} // dateTime object
        // max={nexMonth} // dateTime object
        hideTime={true}
        removeButton={true}
        darkMode={false}
      />
    </div>
  );
};

export default App;