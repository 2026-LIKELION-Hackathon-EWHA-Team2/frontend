// 병원측 협진 케이스(수신 Case / 협진 요청) 관련 API 응답 -> 화면 모델 변환

import { formatDateOnly, formatDateTime, resolveMediaUrl } from '../utils/format';

// 백엔드 응답 -> PatientDetailPage(CaseSummaryCard 등)가 기대하는 필드 형태로 변환
// transmitted_data 하위 필드는 환자가 전송에 포함하지 않았으면 아예 없을 수 있어서 전부 옵셔널 체이닝 처리
export const mapReceivedCaseTransferDetail = (data) => {
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

// 협진 요청 상태값(백엔드) -> 병원용 UI 상태값(utils/caseStatus.js의 CASE_STATUS_BADGE 키) 변환
export const COLLABORATION_STATUS_MAP = {
  REQUESTED: 'new',
  ACCEPTED: 'reviewing',
  COMPLETED: 'done',
};

// 백엔드 응답 -> ConsultRequestListPage/HospitalHomePage/ChatListPage가 공통으로 쓰는 flat 형태로 변환
// 원 병원/협진 병원 둘 다 같은 Case를 보게 되면서, '상대 병원' 표시와 '협진 시작하기' 노출 여부를
// 로그인한 병원이 origin인지 partner인지로 직접 판별해야 함
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

// 백엔드 응답 -> ConsultRequestDetail(협진 요청 상세) / PatientDetailPage(환자 정보 상세)가
// 공통으로 쓰는 flat 형태로 변환. 두 화면이 같은 API를 쓴다고 문서에 명시돼 있어서 훅도 하나로 공유함
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
