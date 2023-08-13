import React, { useState, useEffect, useRef } from 'react';
import { Popover } from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { PrevIcon, NextIcon, CalendarIcon, DownTriangleIcon } from './assets/icons';
import css from './date-picker.module.scss';
import dayjs from 'dayjs';

const scrollToItem = (itemId, behavior = 'auto') => {
    var parent = document.getElementById(itemId)?.parentElement;
    var item = document.getElementById(itemId);
    parent && parent.scrollTo({
        top: item?.offsetTop - 10,
        behavior,
    });
};

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
/**
 * @param {number} month
 * @param {boolean} withSmallName
 * @returns {string} month name
 */
const getMonthName = (month, withSmallName = false) => {
    if (withSmallName) {
        return smallMonthNames[month] ? smallMonthNames[month] : 'Dec';
    } else {
        return monthNames[month] ? monthNames[month] : 'December';
    }
};

/**
 * add zero before the number
 * @param {number} st
 * @returns {string} string: 1 => 01
 */
const twoZeroPadStart = st => String(st).padStart(2, '0');

const today = new Date();
const todayDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate()
};
const createDate = ({ year, month, day, }) =>
    new Date(year, month, day, 0, 0, 0, 0);


const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DatePicker = ({
    containerClassName,
    className,
    onChange,
    initialDate = null,
    min = null,
    max = null,
    removeButton = true,
    darkMode = false,
    startIcon,
    downIcon,
    updateDatePicker = { current: () => { } },
    autoFocus = false,
    id,
    selectedDate,
    ...attrs
}) => {
    const hasInitialDate = useRef(false);

    if (initialDate) {
        hasInitialDate.current = true;
    } else {
        initialDate = { ...todayDate };
    }
    const [isSelected, setIsSelected] = useState(false);

    const initialMonthLength = hasInitialDate ?
        new Date(
            initialDate.year,
            initialDate.month,
            0
        ).getDate()
        :
        new Date(
            today.year,
            today.month,
            0
        ).getDate()
        ;

    const [anchor, setAnchor] = useState(null);
    const [date, setDate] = useState(selectedDate || initialDate);
    const [monthLength, setMonthLength] = useState(initialMonthLength);


    updateDatePicker.current = (date) => {
        if (!isSelected) setIsSelected(true);

        setDate(date || todayDate);
    };

    const onMonthChange = () => {
        const monthLength = new Date(
            date.year,
            date.month,
            0
        ).getDate();
        setMonthLength(monthLength);

        if (date.day > monthLength)
            setDate(dt => ({ ...dt, day: monthLength }));

        if (min && date.month - 1 === min.month && date.day < min.day)
            setDate(dt => ({ ...dt, day: min.day }));

        if (max && date.month - 1 === max.month && date.day > max.day)
            setDate(dt => ({ ...dt, day: max.day }));
    };

    const onNavigationClick = isNext => {
        const timestamp = createDate(date).getTime();

        if (isNext) {
            if (!max || timestamp < createDate(max).getTime())
                setDate(dt => ({
                    ...dt,
                    year: dt.month === 12 ? dt.year + 1 : dt.year,
                    month: dt.month < 12 ? dt.month + 1 : 1,
                }));
        } else if (!min || timestamp > createDate(min).getTime())
            setDate(dt => ({
                ...dt,
                year: dt.month === 1 ? dt.year - 1 : dt.year,
                month: dt.month > 1 ? dt.month - 1 : 12,
            }));
    };

    const disableNavigationIcon = isNext => {
        const mDate = isNext ?
            {
                ...date,
                year: date.month === 12 ? date.year + 1 : date.year,
                month: date.month < 12 ? date.month + 1 : 1,
                day: max ? max.day : date.day,
            } :
            {
                ...date,
                year: date.month === 1 ? date.year - 1 : date.year,
                month: date.month > 1 ? date.month - 1 : 12,
                day: min ? min.day : date.day,
            };
        const time = createDate(mDate).getTime();

        return isNext
            ? max && time > createDate(max).getTime()
            : min && time < createDate(min).getTime();
    };

    const disableDay = day => {
        const newDate = {
            ...date,
            day,
        };
        const maxDate = {
            ...newDate,
        };
        const minDate = {
            ...newDate,
        };

        return (
            day > monthLength ||
            (max &&
                createDate(maxDate).getTime() > createDate(max).getTime()) ||
            (min && createDate(minDate).getTime() < createDate(min).getTime())
        );
    };

    const onDayClick = index => {
        const mDate = {
            ...date,
            day: index,
        };
        if (!isSelected) setIsSelected(true);

        onChange && onChange(mDate);

        setDate(mDate);
    };

    useEffect(() => {
        if (hasInitialDate.current) setIsSelected(true);
    }, []);

    useEffect(onMonthChange, [date.month]);

    useEffect(() => {
        if (anchor) {
            setTimeout(() => {
                scrollToItem('selected-year');
            }, 0);
        }
    }, [anchor]);

    useEffect(() => {
        const monthLength = new Date(
            date.year,
            date.month,
            0
        ).getDate();
        setMonthLength(monthLength);

        if (date.day > monthLength) {
            setDate(prev => ({
                ...prev,
                day: monthLength
            }));
        }
    }, [anchor]);

    const firstDayOfMonth = dayjs(`${date?.year}-${date?.month}-01T00:00:00`).format('ddd')

    return (
        <div className={classNames(css.DatePicker_SimpleDatePickerTis, containerClassName)} {...attrs} id={id}>
            <div
                className={classNames(css.container_SimpleDatePickerTis, {
                    [css.hideTime_SimpleDatePickerTis]: true,
                    [css.Dark_SimpleDatePickerTis]: darkMode
                })}
            >
                <div className={css.dateContainer_SimpleDatePickerTis}>
                    <header className={css.header_SimpleDatePickerTis}>
                        <span className={css.year_SimpleDatePickerTis}
                            onClick={e => setAnchor(e.currentTarget)}>
                            {`${getMonthName(date.month - 1, true)} ${date.year
                                }`} <DownTriangleIcon />
                        </span>

                        <div className={css.navigation_SimpleDatePickerTis}>
                            <button
                                className={classNames(css.navIcon_SimpleDatePickerTis, {
                                    [css.disable_SimpleDatePickerTis]: disableNavigationIcon(false),
                                })}
                                disabled={disableNavigationIcon(false)}
                                onClick={() => onNavigationClick(false)}
                            >
                                <PrevIcon />
                            </button>{' '}
                            <button
                                className={classNames(css.navIcon_SimpleDatePickerTis, {
                                    [css.disable_SimpleDatePickerTis]: disableNavigationIcon(true),
                                })}
                                disabled={disableNavigationIcon(true)}
                                onClick={() => onNavigationClick(true)}
                            >
                                <NextIcon />
                            </button>
                        </div>
                    </header>

                    <div className={css.days_SimpleDatePickerTis}>
                        {
                            weekDays.map(day =>
                                <div
                                    key={day}
                                    className={classNames(css.day_SimpleDatePickerTis, css.day_WeekDay)}
                                >
                                    <span>{day}</span>
                                </div>
                            )
                        }{
                            Array(
                                weekDays.findIndex(day => day === firstDayOfMonth)
                            ).fill(undefined).map((_, index) =>
                                <div
                                    key={index}
                                    className={classNames(css.day_SimpleDatePickerTis, css.day_WeekDay)}
                                >
                                    <span>{''}</span>
                                </div>
                            )
                        }
                        {new Array(31).fill(null).map((_, index) => (
                            <div
                                key={index}
                                className={classNames(css.day_SimpleDatePickerTis, {
                                    [css.selected_SimpleDatePickerTis]: date.day === index + 1,
                                    [css.disable_SimpleDatePickerTis]: disableDay(index + 1),
                                })}
                                onClick={() => onDayClick(index + 1)}
                            >
                                <span>{twoZeroPadStart(index + 1)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Popover
                className={css.popover_SimpleDatePickerTis}
                PaperProps={{
                    className: darkMode ? css.popoverPaperDark_SimpleDatePickerTis : css.popoverPaper_SimpleDatePickerTis
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
                <div className={classNames(css.container_YearPickerTis, {
                    [css.Dark_YearPickerTis]: darkMode
                })}>
                    {
                        Array(200).fill(undefined)
                            .map((_, index) => (today.getFullYear() - 100) + index)
                            .filter(year => {
                                if (max && min)
                                    return year <= max?.year && year >= min?.year;
                                if (max && !min)
                                    return year <= max?.year;
                                if (!max && min)
                                    return year >= min?.year;
                                return true;
                            })
                            .map(year =>
                                <div
                                    className={css.yearContainer_YearPickerTis}
                                    key={year}
                                    id={year === date.year ? 'selected-year' : undefined}
                                >
                                    <div
                                        className={classNames(css.year_YearPickerTis, {
                                            [css.selectedYear_YearPickerTis]: year === date.year,
                                        })}
                                        onClick={() => {
                                            let month = date.month;
                                            if (max && year === max?.year && month > max?.month)
                                                month = max?.month;
                                            if (min && year === min?.year && month < min?.month)
                                                month = min?.month;
                                            setDate(prev => ({
                                                ...prev,
                                                year,
                                                month
                                            }));
                                            setTimeout(() => {
                                                scrollToItem('selected-year', 'smooth');
                                            }, 0);
                                        }}
                                    >
                                        {year}
                                    </div>
                                    {
                                        (year === date.year) &&
                                        <div className={css.monthsContainer_YearPickerTis}>
                                            {
                                                smallMonthNames.map((month, index) =>
                                                    <div
                                                        key={month}
                                                        className={classNames(css.month_YearPickerTis, {
                                                            [css.selectedMonth_YearPickerTis]: index === date.month - 1,
                                                            [css.disableMonth_YearPickerTis]: (year === min?.year && index + 1 < min?.month) ||
                                                                (year === max?.year && index + 1 > max?.month)
                                                        })}
                                                        onClick={() => {
                                                            const month = index + 1;
                                                            setDate(prev => ({
                                                                ...prev,
                                                                month
                                                            }));
                                                            setAnchor(null);
                                                        }}>
                                                        {month}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    }
                                </div>
                            )
                    }
                </div>
            </Popover >
        </div >
    );
};

DatePicker.propTypes = {
    containerClassName: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    initialDate: PropTypes.object,
    min: PropTypes.object,
    max: PropTypes.object,
    darkMode: PropTypes.bool,
    startIcon: PropTypes.any,
    downIcon: PropTypes.any,
    updateDatePicker: PropTypes.object,
    autoFocus: PropTypes.bool,
    id: PropTypes.string,
    selectedDate: PropTypes.object,
};