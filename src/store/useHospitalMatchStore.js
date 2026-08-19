import { create } from 'zustand';

// 자국 병원 연결(AI 추천 병원 매칭) 퍼널 store
const useHospitalMatchStore = create((set, get) => ({
    
  selectedCaseId: null, // 선택된 케이스 파라미터 전달
  // LevelBarCard 기준, 표시 퍼센트는 (value-1)/4*100 => 5=100%,4=75%,3=50%,2=25%,1=0% 로 생각함...
  preference: { department: 5, distance: 4, experience: 3 }, // 그래서 일단 이런 식으로 생각했어요!!
  // languages: [], // MultiSelectToggle 선택 값 ['en','cn','jp'] 넣는다고 했었는지 헷갈려서 일단 주석으로 남겨둘게요!
  matchRequestId: null, // POST /api/matching/requests/ 응답의 match_request.match_request_id
  recommendedHospitals: [], // 위 응답의 recommendations 배열 그대로 저장 (요소 형태: { recommendation_id, hospital: {...}, distance_km, ... })
  selectedHospitalId: null, // 선택한 recommendation.hospital.hospital_id
  selectedRecommendationId: null, // 선택한 recommendation.recommendation_id (hospital_id와는 다른 값! 이후 추천 병원 선택 API에 사용)
  // 추천 병원 선택(select) API 응답값 - Step4Consent/Step5Complete/CaseSyncPage에서 병원명 표시할 때 사용
  partnerHospitalId: null,
  partnerHospitalUserId: null,
  partnerHospitalName: null,
  sortOrder: 'distance', // 'distance' | 'experience' | 'department'
  personalInfoAgreed: false,

  setSelectedCaseId: (id) => set({ selectedCaseId: id }),
  setPreference: (patch) => set({ preference: { ...get().preference, ...patch } }),
  // setLanguages: (languages) => set({ languages }),
  setMatchRequestId: (id) => set({ matchRequestId: id }),
  setRecommendedHospitals: (recommendedHospitals) => set({ recommendedHospitals }),
  setSelectedHospitalId: (id) => set({ selectedHospitalId: id }),
  setSelectedRecommendationId: (id) => set({ selectedRecommendationId: id }),
  // 추천 병원 선택 API 성공 시 한번에 반영 (재선택 시 서버가 기존 동의를 초기화하므로 personalInfoAgreed도 같이 초기화)
  setPartnerHospital: ({ partnerHospitalId, partnerHospitalUserId, partnerHospitalName }) =>
    set({ partnerHospitalId, partnerHospitalUserId, partnerHospitalName, personalInfoAgreed: false }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setPersonalInfoAgreed: (v) => set({ personalInfoAgreed: v }),

  reset: () =>
    set({
      selectedCaseId: null,
      preference: { department: 5, distance: 4, experience: 3 },
      // languages: [],
      matchRequestId: null,
      recommendedHospitals: [],
      selectedHospitalId: null,
      selectedRecommendationId: null,
      partnerHospitalId: null,
      partnerHospitalUserId: null,
      partnerHospitalName: null,
      sortOrder: 'distance',
      personalInfoAgreed: false,
    }),
}));

export default useHospitalMatchStore;
