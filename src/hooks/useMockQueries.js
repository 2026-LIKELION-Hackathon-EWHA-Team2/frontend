import { useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import useAuthStore from '../store/useAuthStore';
import {
  MOCK_HANDOVER_DOCUMENT,
  MOCK_HOSPITAL_HOME, // ★ 다른 곳에서 안 쓰면 나중에 지워도 됨
  MOCK_CONSULT_REQUEST_DETAIL,
} from '../mock/mockdata';

import {
  loginApi,
  signupPatientApi,
  signupHospitalApi,
  getPatientProfileApi,
  getHospitalProfileApi,
  getHospitalListApi, // 요거 이제 추가!
} from '../apis/userApi'

import {
  createCaseTransferApi,
  reviewCaseTransferApi,
  sendCaseTransferApi,
  getUnsentCaseTransfersApi,
  getCaseTransferDetailApi,
  getProcedureHistoryListApi,
  getProcedureHistoryDetailApi,
  getReceivedCaseTransfersApi,
  getReceivedCaseTransferDetailApi,
  getCollaborationRequestListApi,
  getCollaborationRequestDetailApi,
  acceptCollaborationRequestApi,
  getAgreementDetailApi,
  updateAgreementApi,
  reviewAgreementApi,
  generateAgreementApi,
  getHospitalDashboardApi,
  getChatRoomListApi,
  getChatMessagesApi,
  sendChatMessageApi,
  markChatRoomReadApi,
} from '../apis/caseApi'
import { getCountryName } from '../utils/country'
import { formatDateOnly, formatDateTime, resolveMediaUrl } from '../utils/format'
import { createSymptomCaseApi, getSymptomCaseListApi } from '../apis/symptomCaseApi';
import {
  createMatchRequestApi,
  getMatchRequestDetailApi,
  getMatchRecommendationsApi,
  getNetworkHospitalsApi,
  getNetworkHospitalDetailApi,
  selectMatchRecommendationApi,
  selectNetworkHospitalApi,
  consentMatchRequestApi,
} from '../apis/matchingApi';
import {
  buildSymptomCaseFormData,
  normalizeSymptomCaseForHome,
  normalizeSymptomCaseForSelect,
} from '../utils/symptomCaseMapper';

const wait = (data, ms = 400) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

//accounts/api

// 로그인
export const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ userId, password }) => loginApi(userId, password),
  });

// 환자 회원가입
export const useSignupPatientMutation = () =>
  useMutation({
    mutationFn: (data) => signupPatientApi(data),
  });

// 병원 회원가입
export const useSignupHospitalMutation = () =>
  useMutation({
    mutationFn: (data) => signupHospitalApi(data),
  });

// 환자 프로필
export const usePatientProfileQuery = () =>
  useQuery({
    queryKey: ['patientProfile'],
    queryFn: () => getPatientProfileApi(),
  });

// 병원 프로필
export const useHospitalProfileQuery = () =>
  useQuery({
    queryKey: ['hospitalProfile'],
    queryFn: () => getHospitalProfileApi(),
  });

// 진단서 입력 화면 - Step4Certificate에서 '시술 받은 병원' 검색할 때 사용
// search 파라미터로 병원명 검색 가능 (안 넣으면 전체 조회)
export const useHospitalAccountsListQuery = (search = '') =>
  useQuery({
    queryKey: ['hospitalAccountsList', search], // search도 큐키에 포함 - 검색어 바뀔 때마다 재조회됨
    queryFn: () => getHospitalListApi(search),
  });

// ------------------------------------------------------------
// 환자측 cases api

// Case 전송 건 생성 - 성공 시 REVIEW_REQUIRED 상태의 CaseTransfer 반환 (병원에 바로 전송되는 건 아님)
// AI 매칭(useHospitalMatchStore의 selectedCaseId/selectedRecommendationId)이 이제 실제 값이라 호출 가능해짐
// 아직 CaseSyncPage 진입 시점에 이 mutation을 트리거하는 지점을 안 만들어서 페이지 연결은 남아있음
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

