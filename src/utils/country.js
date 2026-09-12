// 병원 국가 코드(ISO 3166-1 alpha-2) -> 화면 표시용 국가명

const COUNTRY_NAMES = {
  KR: '대한민국',
  JP: '일본',
  US: '미국',
  CN: '중국',
};

export const getCountryName = (code) => COUNTRY_NAMES[code] ?? code;

/*
 * [어흥콘 리팩토링] 회원가입 '거주 국가' 선택 기능에서 쓰는 코드!
 * 위치 API를 연동하기 위해선 거주 국가 코드를 필수로 사용해야 하는데,
 * 회원가입 창에서 대한민국을 KR과 같은 코드로 변환하는 로직이 필요해서 여기 넣었습니당
 * 실제로 코드로 변환해서 서버에 보내는 부분은 SignupPage.jsx에...
 */
const COUNTRY_CODES = {
  대한민국: 'KR',
  일본: 'JP',
  미국: 'US',
  중국: 'CN',
};

export const getCountryCode = (name) => COUNTRY_CODES[name] ?? name;

// 회원가입 "거주 국가" 드롭다운에 보여줄 선택지 4개 - COUNTRY_CODES의 키를 그대로 씀
// (지원 국가가 늘어나면 COUNTRY_NAMES/COUNTRY_CODES 딱 두 곳만 고치면 여기도 자동으로 늘어남)
export const RESIDENCE_COUNTRY_OPTIONS = Object.keys(COUNTRY_CODES);

// [어흥콘 리팩토링] 국가 코드 미국, 중국 추가
export const inferPreferredLanguage = (countryCityText = '') => {
  const text = countryCityText.toLowerCase();
  if (text.includes('일본') || text.includes('japan')) return 'ja';
  if (text.includes('한국') || text.includes('대한민국') || text.includes('korea')) return 'ko';
  if (text.includes('미국') || text.includes('usa') || text.includes('united states')) return 'en';
  if (text.includes('중국') || text.includes('china')) return 'zh';
  return 'ko';
};
