// 협진 케이스(환자) 상태값 <-> 뱃지 표시 정보 매핑
//
// status 값 종류
//  - 'new'       : 신규 요청 (주황 뱃지)
//  - 'reviewing' : 검토중 (파란 뱃지)
//  - 'done'      : 완료 (민트 뱃지)
//
// 백엔드 연동 때 서버에서 내려주는 상태값 이름에 맞춰서
// mapping 되는 객체의 key만 서버 값에 맞게 바꿔주면 되지 않을까...ㅎㅎ(제발)

export const CASE_STATUS_BADGE = {
  new: { label: '신규 요청', tone: 'orange' },
  reviewing: { label: '검토중', tone: 'blue' },
  done: { label: '완료', tone: 'mint' },
};

export const getCaseStatusCounts = (patients = []) => ({
  new: patients.filter((p) => p.status === 'new').length,
  reviewing: patients.filter((p) => p.status === 'reviewing').length,
  done: patients.filter((p) => p.status === 'done').length,
});