// 미전송 Case 목록 (아직 연결된 화면 없음 - 화면 나오면 훅 이름/쿼리키 조정 예정)
export const useUnsentCaseTransfersQuery = () =>
  useQuery({
    queryKey: ['unsentCaseTransfers'],
    queryFn: () => getUnsentCaseTransfersApi(),
  });

// 환자 전송 Case 상세 - CaseSyncPage의 AI 검토/전송 동의/전송 완료 화면 재진입 시 사용 예정
// (transferId는 '전송 건 생성' API 응답에서 받아 store에 저장해야 하는데, 그 API 연동 전이라 아직 실제 값이 없음.
// useConsultPatientDetailQuery와 동일하게 id 없으면 요청 자체를 막아둠)
export const useCaseTransferDetailQuery = (transferId) =>
  useQuery({
    queryKey: ['caseTransferDetail', transferId],
    enabled: !!transferId,
    queryFn: () => getCaseTransferDetailApi(transferId),
  });

// 백엔드 응답 -> MedicalPassportPage/ProcedureHistoryCard/ProcedureDetailPage가 쓰는 필드 형태로 변환
// (단순 이름만 다른 게 아니라 location 조합, date 구분자, id 문자열화처럼 값 자체를 가공해야 해서 매핑 필요)
const mapProcedureHistory = (item) => ({
  id: String(item.medical_case_id),
  name: item.procedure_name,
  tag: item.procedure_area,
  hospital: item.procedure_hospital_name,
  location: [item.procedure_hospital_city, getCountryName(item.procedure_hospital_country)]
    .filter(Boolean)
    .join(', '),
  date: item.procedure_date.replaceAll('-', '.'),
  relatedCaseId: item.case_number,
  status: item.status,
  finalizedAt: item.finalized_at,
});

// 시술 이력 목록 (여권 페이지) - status COMPLETED만 반환됨
export const useProcedureHistoryQuery = () =>
  useQuery({
    queryKey: ['procedureHistory'],
    queryFn: () => getProcedureHistoryListApi().then((list) => list.map(mapProcedureHistory)),
  });

// 백엔드 응답 -> ProcedureDetailPage/ConsultCard/ConsultHistoryPage가 쓰는 필드 형태로 변환
// case_number는 'CASE-2026-000015'처럼 접두어가 붙어있어서, ConsultCard가 자체적으로
// 'Case #'를 붙이는 것과 겹치지 않도록 접두어를 떼어서 consult.caseId에 넣어둠
// (evidence_items의 content -> reasons[].label도 화면 컴포넌트가 기대하는 이름으로 변환)
const mapProcedureHistoryDetail = (data) => ({
  id: String(data.medical_case_id),
  name: data.procedure.name,
  tag: data.procedure.area,
  hospital: data.procedure.hospital_name,
  location: [data.procedure.hospital_city, getCountryName(data.procedure.hospital_country)]
    .filter(Boolean)
    .join(', '),
  date: data.procedure.date.replaceAll('-', '.'),
  relatedCaseId: data.case_number,
  consult: {
    caseId: data.case_number.replace(/^CASE-/, ''),
    hospitalName: data.collaboration.partner_hospital_name,
    date: formatDateOnly(data.collaboration.finalized_at),
  },
  agreement: {
    participants: data.final_agreement.reviews.map((r) => ({ name: r.hospital_name })),
    finalJudgement: data.final_agreement.judgment_draft,
    reasons: data.final_agreement.evidence_items.map((item) => ({ id: item.id, label: item.content })),
    opinion: data.final_agreement.additional_opinion ?? '',
  },
});

// 시술 이력 상세 + 최종 협진 합의안 (상세 화면, 인계서 화면 공통)
// COMPLETED + FINAL 조건을 만족하는 Case만 조회 가능, 그 외엔 404
export const useProcedureHistoryDetailQuery = (medicalCaseId) =>
  useQuery({
    queryKey: ['procedureHistoryDetail', medicalCaseId],
    enabled: !!medicalCaseId,
    queryFn: () => getProcedureHistoryDetailApi(medicalCaseId).then(mapProcedureHistoryDetail),
  });

