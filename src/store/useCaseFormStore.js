import { create } from 'zustand';

// 사진 입력 -> 증상 입력 ->  진단서 입력 퍼널 store
const useCaseFormStore = create((set, get) => ({
  photos: [], // 업로드한 사진. { file, previewUrl } 객체 배열 (file: 실제 업로드용 File 객체, previewUrl: 미리보기용 objectURL)
  symptomArea: [], // 증상 부위 (복수선택, ChipToggle)
  customArea: '', // 증상 부위 직접 입력 시
  symptomStartDate: '',
  symptomTiming: '', // '시술 직후' | '시술 후 며칠 뒤'
  symptomDetail: '', // 증상 상세 입력
  painLevel: '보통', // DotToggle 정도...
  checkedSymptoms: [], // SymptomCheckbox 로 고른 목록 (붓기,가려움..)
  hospital: null, // { id, name } - 시술 받은 병원 (검색해서 선택) -> 직접 입력 방식이면 '' 문자열 로 바꾸면 될 듯!!
  diagnosisFile: null, // { file, name, previewUrl } (file: 실제 업로드용 File 객체)

  setPhotos: (photos) => set({ photos }),
  addPhoto: (photo) => set({ photos: [...get().photos, photo] }), // photo: { file, previewUrl }
  removePhoto: (idx) =>
    set((state) => {
      const target = state.photos[idx];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return { photos: state.photos.filter((_, i) => i !== idx) }; // 사진 삭제 기능 추가
    }),
  setSymptomArea: (symptomArea) => set({ symptomArea }),
  setCustomArea: (customArea) => set({ customArea }),
  setSymptomStartDate: (symptomStartDate) => set({ symptomStartDate }),
  setSymptomTiming: (symptomTiming) => set({ symptomTiming }),
  setSymptomDetail: (symptomDetail) => set({ symptomDetail }),
  setPainLevel: (painLevel) => set({ painLevel }),
  setCheckedSymptoms: (checkedSymptoms) => set({ checkedSymptoms }),
  setHospital: (hospital) => set({ hospital }),
  setDiagnosisFile: (diagnosisFile) => set({ diagnosisFile }),

  reset: () =>
    set((state) => {
      state.photos.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
      return {
        photos: [],
        symptomArea: [],
        customArea: '',
        symptomStartDate: '',
        symptomTiming: '',
        symptomDetail: '',
        painLevel: '보통',
        checkedSymptoms: [],
        hospital: null,
        diagnosisFile: null,
      };
    }),
}));

export default useCaseFormStore;