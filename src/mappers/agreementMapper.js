/*
 * [어흥콘 리팩토링] hooks/useMockQueries.js 안에 있던 응답 매핑 함수를 mappers로 옮겼습니다
 * 'API 응답 필드명(백엔드) -> 화면이 기대하는 필드명(프론트)' 변환만 담당하는 순수 함수라서, 
 * hook과 분리해두면 어떤 필드가 왜 이렇게 바뀌는지 찾을 때 훅 코드까지 읽을 필요 없음!
 * -> requiresReReview, myReviewCompleted, counterpartReviewCompleted 필드가 '합의안
 *   수정 시 상대 병원 재검토 필요' 로직의 핵심! 여기서는 백엔드가 계산해서 준 값을 그대로
 *   옮겨 담기만 하고, 판단 로직 자체는 프론트에 없습니다`
 */

import { formatDateTime } from '../utils/format';

export const mapAgreementDetail = (data) => ({
  id: data.id,
  chatRoomId: data.chat_room,
  judgmentDraft: data.judgment_draft,
  evidenceItems: data.evidence_items ?? [],
  // 추가 소견은 원문과 번역본 함께 받아서
  // 환자측 인계서 화면과 동일하게 원문보기/번역보기 토글로 보여주기
  additionalOpinion: data.additional_opinion_display_content || data.additional_opinion,
  additionalOpinionOriginal: data.additional_opinion_original_content,
  additionalOpinionTranslated: data.additional_opinion_translated_content,
  additionalOpinionTranslationStatus: data.additional_opinion_translation_status,
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