// ------------------------------------------------------------
// 병원측 cases api

// 백엔드 응답 -> PatientDetailPage(CaseSummaryCard 등)가 기대하는 필드 형태로 변환
// transmitted_data 하위 필드는 환자가 전송에 포함하지 않았으면 아예 없을 수 있어서 전부 옵셔널 체이닝 처리
const mapReceivedCaseTransferDetail = (data) => {
  const transmitted = data.transmitted_data ?? {};
  const symptoms = transmitted.symptoms ?? {};

  return {
    id: data.id,
    collaborationRequestId: data.collaboration_request_id, // transfer_id와 다른 값이라 별도로 보관
    caseId: data.case_number?.replace(/^CASE-/, ''),
    name: transmitted.patient_info?.name,
    hospital: data.origin_hospital_name, // 시술받은 원 병원 (= 이 케이스를 보낸 쪽)
    requestedAt: formatDateTime(data.transferred_at),
    photos: symptoms.images?.map((img) => resolveMediaUrl(img.image_url ?? img)) ?? [],
    symptomTags: symptoms.types ?? [],
    symptomArea: symptoms.areas?.join(', ') ?? '',
    symptomDate: symptoms.start_date
      ? `${formatDateOnly(symptoms.start_date)}${symptoms.onset_timing ? ` (${symptoms.onset_timing})` : ''}`
      : '',
    procedureAt: transmitted.procedure?.date ? formatDateOnly(transmitted.procedure.date) : '',
    symptomLevel: symptoms.pain_level != null ? `${symptoms.pain_level}/5` : '',
    symptomDesc: symptoms.description,
    sideEffects: transmitted.adverse_effects?.map((e) => e.translated_name) ?? [],
    aiSummary: data.ai_translation_summary,
  };
};

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

// 협진 요청 상태값(백엔드) -> 병원용 UI 상태값(utils/caseStatus.js의 CASE_STATUS_BADGE 키) 변환
const COLLABORATION_STATUS_MAP = {
  REQUESTED: 'new',
  ACCEPTED: 'reviewing',
  COMPLETED: 'done',
};

// 백엔드 응답 -> ConsultRequestListPage/HospitalHomePage/ChatListPage가 공통으로 쓰는 flat 형태로 변환
// 원 병원/협진 병원 둘 다 같은 Case를 보게 되면서, '상대 병원' 표시와 '협진 시작하기' 노출 여부를
// 로그인한 병원이 origin인지 partner인지로 직접 판별해야 함
// myHospitalId = 로그인 응답의 hospital_id (useAuthStore) - 병원 프로필(hospital-profile API)의 id와는
// 네임스페이스가 다른 값이라 그걸 쓰면 isOrigin/canAccept가 항상 false로 나옴!! -> 이게 예상 원인
const mapCollaborationRequest = (item, myHospitalId) => {
  const isOrigin = item.origin_hospital_id === myHospitalId;
  return {
    id: item.id, // collaboration_request_id (chat_room_id/case_transfer_id와는 다른 값이라 별도로 보관)
    chatRoomId: item.chat_room_id,
    caseTransferId: item.case_transfer_id,
    medicalCaseId: item.medical_case_id,
    caseId: item.case_number?.replace(/^CASE-/, ''),
    name: item.medical_case?.patient_name,
    hospital: isOrigin ? item.partner_hospital_name : item.origin_hospital_name,
    requestedAt: formatDateTime(item.requested_at),
    status: COLLABORATION_STATUS_MAP[item.status],
    // REQUESTED 건은 원/협진 병원 모두 목록에 뜨지만, 수락은 협진(상대) 병원만 가능
    canAccept: item.status === 'REQUESTED' && item.partner_hospital_id === myHospitalId,
  };
};

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

