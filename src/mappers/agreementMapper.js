// 협진 합의안 관련 API 응답 -> 화면 모델 변환

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
