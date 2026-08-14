import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 개인/병원 role 선택, 로그인에서 사용하는 공용 인증 store
// role: 'patient' | 'hospital' | null

// 체크 해제 시엔 브라우저 닫으면 날아가는 sessionStorage,
// 체크 시엔 localStorage에 저장 (플래그는 localStorage에 별도 보관하도록!!)
const dynamicStorage = {
  getItem: (name) =>
    (localStorage.getItem('keepLoggedIn') === 'false' ? sessionStorage : localStorage).getItem(name),
  setItem: (name, value) =>
    (localStorage.getItem('keepLoggedIn') === 'false' ? sessionStorage : localStorage).setItem(name, value),
  removeItem: (name) =>
    (localStorage.getItem('keepLoggedIn') === 'false' ? sessionStorage : localStorage).removeItem(name),
};

const useAuthStore = create(
  persist(
    (set) => ({
      role: null,
      isLoggedIn: false,
      userId: '',

      setRole: (role) => set({ role }),

      login: (userId, keepLoggedIn = true) => {
        localStorage.setItem('keepLoggedIn', String(keepLoggedIn));
        set({ isLoggedIn: true, userId });
      },

      logout: () => {
        set({ isLoggedIn: false, userId: '', role: null });
        localStorage.removeItem('keepLoggedIn');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => dynamicStorage),
      partialize: (state) => ({
        role: state.role,
        isLoggedIn: state.isLoggedIn,
        userId: state.userId,
      }),
    }
  )
);

export default useAuthStore;