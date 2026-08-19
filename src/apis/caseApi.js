import axiosInstance from './axiosInstance';

// Case 전송 건 생성
// POST /cases/transfers/
// body: { symptom_case_id, recommendation_id, patient_name, patient_gender, patient_birth_date }
// 성공하면 REVIEW_REQUIRED 상태의 CaseTransfer(전송 초안)가 생성됨 - 이 호출만으로 병원에 전송되진 않음
// 생성 전제조건(증상 Case가 HOSPITAL_SELECTED 상태, 병원 매칭 동의 완료 등)은 AI 매칭 플로우에서 먼저 충족되어야 함
export const createCaseTransferApi = (body) =>
  axiosInstance.post('/cases/transfers/', body).then((res) => res.data);

// Case 전송 검토 및 필수 동의
// PATCH /cases/transfers/{transfer_id}/review/
// agreements: useCaseSyncStore의 agreements 배열 그대로 전달
// (agreements[0]: 시술·약물, [1]: 부작용·의료진 소견, [2]: 국외 전송·AI 처리 - 셋 다 true여야 함)
// 성공하면 status가 READY_TO_TRANSFER로 바뀐 CaseTransfer 반환. 아직 병원에 전송된 건 아님
export const reviewCaseTransferApi = (transferId, agreements) =>
  axiosInstance
    .patch(`/cases/transfers/${transferId}/review/`, {
      procedure_medication_agreed: agreements[0],
      adverse_effect_clinician_note_agreed: agreements[1],
      overseas_ai_processing_agreed: agreements[2],
    })
    .then((res) => res.data);

// Case 최종 전송
// POST /cases/transfers/{transfer_id}/send/
// 검토·필수 동의(review)까지 끝난(READY_TO_TRANSFER) CaseTransfer만 전송 가능
// 성공하면 status TRANSFERRED로 바뀌고 CaseCollaborationRequest(REQUESTED)가 자동 생성됨
export const sendCaseTransferApi = (transferId) =>
  axiosInstance.post(`/cases/transfers/${transferId}/send/`).then((res) => res.data);

// 미전송 Case 목록 조회
// GET /cases/transfers/
// Path Variable, Query Parameter 없음
// 응답: CaseTransfer 배열 (results로 감싸지 않고 그대로 배열 반환)
// status: 'REVIEW_REQUIRED'(AI 분석 완료, 최종 검토 필요) | 'READY_TO_TRANSFER'(최종 검토+동의 완료, 전송 가능)
export const getUnsentCaseTransfersApi = () =>
  axiosInstance.get('/cases/transfers/').then((res) => res.data);

// 환자 전송 Case 상세 조회
// GET /cases/transfers/{transfer_id}/
// transfer_id: 목록 응답(또는 전송 건 생성 응답)의 id (medical_case_id, symptom_case_id 아님)
// 본인이 생성한 CaseTransfer만 조회 가능. AI 검토/전송 동의/전송 완료 화면 재진입 시 공통으로 사용
// status: PROCESSING(AI 처리중) | REVIEW_REQUIRED(검토 필요) | PROCESSING_FAILED(AI 처리 실패)
//       | READY_TO_TRANSFER(동의 완료) | TRANSFERRED(전송 완료)
// PROCESSING_FAILED일 때만 processing_error 필드가 응답에 포함됨
export const getCaseTransferDetailApi = (transferId) =>
  axiosInstance.get(`/cases/transfers/${transferId}/`).then((res) => res.data);

// 환자 시술 이력 목록 조회
// GET /cases/procedure-histories/
// PatientSymptomCase.status가 COMPLETED(양측 병원 최종 합의 확정)인 Case만 반환
// 시술일 최신순, 동일하면 medical_case_id 큰 순. 이력 없으면 404 아니라 빈 배열
export const getProcedureHistoryListApi = () =>
  axiosInstance.get('/cases/procedure-histories/').then((res) => res.data);

// 환자 시술 이력 상세 조회
// GET /cases/procedure-histories/{medical_case_id}/
// 조회 가능 조건: 본인 MedicalCase + PatientSymptomCase.status COMPLETED + CaseAgreement.status FINAL
// 협진 진행 중이거나 최종 합의안이 없으면 404
export const getProcedureHistoryDetailApi = (medicalCaseId) =>
  axiosInstance.get(`/cases/procedure-histories/${medicalCaseId}/`).then((res) => res.data);

// ------------------------------------------------------------
// 병원측 cases api

// 협진 병원 수신 Case 목록 조회
// GET /cases/transfers/received/
export const getReceivedCaseTransfersApi = () =>
  axiosInstance.get('/cases/transfers/received/').then((res) => res.data);

