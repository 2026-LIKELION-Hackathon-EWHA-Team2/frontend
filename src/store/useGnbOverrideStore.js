import { create } from 'zustand';

// 특정 페이지에서 실제 경로와 다른 하단 GNB 탭을 활성화하고 싶을 때 사용
// (예: /patient/my/passport/:id/consult 는 마이페이지 하위 경로지만 '병원' 탭을 활성 표시)
const useGnbOverrideStore = create((set) => ({
  overridePath: null,
  setOverridePath: (path) => set({ overridePath: path }),
  clearOverridePath: () => set({ overridePath: null }),
}));

export default useGnbOverrideStore;
