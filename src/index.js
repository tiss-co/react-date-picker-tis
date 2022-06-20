import React, { useEffect, useState, useRef } from 'react'
import css from './styles.module.scss'
import { DatePicker as Picker } from './DatePicker'
import { Popover } from '@material-ui/core';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';

const usePrev = state => {
  const ref = useRef();
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref.current;
};

export const DatePicker = ({
  darkMode,
  containerClassName,
  buttonClassName,
  pickerClassName,
  onChange,
  initialDate = null,
  min = null,
  max = null,
  containerId,
  buttonId,
  datePickerId,
}) => {
  const [anchor, setAnchor] = useState();
  const [date, setDate] = useState();
  const prevAnchor = usePrev(anchor);

  useEffect(() => {
    if (!anchor && prevAnchor && date)
      onChange(date);
  }, [anchor]);

  return (
    <div className={classNames(css.container_DatePickerTis, {
      [css.containerDark_DatePickerTis]: darkMode
    }, containerClassName)} id={containerId}>
      <div className={css.buttonContainer_DatePickerTis}>
        <button
          id={buttonId}
          className={buttonClassName}
          onClick={e => setAnchor(e?.currentTarget)}
        >
          {
            date ?
              `${moment(date).format('MMM D[,] YYYY')}`
              : 'Date Selector'
          }
        </button>
      </div>
      <Popover
        className={css.popover_DatePickerTis}
        PaperProps={{
          className: darkMode ? css.popoverPaperDark_DatePickerTis : css.popoverPaper_DatePickerTis
        }}
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Picker
          className={pickerClassName}
          id={datePickerId}
          onChange={date => {
            setDate(date);
            setAnchor(null);
          }}
          initialDate={initialDate}
          darkMode={darkMode}
          min={min}
          max={max}
          selectedDate={date ? date : null}
        />
      </Popover>
    </div>
  );
}

DatePicker.propTypes = {
  containerClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  darkMode: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  initialDate: PropTypes.object,
  min: PropTypes.object,
  max: PropTypes.object,
  containerId: PropTypes.string,
  buttonId: PropTypes.string,
  datePickerId: PropTypes.string,
  pickerClassName: PropTypes.string,
};