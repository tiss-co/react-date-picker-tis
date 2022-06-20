import React from 'react';

import { DatePicker } from 'react-date-picker-tis';
import 'react-date-picker-tis/dist/index.css';

const App = () => {
  return (
    <div className='App'>
      <div className='Title'>
        DatePicker Tis
      </div>
      <DatePicker
        containerClassName='DatePicker'
        onChange={date => console.log(date)}
        darkMode={false}
      />
    </div>
  );
};

export default App;