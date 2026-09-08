// 환자 - AI 병원 매칭 / 네트워크 병원 직접 둘러보기 관련 쿼리
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  createMatchRequestApi,
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
