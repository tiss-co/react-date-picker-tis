# react-date-picker-tis

> Date picker component for React

[![NPM](https://img.shields.io/npm/v/react-date-picker-tis.svg)](https://www.npmjs.com/package/react-date-picker-tis) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![react-date-picker-tis Banner](https://user-images.githubusercontent.com/76048512/119546988-c9575a80-bda9-11eb-99e0-cf797c393ef3.gif)


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

import { DateTimePicker } from 'react-date-picker-tis'
import 'react-date-picker-tis/dist/index.css'

const App = () => {
  return (
    <DateTimePicker
      className='DateTimePicker'
      onChange={(dateTime) => console.log(dateTime)}
      initialDateTime={today} //dateTime object
      min={today} //dateTime object
      max={nexMonth} //dateTime object
      hideTime={false}
      removeButton={true}
      darkMode={false}
    />
  )
}

export default App
```

### DateTime shape

```jsx
{
  year: PropTypes.number,
  month: PropTypes.number,
  day: PropTypes.number,
  hour: PropTypes.number,
  minute: PropTypes.number,
}
```

## License

MIT © [boof-tech](https://github.com/boof-tech)
