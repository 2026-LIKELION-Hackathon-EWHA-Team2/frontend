/*
 * 로딩 중인 화면을 나타날 때 쓰는 컴포넌트
 */
const LoadingState = ({ title = '불러오는 중입니다...', description }) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin [animation-duration:1.2s] rounded-full border-4 border-[#6B5DD6] border-t-transparent" />
      <p className="mt-1 text-sm font-medium font-wantedsans text-black">{title}</p>
      {description && <p className="text-xs font-wantedsans text-[#2c2c2c]">{description}</p>}
    </div>
  );
};

export default LoadingState;