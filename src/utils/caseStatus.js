// 협진 케이스(환자) 상태값 <-> 뱃지 표시 정보 매핑
//
// status 값 종류
//  - 'new'       : 신규 요청 (주황 뱃지)
//  - 'reviewing' : 검토중 (파란 뱃지)
//  - 'done'      : 완료 (민트 뱃지)
//
// 백엔드 연동 때 서버에서 내려주는 상태값 이름에 맞춰서
// mapping 되는 객체의 key만 서버 값에 맞게 바꿔주면 되지 않을까...ㅎㅎ(제발)

export const CASE_STATUS_BADGE = { // 병원용
  new: { label: '신규 요청', tone: 'orange' },
  reviewing: { label: '검토중', tone: 'blue' },
  done: { label: '완료', tone: 'mint' },
};

export const getCaseStatusCounts = (patients = []) => ({
  new: patients.filter((p) => p.status === 'new').length,
  reviewing: patients.filter((p) => p.status === 'reviewing').length,
  done: patients.filter((p) => p.status === 'done').length,
});

// -----------------------------------------------------------------------
// 환자 계정 홈 화면 케이스 상태값 <-> 뱃지 표시 정보 매핑
//
// status 값 종류 (실제 selfsymptoms API status 값 기준)
//  - SUBMITTED             : 병원 매칭 전
//  - MATCHING              : 병원 수락 대기
//  - HOSPITAL_SELECTED     : 병원 수락 대기
//  - CONNECTION_REQUESTED  : 병원 수락 대기
//  - IN_COLLABORATION      : 신속 협진 진행 중
//  - COMPLETED             : 진단 완료

export const PATIENT_CASE_STATUS_GROUP = {
  SUBMITTED: 'BEFORE_MATCHING',
  MATCHING: 'AWAITING_ACCEPTANCE',
  HOSPITAL_SELECTED: 'AWAITING_ACCEPTANCE',
  CONNECTION_REQUESTED: 'AWAITING_ACCEPTANCE',
  IN_COLLABORATION: 'IN_COLLABORATION',
  COMPLETED: 'COMPLETED',
};

export const PATIENT_CASE_BADGE = {
  BEFORE_MATCHING: { label: '병원 매칭 전', tone: 'purple' },
  AWAITING_ACCEPTANCE: { label: '협진 대기', tone: 'orange' },
  IN_COLLABORATION: { label: '신속 협진 진행중', tone: 'blue' },
  COMPLETED: { label: '진단 완료', tone: 'mint' },
};

export const getPatientCaseBadge = (status) => {
  const group = PATIENT_CASE_STATUS_GROUP[status];
  return group ? PATIENT_CASE_BADGE[group] : null;
};
