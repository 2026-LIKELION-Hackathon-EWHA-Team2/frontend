import { useEffect, useState } from 'react';

// 증상 입력 화면의 "증상 시작일" 드롭다운 + 캘린더 팝업
// value: 'YYYY.MM.DD' 형식 문자열, onChange(value)

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// 오늘 날짜를 'YYYY.MM.DD' 형식으로 반환
const getTodayString = () => {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${today.getFullYear()}.${pad(today.getMonth() + 1)}.${pad(today.getDate())}`;
};

const DateDropdown = ({ label, value, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [y, m] = value.split('.').map(Number);
      return new Date(y, (m || 1) - 1, 1);
    }
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // 부모(store)에서 넘어온 value가 비어있으면 오늘 날짜로 채워서 올려보냄
  useEffect(() => {
    if (!value) onChange(getTodayString());
  }, [value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selectedDay = value ? Number(value.split('.')[2]) : null;
  const isSelectedMonth = value && Number(value.split('.')[1]) === month + 1 && Number(value.split('.')[0]) === year;

  const pad = (n) => String(n).padStart(2, '0');

  const handleSelectDay = (day) => {
    onChange(`${year}.${pad(month + 1)}.${pad(day)}`);
    setOpen(false);
  };

  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long' }).toLowerCase();

  const moveMonth = (delta) => setViewDate(new Date(year, month + delta, 1));

  return (
    <div className={`relative flex flex-col ${className}`}>
      {label && (
        <label className="mb-2 text-[#181818] font-wantedsans text-[0.75rem] font-bold leading-normal">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 w-full items-center justify-between rounded-[0.375rem] border bg-white px-2 py-2
          text-[#181818] font-wantedsans text-[0.625rem] font-medium leading-normal hover:border-[#6B5DD6] ${
            open ? 'border-[#6B5DD6]' : 'border-[#DADADA]'
          }`}
      >
        <span className='flex gap-2 items-center'>
          <img src="/icons/calendar-icon.svg" alt="" className="h-4 w-4" />
        {value}
        </span>
        <img src="/icons/calendar-down.svg" alt="" className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-[3.5rem] z-30 w-full rounded-[0.625rem] border border-[#EDEDF1] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => moveMonth(-1)} className="p-1">
              <img src="/icons/arrow-left-small.svg" alt="이전달" className="h-3 w-3" />
            </button>
            <span className="font-wantedsans text-sm font-bold text-[#181818]">
            {monthName} {year}
            </span>
            <button type="button" onClick={() => moveMonth(1)} className="p-1">
              <img src="/icons/arrow-right-small.svg" alt="다음달" className="h-3 w-3" />
            </button>
          </div>
          <div className="mb-1 grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((d) => (
              <span key={d} className="font-wantedsans text-[0.5625rem] font-medium text-[#9F9F9F]">
                {d}
              </span>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const active = isSelectedMonth && selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full font-wantedsans text-xs ${
                    active ? 'bg-[#6B5DD6] text-white' : 'text-[#333333] hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateDropdown;