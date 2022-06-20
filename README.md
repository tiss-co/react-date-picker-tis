# react-date-picker-tis

> Date picker component for React

[![NPM](https://img.shields.io/npm/v/react-date-picker-tis.svg)](https://www.npmjs.com/package/react-date-picker-tis) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![react-date-picker-tis Banner](https://user-images.githubusercontent.com/76048512/174603235-a8601d9a-7700-49c6-8bad-a7277ed5cad7.gif)

## Install

```bash
npm i react-date-picker-tis
```

or

```bash
yarn add react-date-picker-tis
```

## Usage

```jsx
import React from 'react'

import { DatePicker } from 'react-date-picker-tis'
import 'react-date-picker-tis/dist/index.css'

const App = () => {
  return (
    <DatePicker
      className='DatePicker'
      onChange={(date) => console.log(date)}
      initialDate={today} //date object
      min={today} //date object
      max={nexMonth} //date object
      darkMode={false}
    />
  )
}

export default App
```

### Date Object

```jsx
{
  year: PropTypes.number,
  month: PropTypes.number,
  day: PropTypes.number,
}
```

## License

MIT © [boof-tech](https://github.com/boof-tech)
