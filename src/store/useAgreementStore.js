import { create } from 'zustand';
import { MOCK_AGREEMENT } from '../mock/mockdata';

// 다른 store와 달리 AI가 정리한 초안(mock)을 초기값으로 받아와야 해서 넣었습니다!

// 병원 신속 협진 -> AI 정리 초안(협진 합의) -> 내용 수정 -> 최종 합의 완료 store
//
// 백엔드 연동 때 수정 필수!! 필요!! 한 부분!!
// -> zustand store라서 query hook의 데이터를 바로 초기값으로 못 써서요 ㅠ.ㅠ
// 그래서 합의 내용 ai가 요약해준 페이지에서 내용을
// useAgreementDraftQuery()로 fetch한 뒤 useEffect로 initFrom(data)을 호출해
// store을 채우는 방식으로 생각했어요!!
// 나중에 queryFn만 api 연동 때 좀 손 보고 하면 괜찮을 것 같습니다!

// ★★ 근거(reasons)에 사용 가능한 tone 값 (뱃지 텍스트). input할지 토글 목록 띄울지 모르겠어서 일단은 임시
export const REASON_TONE_OPTIONS = ['경미', '없음', '권장', '주의', '중증'];

const useAgreementStore = create((set, get) => ({
  
  requestHospital: MOCK_AGREEMENT.requestHospital, // 요청 병원 ('Tokyo Medical')
  reviewTarget: MOCK_AGREEMENT.reviewTarget, // 검토 대상('시술 정보 / 부작용 유형 / 의료진 소견')
  responseDeadline: MOCK_AGREEMENT.responseDeadline, // 응답 기준 ('4시간 이내')

  isConfirmModalOpen: false, // 최종 확인 모달 표시 여부

  participants: MOCK_AGREEMENT.participants.map((p) => ({ ...p, selected: false })),
  // ★★참여 의료진 목록 [{ name: 'Tokyo Medical', status: '검토 대기'|'검토 중'|'검토 완료', selected }]
  // ★★ 내용 수정 화면의 참여 의료진(수정 의사 선택)에서 선택된 병원을 selected: true로 표시(단일 선택)

  finalJudgement: MOCK_AGREEMENT.finalJudgement, // 최종 합의 내용 텍스트 (AI 초안 / 수정 가능)
  reasons: MOCK_AGREEMENT.reasons.map((r) => ({ ...r })),
  // ★★ 주요 근거 리스트 [{ id, label, tone }] - tone은 경미, 없음, 권장 등 뱃지 값
  followUps: MOCK_AGREEMENT.followUps.map((f) => ({ ...f })),
  // 권장 후속 조치 리스트 [{ icon, label, date }] - date는 3일처럼 상대값이거나 5/17처럼 날짜값 다!!

  opinion: '', // 추가 소견 (AI 초안 검토 / 내용 수정 화면에서 공통으로 씀)

  lastEditedBy: null, // 마지막으로 수정한 병원명 ('Tokyo Medical')
  lastEditedAt: null, // 마지막 수정 일시 ('5월 14일 10:42')

  editingFollowUpIndex: null, // 현재 캘린더 팝업?이 열려있는 followUps 인덱스 (없으면 null) - 핸들러 역할

  isComplete: false, // true가 되면 신속 협진 합의 완료 + 공유하기/다운로드 화면으로 전환

  

  // useAgreementDraftQuery()로 스토어를 채우기...(페이지에서 useEffect로 1회만 호출)
  initFrom: (draft) =>
    set({
      requestHospital: draft.requestHospital,
      reviewTarget: draft.reviewTarget,
      responseDeadline: draft.responseDeadline,
      participants: draft.participants.map((p) => ({ ...p, selected: false })),
      finalJudgement: draft.finalJudgement,
      reasons: draft.reasons.map((r) => ({ ...r })),
      followUps: draft.followUps.map((f) => ({ ...f })),
      opinion: '',
      lastEditedBy: null,
      lastEditedAt: null,
      isComplete: false,
    }),

  // 신속 협진 합의 완료 모달
  openConfirmModal: () => set({ isConfirmModalOpen: true }),
  closeConfirmModal: () => set({ isConfirmModalOpen: false }), // '취소' 클릭
  confirmFromModal: () => set({ isConfirmModalOpen: false }), // '네' 클릭 -> 협진 합의 화면으로 이동

  // ★★협진 합의 / 내용 수정 화면 - 참여 의료진 선택
  // 내용 수정에서는 수정할 병원 하나만 선택)
  selectParticipant: (name) =>
    set({
      participants: get().participants.map((p) => ({ ...p, selected: p.name === name })),
    }),
  setParticipantStatus: (name, status) =>
    set({
      participants: get().participants.map((p) => (p.name === name ? { ...p, status } : p)),
    }),

  // 내용 수정 화면 - 최종 합의 내용
  setFinalJudgement: (v) => set({ finalJudgement: v }),

  // AI 초안 검토 / 내용 수정 화면 - 추가 소견
  setOpinion: (v) => set({ opinion: v }),

  //내용 수정 화면 - 주요 근거 (tone 수정 포함)
  setReasonTone: (id, tone) =>
    set({ reasons: get().reasons.map((r) => (r.id === id ? { ...r, tone } : r)) }),
  setReasonLabel: (id, label) =>
    set({ reasons: get().reasons.map((r) => (r.id === id ? { ...r, label } : r)) }),
  addReason: (label, tone = REASON_TONE_OPTIONS[0]) =>
    set({
      reasons: [...get().reasons, { id: Date.now(), label, tone }],
    }), // 근거 추가하기
  removeReason: (id) =>
    set({ reasons: get().reasons.filter((r) => r.id !== id) }), // 근거 삭제

  // 내용 수정 화면 - 권장 후속 조치 
  openFollowUpDatePicker: (idx) => set({ editingFollowUpIndex: idx }), // 날짜 영역 클릭 시 캘린더 오픈
  closeFollowUpDatePicker: () => set({ editingFollowUpIndex: null }),
  setFollowUpDate: (idx, date) =>
    set({
      followUps: get().followUps.map((f, i) => (i === idx ? { ...f, date } : f)),
      editingFollowUpIndex: null, // 날짜 선택하면 캘린더 닫기
    }),

  // ★★내용 수정 화면 - 수정 내용 저장 클릭
  // 현재 selected된 참여 병원을 검토 완료로 바꾸고 수정 이력을 남긴 뒤 협진 합의 화면으로 복귀
  saveEdit: () => {
    const editor = get().participants.find((p) => p.selected);
    const now = new Date();
    const editedAt = `${now.getMonth() + 1}월 ${now.getDate()}일 ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    set({
      participants: get().participants.map((p) =>
        p.selected ? { ...p, status: '검토 완료' } : p
      ),
      lastEditedBy: editor?.name ?? null,
      lastEditedAt: editedAt,
    });
  },

  // ★★ 협진 합의 화면 - 검토 완료 클릭 
  // 모든 참여 병원 상태를 검토 완료로 바꾸고 최종 합의 완료 화면으로 전환 ? 음... 
  complete: () =>
    set({
      participants: get().participants.map((p) => ({ ...p, status: '검토 완료' })),
      isComplete: true,
    }),

  reset: () =>
    set({
      requestHospital: MOCK_AGREEMENT.requestHospital,
      reviewTarget: MOCK_AGREEMENT.reviewTarget,
      responseDeadline: MOCK_AGREEMENT.responseDeadline,
      isConfirmModalOpen: false,
      participants: MOCK_AGREEMENT.participants.map((p) => ({ ...p, selected: false })),
      finalJudgement: MOCK_AGREEMENT.finalJudgement,
      reasons: MOCK_AGREEMENT.reasons.map((r) => ({ ...r })),
      followUps: MOCK_AGREEMENT.followUps.map((f) => ({ ...f })),
      opinion: '',
      lastEditedBy: null,
      lastEditedAt: null,
      editingFollowUpIndex: null,
      isComplete: false,
    }),
}));

export default useAgreementStore;