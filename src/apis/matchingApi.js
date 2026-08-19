import axiosInstance from './axiosInstance';

// 매칭 요청 생성 및 AI 병원 추천
// POST /api/matching/requests/
// body: { symptom_case, location_source, specialty_weight, distance_weight, collaboration_weight }
// symptom_case는 본인의 SUBMITTED 상태 증상 케이스 ID여야 함. 세 가중치가 모두 0일 수 없음
// AI 분석·추천이 동기 처리라 응답이 느릴 수 있음. 성공하면 symptom_case 상태가 MATCHING으로 변경됨
// 조건에 맞는 병원이 없어도 요청 자체는 성공(recommendations: [])할 수 있음
// location_source: 'PROFILE'만 사용 (환자 프로필에 residence_country/latitude/longitude 등록 필요) - 'CUSTOM'은 후순위라 미구현
export const createMatchRequestApi = (body) =>
  axiosInstance.post('/api/matching/requests/', body).then((res) => res.data);

// 매칭 요청 상세 조회
// GET /api/matching/requests/{match_request_id}/
// 본인 매칭 요청만 조회 가능. 추천 병원 목록은 응답에 포함되지 않음 (아래 getMatchRecommendationsApi로 따로 조회)
export const getMatchRequestDetailApi = (matchRequestId) =>
  axiosInstance.get(`/api/matching/requests/${matchRequestId}/`).then((res) => res.data);

// 프론트 sortOrder(useHospitalMatchStore) -> 백엔드 sort 쿼리 파라미터 값 변환
const SORT_PARAM_MAP = {
  distance: 'distance',
  experience: 'collaboration',
  department: 'diagnosis',
  recommended: 'recommended',
};

// 추천 병원 목록 조회
// GET /api/matching/requests/{match_request_id}/recommendations/?sort=...
// sort 생략 시 백엔드 기본값 'recommended'(AI 추천 순위순) 사용. 필터링/페이지네이션 미지원
// 응답 배열이 이미 sort 기준으로 정렬돼 있으므로, 프론트에서 rank_number/total_score로 다시
// 정렬하면 안 됨(문서 경고) - 받은 순서 그대로 렌더링해야 함
export const getMatchRecommendationsApi = (matchRequestId, sortOrder) =>
  axiosInstance
    .get(`/api/matching/requests/${matchRequestId}/recommendations/`, {
      params: sortOrder ? { sort: SORT_PARAM_MAP[sortOrder] ?? sortOrder } : undefined,
    })
    .then((res) => res.data);

// 네트워크 병원 목록 조회 (AI 매칭을 거치지 않고 직접 둘러보는 일본 협력 병원 목록)
// GET /api/matching/network-hospitals/?sort=distance|collaboration
// sort는 distance/collaboration만 지원 (전문 분야 일치순은 없음 - 백엔드 요청으로 프론트에서도 이미 제거함)
export const getNetworkHospitalsApi = (sortOrder) =>
  axiosInstance
    .get('/api/matching/network-hospitals/', {
      params: sortOrder ? { sort: SORT_PARAM_MAP[sortOrder] ?? sortOrder } : undefined,
    })
    .then((res) => res.data);

// 네트워크 병원 상세 조회
// GET /api/matching/network-hospitals/{hospital_id}/
// 응답 형태는 목록 조회의 병원 객체와 동일
export const getNetworkHospitalDetailApi = (hospitalId) =>
  axiosInstance.get(`/api/matching/network-hospitals/${hospitalId}/`).then((res) => res.data);

// 네트워크 병원 선택 (AI 매칭 없이 직접 고른 병원을 협진 상대로 확정)
// POST /api/matching/network-hospitals/{hospital_id}/select/
// body: { symptom_case_id }
// 서버가 내부적으로 match_request/recommendation을 새로 만들어서, 이후 흐름(동의 등)이
// AI 추천 병원 선택(selectMatchRecommendationApi) 때와 동일하게 이어짐 - selection_source만 'NETWORK'
export const selectNetworkHospitalApi = (hospitalId, symptomCaseId) =>
  axiosInstance
    .post(`/api/matching/network-hospitals/${hospitalId}/select/`, { symptom_case_id: symptomCaseId })
    .then((res) => res.data);

// 추천 병원 선택 (협진 상대 병원으로 확정)
// POST /api/matching/recommendations/{recommendation_id}/select/
// URL에는 hospital_id가 아니라 recommendation_id를 사용해야 함. body 없음
// 성공하면 match_request.status가 SELECTED로, 증상 Case 상태가 HOSPITAL_SELECTED로 바뀌고
// 기존 매칭 동의 4개 항목 + agreed_at이 서버에서 전부 초기화됨 (재선택 시에도 동일)
export const selectMatchRecommendationApi = (recommendationId) =>
  axiosInstance.post(`/api/matching/recommendations/${recommendationId}/select/`).then((res) => res.data);

// 선택 병원 매칭 동의
// PATCH /api/matching/requests/{match_request_id}/consent/
// agreements: Step4Consent(매칭)의 CONSENT_ITEMS 키 그대로 전달 { provide, scope, purpose, withdraw }
// 네 항목 중 하나라도 false/누락이면 서버가 동의를 저장하지 않음. 의료정보를 병원에 최종 전송하는 건 아님
export const consentMatchRequestApi = (matchRequestId, agreements) =>
  axiosInstance
    .patch(`/api/matching/requests/${matchRequestId}/consent/`, {
      personal_information_provision_agreed: agreements.provide,
      information_items_purpose_confirmed: agreements.scope,
      medical_consultation_use_agreed: agreements.purpose,
      withdrawal_right_confirmed: agreements.withdraw,
    })
    .then((res) => res.data);
