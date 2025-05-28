import React, { useState, useEffect, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th';


//
dayjs.extend(buddhistEra);
dayjs.locale('th');

export interface ThaiDatePickerProps {
    error?: string;
    label: string;
    placeholder: string;
    require?: boolean;
    dob?: string;
    onSet: (e: string) => void
};

const gregorianYearToBuddhistYear = (gregorianYear: number): number => gregorianYear + 543;

const buddhistYearToGregorianYear = (buddhistYear: number): number => buddhistYear - 543;

const thaiMonths: string[] = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

interface YearPickerProps {
    selectedYear: number;
    onSelectYear: (year: number) => void;
    minYear: number;
    maxYear: number;
}

const YearPicker: React.FC<YearPickerProps> = ({ selectedYear, onSelectYear, minYear, maxYear }) => {
    const years: number[] = [];

    const startGregorianYear = buddhistYearToGregorianYear(minYear);
    const endGregorianYear = buddhistYearToGregorianYear(maxYear);

    for (let year = startGregorianYear; year <= endGregorianYear; year++) {
        years.push(year);
    }

    return (
        <div className="grid grid-cols-3 gap-2 p-2 max-h-80 overflow-y-auto">
            {[...years].sort((a, b) => b - a).map((year: number) => (
                <button
                    type='button'
                    key={year}
                    onClick={() => onSelectYear(year)}
                    className={`p-2 rounded-lg font-medium transition-colors duration-200
            ${year === selectedYear
                            ? 'bg-[var(--primary-green)] text-white shadow-md'
                            : ' text-gray-800 hover:bg-blue-var(--primary-green)100 hover:text-[]'
                        }
          `}
                >
                    {gregorianYearToBuddhistYear(year)}
                </button>
            ))}
        </div>
    );
};


interface MonthPickerProps {
    selectedMonth: number;
    selectedYear: number;
    onSelectMonth: (monthIndex: number) => void;
}

const MonthPicker: React.FC<MonthPickerProps> = ({ selectedMonth, onSelectMonth, selectedYear }) => {

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return (
        <div className="grid grid-cols-3 gap-2 p-4">
            {thaiMonths.map((monthName: string, index: number) => {

                const isDisabled =
                    selectedYear > currentYear ||
                    (selectedYear === currentYear && index > currentMonth);

                return (
                    <button
                        type='button'
                        key={monthName}
                        onClick={() => onSelectMonth(index)}
                        className={`p-3 rounded-lg font-medium transition-colors duration-200
                            ${index === selectedMonth
                                ? 'bg-[var(--primary-green)] text-white shadow-md'
                                : isDisabled
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-800 hover:bg-blue-var(--primary-green)100 hover:text-[]'
                            }
                        `}
                        disabled={isDisabled}
                    >
                        {monthName}
                    </button>
                );
            })}
        </div>
    );
};


interface DayPickerProps {
    date: dayjs.Dayjs;
    onSelectDay: (dayjsObject: dayjs.Dayjs) => void;
    minDate: dayjs.Dayjs;
    maxDate: dayjs.Dayjs;
}

const DayPicker: React.FC<DayPickerProps> = ({ date, onSelectDay, minDate, maxDate }) => {
    const [currentMonthDayjs, setCurrentMonthDayjs] = useState<dayjs.Dayjs>(dayjs(date || dayjs()));

    useEffect(() => {
        setCurrentMonthDayjs(dayjs(date || dayjs()));
    }, [date]);

    const startOfMonth: dayjs.Dayjs = currentMonthDayjs.startOf('month');
    const endOfMonth: dayjs.Dayjs = currentMonthDayjs.endOf('month');
    const numDaysInMonth: number = endOfMonth.date();
    const firstDayOfWeek: number = startOfMonth.day();

    const days: (number | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null);
    }

    for (let i = 1; i <= numDaysInMonth; i++) {
        days.push(i);
    }

    const handlePrevMonth = (): void => {
        setCurrentMonthDayjs(currentMonthDayjs.subtract(1, 'month'));
    };

    const handleNextMonth = (): void => {
        setCurrentMonthDayjs(currentMonthDayjs.add(1, 'month'));
    };

    const isDayDisabled = (day: number | null): boolean => {
        if (day === null) return true;
        const currentDay: dayjs.Dayjs = currentMonthDayjs.date(day);
        return currentDay.isBefore(minDate, 'day') || currentDay.isAfter(maxDate, 'day');
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    type='button'
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Previous month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="font-semibold text-lg text-gray-800">
                    {currentMonthDayjs.format('MMMM BBBB')} {/* Thai month and Buddhist year */}
                </span>
                <button
                    type='button'
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Next month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
                {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day: string) => (
                    <span key={day} className="py-2">{day}</span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((day: number | null, index: number) => (
                    <button
                        type='button'
                        key={index}
                        onClick={() => day !== null && onSelectDay(currentMonthDayjs.date(day))}
                        disabled={isDayDisabled(day)}
                        className={`p-2 rounded-full text-gray-800 transition-colors duration-200
              ${day === null ? 'invisible' : ''}
              ${day === date.date() && currentMonthDayjs.isSame(date, 'month') && currentMonthDayjs.isSame(date, 'year')
                                ? 'bg-[var(--primary-green)] text-white shadow-md' // Selected day
                                : 'hover:bg-[#d7ffe9] hover:text-[]' // Hovevar(--primary-green)r
                            }
              ${isDayDisabled(day) ? 'text-gray-400 cursor-not-allowed opacity-50' : ''}
            `}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- DatePickerModal Component ---
interface DatePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: dayjs.Dayjs) => void;
    initialDate: dayjs.Dayjs | null;
    minDate: dayjs.Dayjs;
    maxDate: dayjs.Dayjs;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ isOpen, onClose, onConfirm, initialDate, minDate, maxDate }) => {
    const [tempSelectedDate, setTempSelectedDate] = useState<dayjs.Dayjs>(initialDate || dayjs());
    const [currentView, setCurrentView] = useState<'year' | 'month' | 'day'>('year'); // Start with year selection

    const modalRef = useRef<HTMLDivElement>(null);

    // Effect to handle body scroll and outside click
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Disable scroll
            const handleClickOutside = (event: MouseEvent) => {
                if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                    onClose();
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.body.style.overflow = ''; // Re-enable scroll
            };
        } else {
            document.body.style.overflow = ''; // Ensure scroll is re-enabled if modal closes otherwise
        }
    }, [isOpen, onClose]);

    const handleSelectYear = useCallback((year: number) => {
        setTempSelectedDate(tempSelectedDate.year(year));
        setCurrentView('month');
    }, [tempSelectedDate]);

    const handleSelectMonth = useCallback((monthIndex: number) => {
        setTempSelectedDate(tempSelectedDate.month(monthIndex));
        setCurrentView('day');
    }, [tempSelectedDate]);

    const handleSelectDay = useCallback((dayjsObject: dayjs.Dayjs) => {
        setTempSelectedDate(dayjsObject);
    }, []);

    const handleOk = (): void => {
        onConfirm(tempSelectedDate);
        setCurrentView('year')
        onClose();
    };

    const handleCancel = (): void => {
        onClose();
        setCurrentView('year')
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 rounded-xl">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-2xl w-full max-w-[300px] flex flex-col relative"
                style={{ height: '525px' }}
            >
                {/* Header */}
                <div className="p-4 bg-[var(--primary-green)] text-white text-opacity-80 rounded-t-xl">
                    <div className="text-2xl font-bold">
                        {tempSelectedDate.format('DD MMMM BBBB')} {/* Show current selection in Thai Buddhist */}
                    </div>
                </div>

                <div className="p-4">
                    <div
                        onClick={() => {
                            if (currentView == 'month' || currentView == 'day') {
                                setCurrentView('year')
                            } else if (currentView == 'year') {
                                setCurrentView('month')
                            }
                        }}
                        className="flex flex-start items-center gap-3 w-full"
                    >
                        <span>
                            {thaiMonths[tempSelectedDate.month()]} {gregorianYearToBuddhistYear(tempSelectedDate.year())}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>

                {/* View Content - Added flex-grow and overflow-auto for consistent height */}
                <div className="flex-grow overflow-auto">
                    {currentView === 'year' && (
                        <YearPicker
                            selectedYear={tempSelectedDate.year()}
                            onSelectYear={handleSelectYear}
                            minYear={gregorianYearToBuddhistYear(minDate.year())} // Pass BE years for display
                            maxYear={gregorianYearToBuddhistYear(maxDate.year())} // Pass BE years for display
                        />
                    )}
                    {currentView === 'month' && (
                        <MonthPicker
                            selectedMonth={tempSelectedDate.month()}
                            selectedYear={tempSelectedDate.year()}
                            onSelectMonth={handleSelectMonth}
                        />
                    )}
                    {currentView === 'day' && (
                        <DayPicker
                            date={tempSelectedDate}
                            onSelectDay={handleSelectDay}
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end p-3 border-t border-gray-200 space-x-2">
                    <button
                        type='button'
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-lg text-[var(--primary-green)] font-medium hover:bg-blue-50 transition-colors duration-200 text-sm"
                    >
                        CANCEL
                    </button>
                    <button
                        type='button'
                        onClick={handleOk}
                        className="px-4 py-2 rounded-lg bg-[var(--primary-green)] text-white font-medium shadow-md transition-colors duration-200 text-sm"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div >
    );
};

const ThaiCustomDatePicker: React.FC<ThaiDatePickerProps> = ({ label, error, onSet, placeholder }) => {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const minDateGregorian: dayjs.Dayjs = dayjs('1925-01-01');

    const maxDateGregorian: dayjs.Dayjs = dayjs();

    const handleConfirmDate = (date: dayjs.Dayjs): void => {
        onSet(date.format('MM-DD-YYYY') || '')
        setSelectedDate(date);
        console.log("Selected Date (Gregorian):", date.format('MM-DD-YYYY'));
    };

    return (
        <div className='flex align-center justify-center w-full min-h-sreen'>
            <div className="text-left flex flex-col gap-[8px] pb-[16px]">

                <input
                    id="date-input"
                    type="text"
                    readOnly
                    value={selectedDate ? selectedDate.format('DD MMMM BBBB') : ''}
                    onClick={() => setIsModalOpen(true)}
                    className={`w-full px-4 py-2 text-sm bg-[#F8F7F5] rounded-md focus:outline-none text-gray-800 cursor-pointer ${error ? "border border-[#ff0000]" : "border border-[var(--primary-green)]"}`}
                    placeholder={placeholder}
                />
                {error && <span className="text-[#ff0000] text-[13px]">{error}</span>}

                {/* DatePicker Modal */}
                <DatePickerModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmDate}
                    initialDate={selectedDate || dayjs()}
                    minDate={minDateGregorian}
                    maxDate={maxDateGregorian}
                />
            </div>
        </div>
    );
};

export default ThaiCustomDatePicker;