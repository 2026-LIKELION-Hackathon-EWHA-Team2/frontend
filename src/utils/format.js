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


// 전화번호: 숫자만 입력받아서 010-1234-5678 형태로 자동 포맷
// 국제번호(+81 등)도 고려해서 앞에 '+'는 그대로 유지 -> 음 근데 생각해보니까... 나라마다 양식이 달라서

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