// 협진 병원 수신 Case 상세 조회
// GET /cases/transfers/received/{transfer_id}/
// (아직 쓰는 화면 없음 - PatientDetailPage는 협진 요청 상세 API를 대신 씀)
export const getReceivedCaseTransferDetailApi = (transferId) =>
  axiosInstance.get(`/cases/transfers/received/${transferId}/`).then((res) => res.data);

// 협진 Case 목록 조회
// GET /cases/collaboration-requests/?status=&search=
// 로그인한 병원이 원 병원 또는 협진 병원으로 참여한 전체 협진 Case 목록 (병원 계정만 접근 가능)
// 페이지네이션 없음 - results로 감싸지 않고 배열 그대로 반환
// status: REQUESTED(신규 요청) | ACCEPTED(검토중) | COMPLETED(완료)
export const getCollaborationRequestListApi = (params = {}) =>
  axiosInstance.get('/cases/collaboration-requests/', { params }).then((res) => res.data);

// 협진 요청 상세 조회
// GET /cases/collaboration-requests/{collaboration_request_id}/
// 원 병원 또는 협진 병원(요청을 주고받은 두 병원)만 조회 가능
// '협진 요청 상세'(/hospital/case/request/:id)와 '환자 정보 상세'(/hospital/case/:id) 화면이 공용으로 사용
// (둘 다 id는 collaboration_request_id - transfer_id/chat_room_id와 혼동하지 말 것)
// case_transfer_id가 null이면(=전송 완료된 CaseTransfer 없음) patient_provided_data도 null
export const getCollaborationRequestDetailApi = (collaborationRequestId) =>
  axiosInstance.get(`/cases/collaboration-requests/${collaborationRequestId}/`).then((res) => res.data);

// 협진 요청 수락 및 채팅방 생성
// POST /cases/collaboration-requests/{collaboration_request_id}/accept/
export const acceptCollaborationRequestApi = (collaborationRequestId) =>
  axiosInstance
    .post(`/cases/collaboration-requests/${collaborationRequestId}/accept/`)
    .then((res) => res.data);

// 병원 대시보드 조회
// GET /cases/hospital/dashboard/
export const getHospitalDashboardApi = () =>
  axiosInstance.get('/cases/hospital/dashboard/').then((res) => res.data);

// 협진 채팅방 목록 조회
// GET /cases/chat/rooms/?status=IN_REVIEW|COMPLETED
export const getChatRoomListApi = (status) =>
  axiosInstance.get('/cases/chat/rooms/', { params: status ? { status } : undefined }).then((res) => res.data);

// 채팅 메시지 목록 조회
// GET /cases/{case_id}/chat/rooms/{room_id}/messages/
export const getChatMessagesApi = (caseId, roomId) =>
  axiosInstance.get(`/cases/${caseId}/chat/rooms/${roomId}/messages/`).then((res) => res.data);

// 채팅 메시지 전송
// POST /cases/{case_id}/chat/rooms/{room_id}/messages/
export const sendChatMessageApi = (caseId, roomId, content) =>
  axiosInstance.post(`/cases/${caseId}/chat/rooms/${roomId}/messages/`, { content }).then((res) => res.data);

// 협진 채팅 읽음 처리
// POST /cases/chat/rooms/{room_id}/read/
export const markChatRoomReadApi = (roomId, lastReadMessageId) =>
  axiosInstance
    .post(`/cases/chat/rooms/${roomId}/read/`, lastReadMessageId ? { last_read_message_id: lastReadMessageId } : {})
    .then((res) => res.data);

// 합의안 상세 조회
// GET /cases/{case_id}/chat/rooms/{room_id}/agreement/
// case_id = medical_case_id
export const getAgreementDetailApi = (caseId, roomId) =>
  axiosInstance.get(`/cases/${caseId}/chat/rooms/${roomId}/agreement/`).then((res) => res.data);

// 협진 합의안 수정 (수정할 필드만 전달)
// PATCH /cases/{case_id}/chat/rooms/{room_id}/agreement/
export const updateAgreementApi = (caseId, roomId, fields) =>
  axiosInstance.patch(`/cases/${caseId}/chat/rooms/${roomId}/agreement/`, fields).then((res) => res.data);

// AI 협진 합의안 초안 생성 (합의안 상세 조회가 404일 때만 호출)
// POST /cases/{case_id}/chat/rooms/{room_id}/agreement/generate/
export const generateAgreementApi = (caseId, roomId) =>
  axiosInstance.post(`/cases/${caseId}/chat/rooms/${roomId}/agreement/generate/`).then((res) => res.data);

// 합의안 검토 완료 / 최종 확정 (REVIEW, FINALIZE 둘 다 이 API 하나로 처리)
// POST /cases/{case_id}/chat/rooms/{room_id}/agreement/review/
export const reviewAgreementApi = (caseId, roomId) =>
  axiosInstance.post(`/cases/${caseId}/chat/rooms/${roomId}/agreement/review/`).then((res) => res.data);
