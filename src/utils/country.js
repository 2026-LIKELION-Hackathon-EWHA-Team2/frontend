// 병원 국가 코드(ISO 3166-1 alpha-2) -> 화면 표시용 국가명

const COUNTRY_NAMES = {
  KR: '대한민국',
  JP: '일본',
};

export const getCountryName = (code) => COUNTRY_NAMES[code] ?? code;

// 새롭게 추가해서 해부쟈... ㅠ
export const inferPreferredLanguage = (countryCityText = '') => {
  const text = countryCityText.toLowerCase();
  if (text.includes('일본') || text.includes('japan')) return 'ja';
  if (text.includes('한국') || text.includes('대한민국') || text.includes('korea')) return 'ko';
  return 'ko';
};