// 백엔드 응답 -> ConsultRequestDetail(협진 요청 상세) / PatientDetailPage(환자 정보 상세)가
// 공통으로 쓰는 flat 형태로 변환. 두 화면이 같은 API를 쓴다고 문서에 명시돼 있어서 훅도 하나로 공유함
// patient_provided_data는 연결된 CaseTransfer가 없으면 빈 객체({})로 오고, 있어도 항목별로
// 환자 동의 여부에 따라 통째로 빠질 수 있어서 전부 옵셔널 체이닝 처리!!
const mapCollaborationRequestDetail = (data) => {
  const provided = data.patient_provided_data ?? {};
  const symptoms = provided.symptoms ?? {};

  return {
    id: data.id, // collaboration_request_id
    chatRoomId: data.chat_room_id, // 협진 시작(수락) 후 채팅방 이동은 이 값을 써야 함 (id 쓰면 안 됨!!)
    caseTransferId: data.case_transfer_id,
    caseId: data.case_number?.replace(/^CASE-/, ''),
    name: data.patient_name,
    hospital: data.procedure_hospital_name ?? data.origin_hospital_name,
    requestedAt: formatDateTime(data.requested_at),
    status: COLLABORATION_STATUS_MAP[data.status],

    // 시술 정보 - ConsultRequestDetail
    procedureName: data.medical_case?.procedure_name,
    procedureArea: data.medical_case?.procedure_area,
    procedureDate: formatDateOnly(data.medical_case?.procedure_date),
    ingredients: data.medical_case?.ingredients?.map((i) => i.ingredient_name) ?? [],
    doctorNote: data.medical_case?.clinician_note,

    // 환자 제공 정보 - PatientDetailPage
    photos: symptoms.images?.map((img) => resolveMediaUrl(img.image_url ?? img)) ?? [],
    symptomTags: symptoms.types ?? [],
    symptomArea: symptoms.areas?.join(', ') ?? '',
    symptomDate: symptoms.start_date
      ? `${formatDateOnly(symptoms.start_date)}${symptoms.onset_timing ? ` (${symptoms.onset_timing})` : ''}`
      : '',
    procedureAt: data.medical_case?.procedure_date ? formatDateOnly(data.medical_case.procedure_date) : '',
    symptomLevel: symptoms.pain_level != null ? `${symptoms.pain_level}/5` : '',
    symptomDesc: symptoms.description,
    sideEffects: provided.adverse_effects?.map((e) => e.translated_name) ?? [],
    aiSummary: data.ai_translation_summary,
  };
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

const mapAgreementDetail = (data) => ({
  id: data.id,
  chatRoomId: data.chat_room,
  judgmentDraft: data.judgment_draft,
  evidenceItems: data.evidence_items ?? [],
  additionalOpinion: data.additional_opinion,
  status: data.status,
  version: data.version,
  editedByName: data.edited_by_name,
  editedAt: formatDateTime(data.edited_at),
  finalizedAt: formatDateTime(data.finalized_at),
  reviews: data.reviews ?? [],
  canEdit: data.can_edit,
  requiresReReview: data.requires_re_review,
  myReviewCompleted: data.my_review_completed,
  counterpartReviewCompleted: data.counterpart_review_completed,
  allReviewsCompleted: data.all_reviews_completed,
  canFinalize: data.can_finalize,
  primaryAction: data.primary_action,
});

// 합의안 상세 - 아직 생성된 합의안이 없으면(404) AI 초안 생성 API를 대신 호출
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

const mapChatRoom = (room) => ({
  id: room.room_id,
  caseId: room.case_number?.replace(/^CASE-/, ''),
  name: room.patient_name,
  hospital: room.counterpart_hospital_name,
  lastMessageAt: formatDateTime(room.last_message_at),
  unreadCount: room.unread_count,
  chatStatus: room.chat_status,
  statusLabel: room.chat_status_label,
  canViewAgreement: room.can_view_agreement,
  medicalCaseId: room.medical_case_id,
});

// status: undefined(전체) | 'IN_REVIEW' | 'COMPLETED'
export const useChatRoomListQuery = (status) =>
  useQuery({
    queryKey: ['chatRooms', status],
    queryFn: () => getChatRoomListApi(status).then((list) => list.map(mapChatRoom)),
  });

const mapChatMessage = (msg) => ({
  id: msg.id,
  senderHospitalId: msg.sender_hospital_id,
  from: msg.sender_hospital_name,
  original: msg.content,
  translated: msg.display_content,
  time: formatDateTime(msg.created_at)?.split(' ')[1],
});

export const useChatMessagesQuery = (caseId, roomId) =>
  useQuery({
    queryKey: ['chatMessages', caseId, roomId],
    enabled: !!caseId && !!roomId,
    queryFn: () => getChatMessagesApi(caseId, roomId).then((data) => data.messages.map(mapChatMessage)),
  });

export const useSendChatMessageMutation = (caseId, roomId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content) => sendChatMessageApi(caseId, roomId, content),
    onSuccess: (msg) => {
      queryClient.setQueryData(['chatMessages', caseId, roomId], (old = []) => [
        ...old,
        mapChatMessage(msg),
      ]);
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
  });
};

