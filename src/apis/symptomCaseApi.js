import axiosInstance from './axiosInstance';

// 증상 케이스 생성 (최종 제출까지 한번에 처리 -> 생성된 케이스 status는 항상 SUBMITTED)
// POST /api/selfsymptoms/symptom-cases/
// body: multipart/form-data (formData는 utils/symptomCaseMapper.js의 buildSymptomCaseFormData로 생성)
export const createSymptomCaseApi = (formData) =>
  axiosInstance
    .post('/api/selfsymptoms/symptom-cases/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);

// 증상 케이스 목록 조회 (내 케이스 전체)
// GET /api/selfsymptoms/symptom-cases/
export const getSymptomCaseListApi = () =>
  axiosInstance.get('/api/selfsymptoms/symptom-cases/').then((res) => res.data);

// 증상 케이스 상세 조회
// GET /api/selfsymptoms/symptom-cases/{symptom_case_id}/
export const getSymptomCaseDetailApi = (symptomCaseId) =>
  axiosInstance.get(`/api/selfsymptoms/symptom-cases/${symptomCaseId}/`).then((res) => res.data);