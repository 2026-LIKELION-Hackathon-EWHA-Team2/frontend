/*
 * [어흥콘 리팩토링] hooks/useMockQueries.js에서 케이스를 병원으로 전송하는 흐름과 시술 이력
 * (여권)' 관련 훅만 분리했어요.
 * -> useCaseTransferDetailQuery는 예전엔 만들어만 두고 아무 화면도 안 부르던 훅이었는데,
 *   CaseSyncPage 새로고침 복구 기능을 만들면서 실제로 연결했어요. 
 *   어떻게 쓰는지는 CaseSyncPage.jsx의 복구 로직 주석 참고하시면 됩니다!!
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCaseTransferApi,
  reviewCaseTransferApi,
  sendCaseTransferApi,
  getCaseTransferDetailApi,
  getProcedureHistoryListApi,
  getProcedureHistoryDetailApi,
} from '../../apis/caseApi';
import { mapProcedureHistory, mapProcedureHistoryDetail } from '../../mappers/caseTransferMapper';

// Case 전송 건 생성 - 성공 시 REVIEW_REQUIRED 상태의 CaseTransfer 반환 (병원에 바로 전송되는 건 아님)
export const useCreateCaseTransferMutation = () =>
  useMutation({
    mutationFn: (body) => createCaseTransferApi(body),
  });

// Case 전송 검토 및 필수 동의 - CaseSyncPage '전송하기' 클릭 시 send와 순서대로 호출됨
// 성공하면 캐시된 상세(useCaseTransferDetailQuery)도 최신 상태로 갱신
export const useReviewCaseTransferMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transferId, agreements }) => reviewCaseTransferApi(transferId, agreements),
    onSuccess: (data) => {
      queryClient.setQueryData(['caseTransferDetail', data.id], data);
    },
  });
};

// Case 최종 전송 - review로 READY_TO_TRANSFER 확인된 뒤에만 호출해야 함 (CaseSyncPage 참고)
export const useSendCaseTransferMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transferId) => sendCaseTransferApi(transferId),
    onSuccess: (data) => {
      queryClient.setQueryData(['caseTransferDetail', data.id], data);
    },
  });
};

// 환자 전송 Case 상세 - CaseSyncPage의 AI 검토/전송 동의/전송 완료 화면 재진입(새로고침) 시 상태 복구용!!
export const useCaseTransferDetailQuery = (transferId) =>
  useQuery({
    queryKey: ['caseTransferDetail', transferId],
    enabled: !!transferId,
    queryFn: () => getCaseTransferDetailApi(transferId),
  });

// 시술 이력 목록 (여권 페이지) - status COMPLETED만 반환됨
export const useProcedureHistoryQuery = () =>
  useQuery({
    queryKey: ['procedureHistory'],
    queryFn: () => getProcedureHistoryListApi().then((list) => list.map(mapProcedureHistory)),
  });

// 시술 이력 상세 + 최종 협진 합의안 (상세 화면, 인계서 화면 공통)
// COMPLETED + FINAL 조건을 만족하는 Case만 조회 가능, 그 외엔 404
export const useProcedureHistoryDetailQuery = (medicalCaseId) =>
  useQuery({
    queryKey: ['procedureHistoryDetail', medicalCaseId],
    enabled: !!medicalCaseId,
    queryFn: () => getProcedureHistoryDetailApi(medicalCaseId).then(mapProcedureHistoryDetail),
  });
