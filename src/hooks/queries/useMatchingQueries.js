// 환자 - AI 병원 매칭 / 네트워크 병원 직접 둘러보기 관련 쿼리
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  createMatchRequestApi,
  getMatchRequestDetailApi,
  getMatchRecommendationsApi,
  getNetworkHospitalsApi,
  getNetworkHospitalDetailApi,
  selectMatchRecommendationApi,
  selectNetworkHospitalApi,
  consentMatchRequestApi,
} from '../../apis/matchingApi';

// 매칭 요청 생성 및 AI 병원 추천 - Step1Setting '전송하기' 클릭 시 호출
// 응답에 추천 병원 목록이 함께 오므로, 별도 목록 조회 API 없이 이 결과를 store에 그대로 저장해서 씀
export const useCreateMatchRequestMutation = () =>
  useMutation({
    mutationFn: (body) => createMatchRequestApi(body),
  });

// 매칭 요청 상세 조회 (재진입/새로고침 시 상태 복구용 - 아직 페이지에서 쓰지 않음)
// useHospitalMatchStore에 persist가 없어서 새로고침하면 matchRequestId 자체가 날아가므로
// 지금 구조에선 이 훅으로 복구할 상황 자체가 안 생김 (store에 persist 추가하면 그때 활용)
export const useMatchRequestDetailQuery = (matchRequestId) =>
  useQuery({
    queryKey: ['matchRequestDetail', matchRequestId],
    enabled: !!matchRequestId,
    queryFn: () => getMatchRequestDetailApi(matchRequestId),
  });

// 추천 병원 목록 조회 - sortOrder는 useHospitalMatchStore의 sortOrder 값('distance'|'experience'|'department')
// 그대로 넘기면 됨 (백엔드 sort 파라미터 변환은 getMatchRecommendationsApi 내부에서 처리)
// 응답이 이미 정렬되어 있으므로 이 훅이 반환하는 recommendations 배열 순서를 그대로 렌더링해야 함
export const useMatchRecommendationsQuery = (matchRequestId, sortOrder) =>
  useQuery({
    queryKey: ['matchRecommendations', matchRequestId, sortOrder],
    enabled: !!matchRequestId,
    queryFn: () => getMatchRecommendationsApi(matchRequestId, sortOrder),
  });

// 추천 병원 선택 - Step3Detail '이 병원으로 매칭 신청' 클릭 시 호출
export const useSelectMatchRecommendationMutation = () =>
  useMutation({
    mutationFn: (recommendationId) => selectMatchRecommendationApi(recommendationId),
  });

// 선택 병원 매칭 동의 - Step4Consent(매칭) '전송하기' 클릭 시 호출
export const useConsentMatchRequestMutation = () =>
  useMutation({
    mutationFn: ({ matchRequestId, agreements }) => consentMatchRequestApi(matchRequestId, agreements),
  });

// 네트워크 병원 목록 조회 (AI 매칭 없이 직접 둘러보는 화면) - sortOrder는 'distance'|'experience'만 사용
export const useNetworkHospitalsQuery = (sortOrder) =>
  useQuery({
    queryKey: ['networkHospitals', sortOrder],
    queryFn: () => getNetworkHospitalsApi(sortOrder),
  });

// 네트워크 병원 상세 조회 - NetworkDetailPage 전용 (목록과 응답 형태가 같아서 매핑 로직 공유 가능)
export const useNetworkHospitalDetailQuery = (hospitalId) =>
  useQuery({
    queryKey: ['networkHospitalDetail', hospitalId],
    enabled: !!hospitalId,
    queryFn: () => getNetworkHospitalDetailApi(hospitalId),
  });

// 네트워크 병원 선택 - NetworkDetailPage '이 병원으로 매칭 신청' 클릭 시 호출
// 응답에 match_request_id/recommendation_id가 새로 생겨서, AI 매칭 선택 때와 동일하게 store에 저장하면 됨
export const useSelectNetworkHospitalMutation = () =>
  useMutation({
    mutationFn: ({ hospitalId, symptomCaseId }) => selectNetworkHospitalApi(hospitalId, symptomCaseId),
  });
