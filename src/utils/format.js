// 입력값 자동 포맷팅 유틸 (생년월일 '.', 전화번호 - )

// 생년월일: 숫자만 입력받아서 YYYY.MM.DD 형태로 자동 포맷

export const formatBirthDate = (value) => {
  const digits = value.replace(/[^0-9]/g, '').slice(0, 8); // 숫자만 남기고 최대 8자리(YYYYMMDD)

  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
};

// 화면 표시용 'YYYY.MM.DD' → 백엔드로 보낼 'YYYY-MM-DD' 형식으로 변환
// birth_date 필드는 API 스펙상 하이픈 형식이라 전송 직전에 변환 필요!
export const toApiDateFormat = (displayValue) => displayValue.replaceAll('.', '-');

// 'YYYY.MM.DD'가 완성된 형태인지 체크 (8자리 숫자 다 채워졌는지)
export const isBirthDateComplete = (value) => value.replace(/[^0-9]/g, '').length === 8;

// 화면 표시용 성별('여성'/'남성'/'기타') → 백엔드로 보낼 코드('FEMALE'/'MALE'/'OTHER')로 변환
const GENDER_API_MAP = { 여성: 'FEMALE', 남성: 'MALE', 기타: 'OTHER' };
export const toApiGender = (displayValue) => GENDER_API_MAP[displayValue] ?? displayValue;


// 전화번호: 숫자만 입력받아서 010-1234-5678 형태로 자동 포맷
// 국제번호(+81 등)도 고려해서 앞에 '+'는 그대로 유지 -> 음 근데 생각해보니까... 나라마다 양식이 달라서

// ISO datetime 문자열('2026-08-15T05:00:00Z')을 화면 표시용 'YYYY.MM.DD'로 변환
export const formatDateOnly = (isoString) => (isoString ? isoString.slice(0, 10).replaceAll('-', '.') : '');

// ISO datetime 문자열을 화면 표시용 'YYYY.MM.DD HH:mm'로 변환 (초/타임존 표기는 생략)
export const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const [date, time] = isoString.split('T');
  return `${date.replaceAll('-', '.')} ${time?.slice(0, 5) ?? ''}`.trim();
};

// 백엔드가 상대경로(예: 'media/symptom_images/2026/08/19/example.jpg')로 내려주는 미디어 파일 경로를
// 절대 URL로 변환. 이미 절대 URL이면 그대로 둠. 경로 자체에 'media/'가 이미 포함돼 있어서 따로 붙이지 않음
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const resolveMediaUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export const formatPhoneNumber = (value) => {
  const hasPlus = value.trim().startsWith('+');
  const digits = value.replace(/[^0-9]/g, '').slice(0, 15); // 숫자만, 최대 15자리

  let formatted = digits;
  if (digits.length > 3 && digits.length <= 7) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else if (digits.length > 7) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  return hasPlus ? `+${formatted}` : formatted;
};