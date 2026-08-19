// useCaseFormStore(프론트 상태) <-> selfsymptoms API 스펙 간 변환을 모아둔 파일

// Step3SymptomDetail의 SYMPTOM_AREA_OPTIONS -> API area_type enum
const AREA_TYPE_MAP = {
  face: 'FACE',
  chest: 'CHEST',
  eyes: 'EYE',
  lips: 'MOUTH',
  nose: 'NOSE',
};

// Step2SymptomSelect의 SYMPTOM_OPTIONS -> API symptom_type enum
const SYMPTOM_TYPE_MAP = {
  redness: 'REDNESS',
  swelling: 'SWELLING',
  pain: 'PAIN',
  bruise: 'BRUISING_BLEEDING',
  discharge: 'DISCHARGE',
  itching: 'ITCHING',
};

// Step3SymptomDetail의 TIMING_OPTIONS -> API onset_timing enum
export const ONSET_TIMING_MAP = {
  '시술 직후': 'IMMEDIATE',
  '시술 후 며칠 뒤': 'AFTER_DAYS',
};

// Step3SymptomDetail의 PAIN_LEVEL_OPTIONS -> API pain_level(정수 1~5)
const PAIN_LEVEL_MAP = {
  없음: 1,
  약간: 2,
  보통: 3,
  심함: 4,
  '매우 심함': 5,
};

// symptomArea(선택된 area id 배열) + customArea(직접 입력 텍스트) -> areas JSON 배열
// DateDropdown은 항상 'YYYY.MM.DD' 형식으로 저장됨 -> API가 요구하는 'YYYY-MM-DD'로 변환
const toApiDate = (value = '') => value.trim().replaceAll('.', '-');

const buildAreas = (symptomArea = [], customArea = '') => {
  const areas = symptomArea.map((id) => ({ area_type: AREA_TYPE_MAP[id] ?? 'OTHER' }));
  if (customArea?.trim()) areas.push({ area_type: 'OTHER' });
  return areas;
};

// checkedSymptoms(체크박스 id + 기타 증상 텍스트가 섞여있는 배열) -> symptom_types JSON 배열
const buildSymptomTypes = (checkedSymptoms = []) =>
  checkedSymptoms.map((value) =>
    SYMPTOM_TYPE_MAP[value]
      ? { symptom_type: SYMPTOM_TYPE_MAP[value] }
      : { symptom_type: 'OTHER', custom_symptom: value }
  );

// useCaseFormStore 값들을 그대로 받아서 실제 API에 보낼 multipart/form-data로 변환
// photos, diagnosisFile은 { file, previewUrl } 형태로 실제 File 객체를 들고 있어야 해서 추가!
export const buildSymptomCaseFormData = ({
  hospital,
  diagnosisFile,
  symptomStartDate,
  symptomTiming,
  symptomDetail,
  painLevel,
  symptomArea,
  customArea,
  checkedSymptoms,
  photos,
}) => {
  const formData = new FormData();

  formData.append('diagnosed_hospital', hospital?.id);
  formData.append('symptom_start_date', toApiDate(symptomStartDate));
  formData.append('onset_timing', ONSET_TIMING_MAP[symptomTiming] ?? symptomTiming);
  formData.append('description', symptomDetail);
  formData.append('pain_level', PAIN_LEVEL_MAP[painLevel] ?? 3);
  formData.append('areas', JSON.stringify(buildAreas(symptomArea, customArea)));
  formData.append('symptom_types', JSON.stringify(buildSymptomTypes(checkedSymptoms)));

  if (diagnosisFile?.file) {
    formData.append('diagnosis_document', diagnosisFile.file);
  }

  photos.forEach((photo) => {
    if (photo?.file) formData.append('images', photo.file);
  });

  return formData;
};

// PatientHomePage에서 쓰는 { id, date, status } 형태로 변환
export const normalizeSymptomCaseForHome = (item) => ({
  id: item.symptom_case_id,
  date: item.symptom_start_date?.replaceAll('-', '.') ?? '',
  status: item.status,
});

// HospitalSelectCase(CaseSelectCard) / 케이스 동기화 Step2Select에서 공통으로 쓰는 형태로 변환
export const normalizeSymptomCaseForSelect = (item) => ({
  id: item.symptom_case_id,
  title: item.diagnosed_hospital_name ?? `Case #${item.symptom_case_id}`,
  thumbnails: item.images?.map((img) => img.image_url) ?? [],
  recordedAt: item.created_at?.slice(0, 10).replaceAll('-', '.') ?? '',
  symptoms: item.symptom_types?.map((s) => s.custom_symptom ?? s.symptom_name) ?? [],
  symptomStartedAt: item.symptom_start_date?.replaceAll('-', '.') ?? '',
  // 진단서 첨부 여부/파일명은 diagnosis_document_url로 채움 -> 일단은..... 

  diagnosisAttached: Boolean(item.diagnosis_document_url),
  diagnosisName: item.diagnosis_document_url?.split('/').pop() ?? '',
  
  // ★★★ procedureName/procedureArea/procedureDate/ingredients/doctorNote는
  // symptom-cases API에 없는 필드!!! 
  // AI 구조화 결과 받아서 API 필드 맞춰서 매핑 필요합니다!! 확인해주세요!!
  procedureName: '',
  procedureArea: '',
  procedureDate: '',
  ingredients: [],
  doctorNote: '',
});