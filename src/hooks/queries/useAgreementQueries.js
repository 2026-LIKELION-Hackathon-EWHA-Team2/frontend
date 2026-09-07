// 협진 최종 합의서 관련 쿼리

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
