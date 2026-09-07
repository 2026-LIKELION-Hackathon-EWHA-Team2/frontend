// 병원측 협진 케이스(수신 Case / 협진 요청) 관련 API 응답 -> 화면 모델 변환

import { formatDateOnly, formatDateTime, resolveMediaUrl } from '../utils/format';

// 협진 요청 상태값(백엔드) -> 병원용 UI 상태값 변환
export const COLLABORATION_STATUS_MAP = {
  REQUESTED: 'new',
  ACCEPTED: 'reviewing',
  COMPLETED: 'done',
};

// 백엔드 응답 -> ConsultRequestListPage/HospitalHomePage/ChatListPage가 공통으로 쓰는 형태로 변환
// myHospitalId = 로그인 응답의 hospital_id (useAuthStore) - 병원 프로필(hospital-profile API)의 id와는
// 네임스페이스가 다른 값이라 그걸 쓰면 isOrigin/canAccept가 항상 false로 나옴!! -> 이게 예상 원인
export const mapCollaborationRequest = (item, myHospitalId) => {
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

// 백엔드 응답 -> ConsultRequestDetail / PatientDetailPage가 공통으로 쓰는 형태로 변환.
// 두 화면이 같은 API를 쓴다고 문서에 명시돼 있어서 훅도 하나로 공유함
// patient_provided_data는 연결된 CaseTransfer가 없으면 빈 객체({})로 오고, 있어도 항목별로
// 환자 동의 여부에 따라 통째로 빠질 수 있어서 전부 옵셔널 체이닝 처리!!
export const mapCollaborationRequestDetail = (data) => {
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
