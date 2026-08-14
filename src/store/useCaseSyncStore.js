import { create } from "zustand";

// 케이스 동기화(협진 전송) 환자측 퍼널 store
// 환자 식별 정보 입력 -> 케이스 검토 -> 전송 동의 순서
const useCaseSyncStore = create((set, get) => ({
  patientName: "", // 이름 (필수) 입력 필드 값
  gender: "", // 성별 (선택) - '여성' | '남성'
  birth: "", // 생년월일 (선택) - YYYY.MM.DD 형식 문자열

  selectedCaseId: "case01", // 동기화할 케이스 파라미터...!
  linkedDiagnosis: null, // '연동된 진단서' 카드 정보 ({ name: '눈썹 문신', clinic: 'ABC Beauty Clinic', date: '2025.06.10' })

  procedureName: "", // 시술명 ('보톡스')
  procedurePart: "", // 시술 부위 ('이마')
  procedureDate: "", // 시술 일자 ('2025.08.01')

  medications: [], // 약물 재료 성분명 리스트 (['Botulimun Toxin Type A', 'Lidocaine HCl', 'Hyaluronic Acid'])
  doctorNote: "", // 의료진 소견 텍스트 (AI가 요약/번역한 소견 내용)

  targetHospital: null, // 전송 대상 병원 선택 정보 (예: { name: 'Tokyo Medical', info: '일본 · 피부과 / 성형외과' })
  agreements: [false, false, false], // 동의 항목 체크박스 3개
  // agreements[0]: 시술 정보와 약물 관련
  // agreements[1]: 부작용 유형과 의료진 소견 전송
  // agreements[2]: 국외 의료기관 전송 및 AI 번역 처리 안내

  isSent: false, // 전송 완료 여부 - true가 되면 전송 완료 화면으로 이동

  setPatientName: (v) => set({ patientName: v }),
  setGender: (v) => set({ gender: v }),
  setBirth: (v) => set({ birth: v }),

  setSelectedCaseId: (v) => set({ selectedCaseId: v }),
  setLinkedDiagnosis: (v) => set({ linkedDiagnosis: v }),

  setProcedureName: (v) => set({ procedureName: v }),
  setProcedurePart: (v) => set({ procedurePart: v }),
  setProcedureDate: (v) => set({ procedureDate: v }),

  setMedications: (v) => set({ medications: v }),
  setDoctorNote: (v) => set({ doctorNote: v }),

  setTargetHospital: (v) => set({ targetHospital: v }),
  setAgreements: (v) => set({ agreements: v }),
  toggleAgreement: (index) =>
    set((state) => {
      const next = [...state.agreements];
      next[index] = !next[index];
      return { agreements: next };
    }),

  setIsSent: (v) => set({ isSent: v }),

  reset: () =>
    set({
      patientName: "",
      gender: "",
      birth: "",
      selectedCaseId: "case01",
      linkedDiagnosis: null,
      procedureName: "",
      procedurePart: "",
      procedureDate: "",
      medications: [],
      doctorNote: "",
      targetHospital: null,
      agreements: [false, false, false],
      isSent: false,
    }),
}));

export default useCaseSyncStore;