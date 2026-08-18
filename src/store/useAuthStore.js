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
      accessToken: '',
      refreshToken: '', // refresh 엔드포인트 따로 없고, accessToken 유효기간 길게 잡아서 만료 시 그냥 로그아웃되는 걸로!

      setRole: (role) => set({ role }),

      login: ({ userId, role, accessToken, refreshToken }, keepLoggedIn = true) => {
        // 어느 storage(local/session)를 쓸지 결정하는 플래그부터 저장해두고
        localStorage.setItem('keepLoggedIn', String(keepLoggedIn));
        // 그 다음 상태를 저장해야 dynamicStorage가 올바른 storage에 씀 (순서 중요!)
        set({ isLoggedIn: true, userId, role, accessToken, refreshToken });
      },

      logout: () => {
        set({ isLoggedIn: false, userId: '', role: null, accessToken: '', refreshToken: '' });
        localStorage.removeItem('auth-storage'); // localStorage에 남아있을 수 있는 이전 세션 정보 확실히 제거
        sessionStorage.removeItem('auth-storage'); // sessionStorage에 남아있을 수 있는 이전 세션 정보 확실히 제거
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
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;