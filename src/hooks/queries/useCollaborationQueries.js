// 병원측 - 협진 요청(수신 Case, 협진 요청 목록/상세, 대시보드) 관련 쿼리

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../../store/useAuthStore';
import {
  getReceivedCaseTransfersApi,
  getReceivedCaseTransferDetailApi,
  getCollaborationRequestListApi,
  getCollaborationRequestDetailApi,
  acceptCollaborationRequestApi,
  getHospitalDashboardApi,
} from '../../apis/caseApi';
import {
  mapReceivedCaseTransferDetail,
  mapCollaborationRequest,
  mapCollaborationRequestDetail,
} from '../../mappers/collaborationMapper';
import { useHospitalProfileQuery } from './useUserQueries';

// 협진 병원 수신 Case 목록 (아직 연결된 화면 없음)
export const useReceivedCaseTransfersQuery = () =>
  useQuery({
    queryKey: ['receivedCaseTransfers'],
    queryFn: () => getReceivedCaseTransfersApi().then((list) => list.map(mapReceivedCaseTransferDetail)),
  });

// 협진 병원 수신 Case 상세 (아직 연결된 화면 없음 - PatientDetailPage는 협진 요청 상세 API를 씀)
export const useReceivedCaseTransferDetailQuery = (transferId) =>
  useQuery({
    queryKey: ['receivedCaseTransferDetail', transferId],
    enabled: !!transferId,
    queryFn: () => getReceivedCaseTransferDetailApi(transferId).then(mapReceivedCaseTransferDetail),
  });

// 협진 Case 목록 - 케이스 조회/병원 홈/채팅 목록에서 공통으로 사용
export const useConsultPatientsQuery = () => {
  const { data: profile } = useHospitalProfileQuery();
  const hospitalId = useAuthStore((state) => state.hospitalId);
  return useQuery({
    queryKey: ['consultPatients', hospitalId],
    // hospitalId가 없어도(로그인 응답에 hospital_id가 안 내려오는 경우 등) 목록 자체는 떠야 하니
    // enabled는 profile만 보도록!! hospitalId는 canAccept 비교용으로만 사용
    enabled: !!profile,
    queryFn: () =>
      getCollaborationRequestListApi().then((list) =>
        list.map((item) => mapCollaborationRequest(item, hospitalId))
      ),
  });
};

// 병원 대시보드 - today_summary는 '오늘' 발생/전환된 건수라 전체 누적 건수와 다름에 유의
export const useHospitalDashboardQuery = () => {
  const { data: profile } = useHospitalProfileQuery();
  const hospitalId = useAuthStore((state) => state.hospitalId);
  return useQuery({
    queryKey: ['hospitalDashboard', hospitalId],
    enabled: !!profile,
    queryFn: () =>
      getHospitalDashboardApi().then((data) => ({
        todaySummary: data.today_summary,
        totalUnreadCount: data.total_unread_count,
        ongoingCollaborations: data.ongoing_collaborations.map((item) =>
          mapCollaborationRequest(item, hospitalId)
        ),
      })),
  });
};

// 협진 요청 상세 - ConsultRequestDetail.jsx / PatientDetailPage.jsx 공용
export const useCollaborationRequestDetailQuery = (collaborationRequestId) =>
  useQuery({
    queryKey: ['collaborationRequestDetail', collaborationRequestId],
    enabled: !!collaborationRequestId,
    queryFn: () =>
      getCollaborationRequestDetailApi(collaborationRequestId).then(mapCollaborationRequestDetail),
  });

// 협진 요청 수락 - ConsultRequestDetail.jsx '협진 시작하기' 클릭 시 호출
export const useAcceptCollaborationRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collaborationRequestId) => acceptCollaborationRequestApi(collaborationRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultPatients'] });
      queryClient.invalidateQueries({ queryKey: ['collaborationRequestDetail'] });
    },
  });
};
