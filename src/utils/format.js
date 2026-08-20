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
// 입력이 비어있으면 null을 반환으로 수정
export const toApiDateFormat = (displayValue) =>
  displayValue ? displayValue.replaceAll('.', '-') : null;

// 'YYYY.MM.DD'가 완성된 형태인지 체크 (8자리 숫자 다 채워졌는지)
export const isBirthDateComplete = (value) => value.replace(/[^0-9]/g, '').length === 8;

// 화면 표시용 성별('여성'/'남성'/'기타') → 백엔드로 보낼 코드('FEMALE'/'MALE'/'OTHER')로 변환
const GENDER_API_MAP = { 여성: 'FEMALE', 남성: 'MALE', 기타: 'OTHER' };
// 미선택 null을 반환!
export const toApiGender = (displayValue) => (displayValue ? GENDER_API_MAP[displayValue] ?? displayValue : null);


// 전화번호: 숫자만 입력받아서 010-1234-5678 형태로 자동 포맷
// 국제번호(+81 등)도 고려해서 앞에 '+'는 그대로 유지 -> 음 근데 생각해보니까... 나라마다 양식이 달라서

// 항상 일단 한국/일본 표준시로 변환 진행
// 국제 표준시 +9 
const KST_TIME_ZONE = 'Asia/Seoul';

const getKstParts = (isoString) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KST_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23', // hour12: false만 쓰면 일부 환경에서 자정이 '24:00'으로 나오는 이슈가 있어서 h23로 고정해둘게요!!
  }).formatToParts(date);

  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
};

// ISO datetime 문자열을 KST 기준 화면 표시용 'YYYY.MM.DD'로 변환
export const formatDateOnly = (isoString) => {
  if (!isoString) return '';
  const p = getKstParts(isoString);
  return p ? `${p.year}.${p.month}.${p.day}` : '';
};

// ISO datetime 문자열을 KST 기준 화면 표시용 'YYYY.MM.DD HH:mm'로 변환 (초는 생략)
export const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const p = getKstParts(isoString);
  return p ? `${p.year}.${p.month}.${p.day} ${p.hour}:${p.minute}` : '';
};

// 백엔드가 상대경로(예: 'media/symptom_images/2026/08/19/example.jpg')로 내려주는 미디어 파일 경로를
// 절대 URL로 변환. 이미 절대 URL이면 그대로 둠. 경로 자체에 'media/'가 이미 포함돼 있어서 따로 붙이지 않음
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://borderlesslion-front.vercel.app/api';
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