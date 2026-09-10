/*
 * [어흥콘 리팩토링] hooks/useMockQueries.js에서 매핑 함수 분리
 * -> 환자 시술 이력(여권) 관련 API 응답 -> 화면 모델 변환
 */

import { getCountryName } from '../utils/country';
import { formatDateOnly } from '../utils/format';

// 백엔드 응답 -> MedicalPassportPage/ProcedureHistoryCard/ProcedureDetailPage가 쓰는 필드 형태로 변환
// location 조합, date 구분자, id 문자열화처럼 값 자체를 가공해야 해서 매핑함
export const mapProcedureHistory = (item) => ({
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

// 백엔드 응답 -> ProcedureDetailPage/ConsultCard/ConsultHistoryPage가 쓰는 필드 형태로 변환
// case_number는 'CASE-2026-000015'처럼 접두어가 붙어있어서, ConsultCard가 자체적으로
// 'Case #'를 붙이는 것과 겹치지 않도록 접두어를 떼어서 consult.caseId에 넣어둠
export const mapProcedureHistoryDetail = (data) => ({
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
    // 추가 소견은 원문과 번역본이 둘 다 받기
    // ChatRoomPage와 동일하게 원문보기/번역보기 토글로 보여주도록!
    opinion: data.final_agreement.additional_opinion_display_content ?? data.final_agreement.additional_opinion ?? '',
    opinionOriginal: data.final_agreement.additional_opinion_original_content ?? '',
    opinionTranslated: data.final_agreement.additional_opinion_translated_content ?? '',
    opinionTranslationStatus: data.final_agreement.additional_opinion_translation_status ?? null,
  },
});
