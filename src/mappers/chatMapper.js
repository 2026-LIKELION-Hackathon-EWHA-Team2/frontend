/*
 * [어흥콘 리팩토링] hooks/useMockQueries.js에서 매핑 함수 분리
 * -> 협진 채팅 관련 API 응답 -> 화면 모델 변환
 */

import { formatDateTime } from '../utils/format';

export const mapChatRoom = (room) => ({
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

export const mapChatMessage = (msg) => ({
  id: msg.id,
  senderHospitalId: msg.sender_hospital_id,
  from: msg.sender_hospital_name,
  original: msg.content,
  translated: msg.display_content,
  time: formatDateTime(msg.created_at)?.split(' ')[1],
});
