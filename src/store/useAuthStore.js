import { create } from 'zustand';

// 개인/병원 role 선택, 로그인에서 사용하는 공용 인증 store
// role: 'patient' | 'hospital' | null
const useAuthStore = create((set) => ({
  role: null,
  isLoggedIn: false,
  userId: '',

  setRole: (role) => set({ role }),

  login: (userId) => set({ isLoggedIn: true, userId }),

  logout: () => set({ isLoggedIn: false, userId: '', role: null }),
}));

export default useAuthStore;