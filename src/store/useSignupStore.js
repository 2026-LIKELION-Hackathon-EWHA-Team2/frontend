import { create } from 'zustand';

// 회원가입 퍼널용 store (환자 / 병원 공용)
// 정보입력 -> 약관동의 -> 가입완료 단계에서 입력값을 유지하기 위한 store
// 약관 동의 필수나 체크 로직은 해당 페이지 컴포넌트에서 처리하는 게 나을 것 같아 제외했습니다. 

const initialPatientInfo = {
  name: '',
  userId: '',
  password: '',
  address: '',
  phone: '',
  birth: '',
  passportNumber: '',
};

const initialHospitalInfo = {
  hospitalName: '',
  userId: '',
  password: '',
  department: [], // 전문 분야 (다중 선택)
  countryCity: '',
  hospitalAddress: '',
  phone: '',
  website: '',
};

const initialTerms = {
  service: false, // 서비스 이용약관 (필수)
  privacy: false, // 개인정보 수집 및 이용 동의 (필수)
  hospitalShare: false, // 해외 병원 정보 공유 동의 (필수)
  overseasTransfer: false, // 개인정보 국외 이전 동의 (필수, 환자만)
  marketing: false, // 마케팅 정보 수신 동의 (선택)
  location: false, // 위치 정보 공유 동의 (선택)
};

const useSignupStore = create((set, get) => ({
  patientInfo: { ...initialPatientInfo },
  hospitalInfo: { ...initialHospitalInfo },
  terms: { ...initialTerms },

  setPatientInfo: (patch) => set({ patientInfo: { ...get().patientInfo, ...patch } }),
  setHospitalInfo: (patch) => set({ hospitalInfo: { ...get().hospitalInfo, ...patch } }),
  setTerm: (key, value) => set({ terms: { ...get().terms, [key]: value } }),
  setAllTerms: (value) =>
    set({
      terms: Object.fromEntries(Object.keys(get().terms).map((key) => [key, value])),
    }),

  reset: () =>
    set({
      patientInfo: { ...initialPatientInfo },
      hospitalInfo: { ...initialHospitalInfo },
      terms: { ...initialTerms },
    }),
}));

export default useSignupStore;
