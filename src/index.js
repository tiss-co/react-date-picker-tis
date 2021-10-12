import React, { useState, useEffect, useRef } from 'react';
import { Popover, Button } from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { PrevIcon, NextIcon, DownTriangleIcon, CloseIcon } from './assets/icons';

import css from './styles.module.scss';

const scrollToItem = (itemId) => {
  var parent = document.getElementById(itemId)?.parentElement;
  var item = document.getElementById(itemId);
  parent && parent.scrollTo({
    top: item.offsetTop - (item.offsetHeight * 2) + 5,
    behavior: 'auto',
  });
};

/**
 * @param {number} month
 * @param {boolean} withSmallName
 * @returns {string} month name
 */
const getMonthName = (month, withSmallName = false) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const smallMonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return withSmallName ? smallMonthNames[month] : monthNames[month];
};

/**
 * add zero before the number
 * @param {number} st
 * @returns {string} string: 1 => 01
 */
const twoZeroPadStart = st => String(st).padStart(2, '0');

const today = new Date();
const todayDateTime = {
  year: today.getFullYear(),
  month: today.getMonth(),
  day: today.getDate(),
  hour: 0,
  minute: 0,
};
const createDate = ({ year, month, day, hour, minute }) =>
  new Date(year, month, day, hour, minute, 0, 0);

