// 병원 회원가입 - 전문 분야 표시 라벨 <-> 백엔드 specialty_code 매핑
// 목록에 없는 값(직접 추가한 자유 텍스트)은 CUSTOM 코드로 전송
export const SPECIALTY_CODE_MAP = {
  '여드름·흉터': 'ACNE_SCAR',
  색소: 'PIGMENTATION',
  리프팅: 'LIFTING',
  '보톡스·필러': 'BOTOX_FILLER',
  '가슴·바디': 'BREAST_BODY',
  눈: 'EYE',
  코: 'NOSE',
  윤곽: 'CONTOURING',
  제모: 'HAIR_REMOVAL',
};
