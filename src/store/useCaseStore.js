import { create } from 'zustand';
import { MOCK_RECENT_CASES } from '../mock/mockdata';

// 홈 '최근 케이스' 목록 상태. 새 케이스 등록 시 addCase로 목록에 추가!!
const useCaseStore = create((set) => ({
  cases: MOCK_RECENT_CASES,
  addCase: (newCase) => set((state) => ({ cases: [...state.cases, newCase] })),
}));

export default useCaseStore;