export const DateTimePicker = ({
  className,
  onChange,
  initialDateTime = null,
  min = { ...todayDateTime },
  max,
  hideTime = false,
  removeButton = true,
  darkMode = false,
  startIcon,
  downIcon,
  updateDatePicker,
  ...attrs
}) => {
  const hasInitialDateTime = useRef(false);

  if (initialDateTime) {
    hasInitialDateTime.current = true;
  } else {
    initialDateTime = { ...todayDateTime };
  }
  const [isSelected, setIsSelected] = useState(false);

  const initialMonthLength = hasInitialDateTime ?
    new Date(
      initialDateTime.year,
      initialDateTime.month - 1,
      0
    ).getDate()
    :
    new Date(
      today.year,
      today.month - 1,
      0
    ).getDate()
    ;

  const [anchor, setAnchor] = useState(null);
  const [dateTime, setDateTime] = useState(initialDateTime);
  const [prevDateTime, setPrevDateTime] = useState(dateTime);
  const [monthLength, setMonthLength] = useState(initialMonthLength);

  updateDatePicker?.current = (date) => setDateTime(date);

  const onSubmit = () => {
    setIsSelected(true);
    setAnchor(null);
    setPrevDateTime(dateTime);
    onChange && onChange(dateTime);
  };

  const onMonthChange = () => {
    const monthLength = new Date(
      dateTime.year,
      dateTime.month + 1,
      0
    ).getDate();
    setMonthLength(monthLength);

    if (dateTime.day > monthLength)
      setDateTime(dt => ({ ...dt, day: monthLength }));

    if (min && dateTime.month === min.month && dateTime.day < min.day)
      setDateTime(dt => ({ ...dt, day: min.day }));

    if (max && dateTime.month === max.month && dateTime.day > max.day)
      setDateTime(dt => ({ ...dt, day: max.day }));
  };

  const onNavigationClick = isNext => {
    const timestamp = createDate(dateTime).getTime();

    if (isNext) {
      if (!max || timestamp < createDate(max).getTime())
        setDateTime(dt => ({
          ...dt,
          year: dt.month === 11 ? dt.year + 1 : dt.year,
          month: dt.month < 11 ? dt.month + 1 : 0,
        }));
    } else if (!min || timestamp > createDate(min).getTime())
      setDateTime(dt => ({
        ...dt,
        year: dt.month === 0 ? dt.year - 1 : dt.year,
        month: dt.month > 0 ? dt.month - 1 : 11,
      }));
  };

  const disableNavigationIcon = isNext => {
    const mDateTime = isNext ?
      {
        ...dateTime,
        year: dateTime.month === 11 ? dateTime.year + 1 : dateTime.year,
        month: dateTime.month < 11 ? dateTime.month + 1 : 0,
        day: max ? max.day : dateTime.day,
        hour: max ? max.hour : dateTime.hour,
        minute: max ? max.minute : dateTime.minute,
      } :
      {
        ...dateTime,
        year: dateTime.month === 0 ? dateTime.year - 1 : dateTime.year,
        month: dateTime.month > 0 ? dateTime.month - 1 : 11,
        day: min ? min.day : dateTime.day,
        hour: min ? min.hour : dateTime.hour,
        minute: min ? min.minute : dateTime.minute,
      };
    const time = createDate(mDateTime).getTime();

    return isNext
      ? max && time > createDate(max).getTime()
      : min && time < createDate(min).getTime();
  };

  const disableDay = day => {
    const newDateTime = {
      ...dateTime,
      day,
    };
    const maxDateTime = {
      ...newDateTime,
      hour: max?.hour || newDateTime.hour,
    };
    const minDateTime = {
      ...newDateTime,
      hour: min?.hour || newDateTime.hour,
    };

    return (
      day > monthLength ||
      (max &&
        createDate(maxDateTime).getTime() > createDate(max).getTime()) ||
      (min && createDate(minDateTime).getTime() < createDate(min).getTime())
    );
  };

  const onDayClick = index => {
    const mDateTime = {
      ...dateTime,
      day: index + 1,
    };
    if (hideTime) {
      if (!isSelected) setIsSelected(true);

      setPrevDateTime(mDateTime);
      setAnchor(null);
      onChange && onChange(mDateTime);
    }

    setDateTime(mDateTime);
  };

  const formatDateTime = () =>
    `${prevDateTime.year}-${twoZeroPadStart(
      prevDateTime.month + 1
    )}-${twoZeroPadStart(prevDateTime.day)}` +
    (!hideTime
      ? ` ${twoZeroPadStart(prevDateTime.hour)}:${twoZeroPadStart(
        prevDateTime.minute
      )}`
      : '');

  // const dateTimePlaceHolder = `yyyy-mm-dd ${!hideTime ? '--:--' : ''}`;
  const dateTimePlaceHolder = 'Select Date';

  useEffect(() => {
    if (hasInitialDateTime.current) setIsSelected(true);
  }, []);

  useEffect(onMonthChange, [dateTime.month]);

  useEffect(() => {
    if (anchor)
      setTimeout(() => {
        scrollToItem('selected-hour');
        scrollToItem('selected-minute');
      }, 0);
  }, [anchor]);

  return (
    <div className={css.dateTimePicker_DateTimePickerTis} {...attrs}>
      <div
        className={classNames(css.buttonContainer_DateTimePickerTis, {
          [css.Dark_DateTimePickerTis]: darkMode
        })}
      >
        <Button
          className={classNames(css.pickerButton_DateTimePickerTis, {
            [css.buttonPaddingRight_DateTimePickerTis]: removeButton && isSelected
          }, className)}
          onClick={e => setAnchor(e.target)}
        >
          <div className={css.pickerButtonInsideContainer_DateTimePickerTis}>
            {startIcon && startIcon}
            {isSelected ? formatDateTime() : dateTimePlaceHolder}
            {(!removeButton || !isSelected) && (downIcon ? downIcon : <DownTriangleIcon />)}
          </div>
        </Button>

        {removeButton && isSelected && (
          <div className={css.CloseCircle_DateTimePickerTis} onClick={() => setIsSelected(false)}>
            <CloseIcon />
          </div>
        )}
      </div>

      <Popover
        className={css.popover_DateTimePickerTis}
        PaperProps={{
          className: darkMode ? css.popoverPaperDark_DateTimePickerTis : css.popoverPaper_DateTimePickerTis
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
        <div
          className={classNames(css.container_DateTimePickerTis, {
            [css.hideTime_DateTimePickerTis]: hideTime,
            [css.Dark_DateTimePickerTis]: darkMode
          })}
        >
          <div className={css.dateContainer_DateTimePickerTis}>
            <header className={css.header_DateTimePickerTis}>
              <span className={css.year_DateTimePickerTis}>
                {`${getMonthName(dateTime.month, true)} ${dateTime.year
                  }`}
              </span>

              <div className={css.navigation_DateTimePickerTis}>
                <button
                  className={classNames(css.navIcon_DateTimePickerTis, {
                    [css.disable_DateTimePickerTis]: disableNavigationIcon(false),
                  })}
                  disabled={disableNavigationIcon(false)}
                  onClick={() => onNavigationClick(false)}
                >
                  <PrevIcon />
                </button>{' '}
                <button
                  className={classNames(css.navIcon_DateTimePickerTis, {
                    [css.disable_DateTimePickerTis]: disableNavigationIcon(true),
                  })}
                  disabled={disableNavigationIcon(true)}
                  onClick={() => onNavigationClick(true)}
                >
                  <NextIcon />
                </button>
              </div>
            </header>

            <div className={css.days_DateTimePickerTis}>
              {new Array(31).fill(null).map((_, index) => (
                <div
                  key={index}
                  className={classNames(css.day_DateTimePickerTis, {
                    [css.selected_DateTimePickerTis]: dateTime.day === index + 1,
                    [css.disable_DateTimePickerTis]: disableDay(index + 1),
                  })}
                  onClick={() => onDayClick(index)}
                >
                  <span>{twoZeroPadStart(index + 1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={classNames(css.timeContainer_DateTimePickerTis, {
            [css.hide_DateTimePickerTis]: hideTime,
          })}
          >
            <div className={css.hours_DateTimePickerTis}>
              <div className={css.hourTitle_DateTimePickerTis} >
                Hour
              </div>
              {new Array(24).fill(null).map((_, index) => (
                <div
                  key={index}
                  className={classNames(css.hour_DateTimePickerTis, {
                    [css.selected_DateTimePickerTis]: dateTime.hour === index,
                  })}
                  onClick={() =>
                    setDateTime(dt => ({ ...dt, hour: index }))
                  }
                  id={dateTime.hour === index ? 'selected-hour' : 'hour'}
                >
                  {twoZeroPadStart(index)}
                </div>
              ))}
            </div>

            <div className={css.minutes_DateTimePickerTis}>
              <div className={css.minuteTitle_DateTimePickerTis} >
                Min
              </div>
              {new Array(60).fill(null).map((_, index) => (
                <div
                  key={index}
                  className={classNames(css.minute_DateTimePickerTis, {
                    [css.selected_DateTimePickerTis]: dateTime.minute === index,
                  })}
                  onClick={() =>
                    setDateTime(dt => ({ ...dt, minute: index }))
                  }
                  id={dateTime.minute === index ? 'selected-minute' : 'minute'}
                >
                  {twoZeroPadStart(index)}
                </div>
              ))}
            </div>
          </div>
        </div>
        {!hideTime && (
          <div className={classNames(css.submitContainer_DateTimePickerTis, {
            [css.Dark_DateTimePickerTis]: darkMode
          })}>
            <button
              className={css.SubmitButton_DateTimePickerTis}
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        )}
      </Popover>
    </div>
  );
};

DateTimePicker.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  initialDateTime: PropTypes.object,
  min: PropTypes.object,
  max: PropTypes.object,
  hideTime: PropTypes.bool,
  removeButton: PropTypes.bool,
  darkMode: PropTypes.bool,
  startIcon: PropTypes.any,
  downIcon: PropTypes.any,
};