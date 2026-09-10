// 병원 국가 코드(ISO 3166-1 alpha-2) -> 화면 표시용 국가명

const COUNTRY_NAMES = {
  KR: '대한민국',
  JP: '일본',
  US: '미국',
  CN: '중국',
};

export const getCountryName = (code) => COUNTRY_NAMES[code] ?? code;

// [어흥콘 리팩토링] 국가 코드 미국, 중국 추가
export const inferPreferredLanguage = (countryCityText = '') => {
  const text = countryCityText.toLowerCase();
  if (text.includes('일본') || text.includes('japan')) return 'ja';
  if (text.includes('한국') || text.includes('대한민국') || text.includes('korea')) return 'ko';
  if (text.includes('미국') || text.includes('usa') || text.includes('united states')) return 'en';
  if (text.includes('중국') || text.includes('china')) return 'zh';
  return 'ko';
};
