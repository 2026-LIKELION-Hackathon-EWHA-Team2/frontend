// 화면 하단에 잠깐 노출되는 토스트 메시지. useToastStore.showToast(message)로 어디서든 띄울 수 있음.
// 페이지 이동 직후에도 사라지지 않도록 App.jsx 최상단(라우트 밖)에 한 번만 렌더링해서 사용!!

import useToastStore from '../store/useToastStore';

const Toast = () => {
  const message = useToastStore((state) => state.message);
  const visible = useToastStore((state) => state.visible);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-70">
      <div className="relative mx-auto h-full max-w-md">
        <div
          className={`absolute bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#3D3D3D] px-4 py-3 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6B5DD6]">
            <img src="/icons/check-mark.svg" alt="" className="h-2.5 w-2.5" />
          </span>
          <span className="whitespace-nowrap font-wantedsans text-sm font-medium text-white">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Toast;
