import { useNavigate } from 'react-router-dom';

// 수정 버튼, 상세 보기, 미리 보기, 변경 버튼 등 작은 버튼들이 있습니다!

const SmallButton = ({ 
  variant = 'arrow', // 'edit' (수정) | 'arrow' (상세보기, 미리보기 등)
  label,
  onClick, 
  to, 
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (to) navigate(to);
  };

  // 공통 스타일
  const baseStyles = 'flex items-center justify-center gap-1 rounded-lg border border-[#DADADA] cursor-pointer transition-colors';

  // 수정 버튼 
  if (variant === 'edit') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`${baseStyles} bg-[#F7F7F7] px-2.5 py-1.5 hover:bg-gray-200 ${className}`}
      >
        <img src="/icons/edit.svg" alt="수정" className="h-4 w-4 shrink-0" />
        <span className="font-wantedsans text-xs font-medium text-[#181818]">
          {label || '수정'}
        </span>
      </button>
    );
  }

  // 화살표 버튼
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseStyles} bg-white py-1 pl-2 pr-1.5 hover:bg-gray-50 active:bg-[#EEE7FF]! active:border-[#6B5DD6]! ${className}`}
    >
      <span className="font-wantedsans text-[10px] font-medium leading-4 text-[#212121]">
        {label}
      </span>
      <img src="/icons/arrow-right.svg" alt="이동" className="h-2 w-2 shrink-0" />
    </button>
  );
};

export default SmallButton;