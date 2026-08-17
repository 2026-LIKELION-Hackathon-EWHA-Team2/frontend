import { create } from 'zustand';

// 화면 하단에 잠깐 떴다가 사라지는 토스트 메시지 store
// showToast(message)를 호출하면 지정된 시간 뒤 자동으로 사라짐
// (연속 호출 시 이전 타이머는 취소하고 새로 시작 - 메시지가 중간에 잘리지 않도록)

let hideTimer = null;

const useToastStore = create((set) => ({
  message: '',
  visible: false,

  showToast: (message, duration = 2500) => {
    clearTimeout(hideTimer);
    set({ message, visible: true });
    hideTimer = setTimeout(() => set({ visible: false }), duration);
  },

  hideToast: () => {
    clearTimeout(hideTimer);
    set({ visible: false });
  },
}));

export default useToastStore;
