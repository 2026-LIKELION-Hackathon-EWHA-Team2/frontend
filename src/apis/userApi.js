import axiosInstance from './axiosInstance';

// 로그인
// POST /accounts/login/
// body: { login_id, password }
// 응답: { id, name, login_id, user_type, access, refresh, patient_id/hospital_id }
export const loginApi = (loginId, password) =>
  axiosInstance
    .post('/accounts/login/', {
      login_id: loginId,
      password: password,
    })
    .then((res) => res.data);

// 환자 회원가입
// POST /accounts/signup/patient/
export const signupPatientApi = (data) =>
  axiosInstance.post('/accounts/signup/patient/', data).then((res) => res.data);

// 병원 회원가입
// POST /accounts/signup/hospital/
export const signupHospitalApi = (data) =>
  axiosInstance.post('/accounts/signup/hospital/', data).then((res) => res.data);

// 환자 프로필 조회 (로그인 필요 - 토큰은 axiosInstance interceptor가 자동으로 붙여줌)
// GET /accounts/patient-profile/
export const getPatientProfileApi = () =>
  axiosInstance.get('/accounts/patient-profile/').then((res) => res.data);

// 병원 프로필 조회
// GET /accounts/hospital-profile/
export const getHospitalProfileApi = () =>
  axiosInstance.get('/accounts/hospital-profile/').then((res) => res.data);

// 회원가입 병원 목록 조회 (병원명 검색 가능)
// GET /accounts/hospitals/?search=검색어
// search 안 넣으면 전체 목록 조회
export const getHospitalListApi = (search = '') =>
  axiosInstance
    .get('/accounts/hospitals/', { params: { search } })
    .then((res) => res.data);