/*
 * [어흥콘 리팩토링] hooks/useMockQueries.js에서 협진 최종 합의안 관련 훅만 분리했어요.
 * -> "합의안이 수정되면 상대 병원 검토가 초기화되고, 양쪽 다 최신 버전을 검토완료해야 최종
 *   확정된다"는 판단 로직 자체는 프론트가 아니라 백엔드가 계산해서 status/requiresReReview 값으로 내려줘요. 
 *   이 훅들은 그 값을 그대로 받아오기만 합니다!
 *   실제로 화면에 어떻게 반영되는지는 ConsultAgreementPage.jsx의 재검토 안내 배너 부분 주석 참고하시면 됩니다
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAgreementDetailApi,
  updateAgreementApi,
  reviewAgreementApi,
  generateAgreementApi,
} from '../../apis/caseApi';
import { mapAgreementDetail } from '../../mappers/agreementMapper';

// 합의안 상세 - 아직 생성된 합의안이 없으면 AI 초안 생성 API를 대신 호출
export const useAgreementDetailQuery = (caseId, roomId) =>
  useQuery({
    queryKey: ['agreementDetail', caseId, roomId],
    enabled: !!caseId && !!roomId,
    queryFn: () =>
      getAgreementDetailApi(caseId, roomId)
        .then(mapAgreementDetail)
        .catch((err) => {
          if (err.response?.status === 404) {
            return generateAgreementApi(caseId, roomId).then(mapAgreementDetail);
          }
          throw err;
        }),
  });

// 합의안 수정 (판단 내용/주요 근거/추가 소견 중 변경된 필드만 전달)
export const useUpdateAgreementMutation = (caseId, roomId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fields) => updateAgreementApi(caseId, roomId, fields),
    onSuccess: (data) => {
      queryClient.setQueryData(['agreementDetail', caseId, roomId], mapAgreementDetail(data));
    },
  });
};

// 합의안 검토 완료 / 최종 확정 - primary_action.code가 REVIEW/FINALIZE일 때 공통으로 호출
export const useReviewAgreementMutation = (caseId, roomId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => reviewAgreementApi(caseId, roomId),
    onSuccess: (data) => {
      queryClient.setQueryData(['agreementDetail', caseId, roomId], (old) => ({
        ...old,
        ...mapAgreementDetail(data),
      }));
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['collaborationRequestDetail'] });
      queryClient.invalidateQueries({ queryKey: ['hospitalDashboard'] });
    },
  });
};
