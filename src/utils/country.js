// 병원 국가 코드(ISO 3166-1 alpha-2) -> 화면 표시용 국가명

const COUNTRY_NAMES = {
  KR: '대한민국',
  JP: '일본',
};

export const getCountryName = (code) => COUNTRY_NAMES[code] ?? code;
