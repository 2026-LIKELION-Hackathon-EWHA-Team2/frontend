// [어흥콘 리팩토링] 구글 Places API를 REST로 직접 호출
// REST API를 직접 fetch로 호출하고 목록 UI는 우리가 직접 그리는 방식을 이용해서
// 회원가입 페이지에서 주소 검색 기능을 구현했습니다!

const PLACES_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';

// 입력한 텍스트로 주소 후보 목록 조회
export const fetchAddressSuggestions = async (input, regionCodes) => {
  const res = await fetch(AUTOCOMPLETE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_API_KEY,
    },
    body: JSON.stringify({
      input,
      includedRegionCodes: regionCodes, // ['kr','jp','us','cn'] - 거주 국가 선택지랑 맞춤
    }),
  });
  if (!res.ok) throw new Error('주소 검색에 실패했습니다.');
  const data = await res.json();
  return (data.suggestions ?? []).map((s) => ({
    placeId: s.placePrediction.placeId,
    text: s.placePrediction.text.text,
  }));
};

// 선택한 placeId로 상세 정보(포맷된 주소, 좌표) 조회
export const fetchPlaceDetail = async (placeId) => {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': PLACES_API_KEY,
      'X-Goog-FieldMask': 'formattedAddress,location',
    },
  });
  if (!res.ok) throw new Error('주소 상세 조회에 실패했습니다.');
  const data = await res.json();
  return {
    formattedAddress: data.formattedAddress,
    latitude: data.location?.latitude,
    longitude: data.location?.longitude,
  };
};

// 위도/경도를 소수점 7자리로 반올림 
// (구글맵은 15자리까지 가능한데, 백엔드 규칙이 7자리라 오류날까봐 제약 걸어놨어용)
export const roundCoordinate = (value) => Math.round(value * 1e7) / 1e7;
