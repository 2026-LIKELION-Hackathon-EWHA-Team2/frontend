import { create } from 'zustand';

// 자국 병원 연결(AI 추천 병원 매칭) 퍼널 store
const useHospitalMatchStore = create((set, get) => ({
    
  selectedCaseId: null, // 선택된 케이스 파라미터 전달
  // LevelBarCard 기준, 표시 퍼센트는 (value-1)/4*100 => 5=100%,4=75%,3=50%,2=25%,1=0% 로 생각함...
  preference: { department: 5, distance: 4, experience: 3 }, // 그래서 일단 이런 식으로 생각했어요!!
  // languages: [], // MultiSelectToggle 선택 값 ['en','cn','jp'] 넣는다고 했었는지 헷갈려서 일단 주석으로 남겨둘게요!
  recommendedHospitals: [], // 병원 ai 추천 목록
  selectedHospitalId: null,
  sortOrder: 'distance', // 'distance' | 'experience' | 'department'
  personalInfoAgreed: false,

  setSelectedCaseId: (id) => set({ selectedCaseId: id }),
  setPreference: (patch) => set({ preference: { ...get().preference, ...patch } }),
  // setLanguages: (languages) => set({ languages }),
  setRecommendedHospitals: (recommendedHospitals) => set({ recommendedHospitals }),
  setSelectedHospitalId: (id) => set({ selectedHospitalId: id }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setPersonalInfoAgreed: (v) => set({ personalInfoAgreed: v }),

  reset: () =>
    set({
      selectedCaseId: null,
      preference: { department: 5, distance: 4, experience: 3 },
      // languages: [],
      recommendedHospitals: [],
      selectedHospitalId: null,
      sortOrder: 'distance',
      personalInfoAgreed: false,
    }),
}));

export default useHospitalMatchStore;