// 채팅방 읽음 처리 (lastReadMessageId 생략 시 최신까지 전체 읽음)
export const useMarkChatRoomReadMutation = (roomId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lastReadMessageId) => markChatRoomReadApi(roomId, lastReadMessageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['hospitalDashboard'] });
    },
  });
};

// ------------------------------------------------------------
// selfsymptoms/ api

// 증상 케이스 생성 (useCaseFormStore 값을 그대로 넘기면 내부에서 FormData로 변환)
export const useCreateSymptomCaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formValues) => createSymptomCaseApi(buildSymptomCaseFormData(formValues)),
    onSuccess: () => {
      // 홈 최근 케이스 / 케이스 선택 목록에서 같이 쓰는 목록 캐시라 한번에 갱신
      queryClient.invalidateQueries({ queryKey: ['symptomCases'] });
    },
  });
};

// 증상 케이스 목록 (raw, 변환 전) - 아래 훅들에서 공통으로 사용
export const useSymptomCaseListQuery = () =>
  useQuery({ queryKey: ['symptomCases'], queryFn: getSymptomCaseListApi });

// 환자 홈 피드 - 최근 케이스 목록
// data를 useMemo로 감싸서 query.data가 안 바뀌면 배열/객체 참조도 그대로 유지되게 함
export const useRecentSymptomCasesQuery = () => {
  const query = useSymptomCaseListQuery();
  const data = useMemo(() => query.data?.map(normalizeSymptomCaseForHome), [query.data]);
  return { ...query, data };
};

// AI 추천 병원 매칭 진입 전 - 케이스 선택 화면 (HospitalSelectCase)
// status가 SUBMITTED(등록만 하고 병원 매칭은 아직 안 한 상태)인 케이스만 필터링해서 보여줌
export const useSubmittedSymptomCaseListQuery = () => {
  const query = useSymptomCaseListQuery();
  const data = useMemo(
    () => query.data?.filter((c) => c.status === 'SUBMITTED').map(normalizeSymptomCaseForSelect),
    [query.data]
  );
  return { ...query, data };
};

// 케이스 동기화 Step2Select에서 사용
// Case 전송 건 생성(POST /cases/transfers/) 전제조건이 '증상 Case가 HOSPITAL_SELECTED 상태'라서
// (apis/caseApi.js의 createCaseTransferApi 주석 참고) AI 매칭까지 끝낸 케이스만 필터링해서 보여줘야 함
export const useHospitalSelectedSymptomCaseListQuery = () => {
  const query = useSymptomCaseListQuery();
  const data = useMemo(
    () => query.data?.filter((c) => c.status === 'HOSPITAL_SELECTED').map(normalizeSymptomCaseForSelect),
    [query.data]
  );
  return { ...query, data };
};

// ------------------------------------------------------------
// matching api

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

// ------------------------------------------------------------
// 여기서부터는 아직 남은 hook들 - 아직 mock 유지
// ------------------------------------------------------------

// 협진 인계서
export const useHandoverDocumentQuery = () =>
  useQuery({ queryKey: ['handoverDocument'], queryFn: () => wait(MOCK_HANDOVER_DOCUMENT) });

// 협진 요청 상세
export const useConsultRequestDetailQuery = () =>
  useQuery({ queryKey: ['consultRequestDetail'], queryFn: () => wait(MOCK_CONSULT_REQUEST_DETAIL) });