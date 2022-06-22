import React from 'react';

import { DatePicker } from 'react-date-picker-tis';
import 'react-date-picker-tis/dist/index.css';
const today = new Date();

const App = () => {
  return (
    <div className='App'>
      <div className='Title'>
        DatePicker Tis
      </div>
      <DatePicker
        containerClassName='DatePicker'
        onChange={date => console.log(date)}
        min={{
          year: today.getFullYear() - 5,
          month: today.getMonth() + 1,
          day: today.getDate(),
        }}
        max={{
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
        }}
        darkMode={false}
      />
    </div>
  );
};

export default App;