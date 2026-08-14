import { useNavigate } from 'react-router-dom';

const Button = ({ 
  children, 
  onClick, 
  to, // 라우팅(페이지 이동)을 위한 prop
  disabled = false, 
  variant = 'primary', // 버튼 종류 선택 (primary, primary-shadow, primary-plus, outline, outline-shadow, outline-white, underline)
  className = '' 
}) => {
  const navigate = useNavigate();

  // 버튼 클릭 시 onClick이 있으면 실행하고, to prop이 있으면 해당 경로로 이동
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (to) navigate(to);
  };

  //공통 스타일 (모든 버튼에 적용되는 속성)
  const baseStyles = 'flex items-center justify-center font-wantedsans transition-all duration-200 ease-in-out';

  // 버튼 종류별 스타일 지정
  const variants = {
    
    // 기존 보라색 기본 버튼
    primary: `h-12 w-full gap-2.5 rounded-[10px] px-3.5 py-3 text-[18px] font-medium leading-normal text-white ${
      disabled
        ? 'cursor-not-allowed bg-[#DADADA]'
        : 'cursor-pointer bg-[#6B5DD6] hover:scale-[1.02] active:scale-[0.98] active:brightness-90'
    }`,
    
    // 그림자가 추가된 보라색 버튼
    'primary-shadow': `h-12 w-full gap-2.5 rounded-[10px] px-3.5 py-3 text-[18px] font-medium leading-normal text-white shadow-[-1px_-1px_10px_0_rgba(192,192,192,0.01),1px_1px_20px_0_rgba(192,192,192,0.40)] ${
      disabled
        ? 'cursor-not-allowed bg-[#DADADA]'
        : 'cursor-pointer bg-[#6B5DD6] hover:scale-[1.02] active:scale-[0.98] active:brightness-90'
    }`,

    // 왼쪽에 + 아이콘이 붙은 보라색 버튼 (새 케이스 시작하기 등)
    'primary-plus': `h-12 w-full gap-2.5 rounded-[10px] px-3.5 py-3 text-[18px] font-medium leading-normal text-white ${
      disabled
        ? 'cursor-not-allowed bg-[#DADADA]'
        : 'cursor-pointer bg-[#6B5DD6] hover:scale-[1.02] active:scale-[0.98] active:brightness-90'
    }`,

    // 하얀색 버튼
    'outline': `h-12 w-full gap-2.5 rounded-[10px] border border-[#6B5DD6] bg-white p-2.5 text-[16px] font-medium leading-normal text-[#6B5DD6] ${
      disabled
        ? 'cursor-not-allowed border-[#DADADA] text-[#DADADA] shadow-none'
        : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] active:bg-gray-50'
    }`,


    // 하얀색 테두리 그림자 버튼
    'outline-shadow': `h-12 w-full gap-2.5 rounded-[10px] border border-[#6B5DD6] bg-white p-2.5 text-4 font-medium leading-normal text-[#6B5DD6] shadow-[-1px_-1px_10px_0_rgba(192,192,192,0.01),1px_1px_20px_0_rgba(192,192,192,0.40)] ${
      disabled
        ? 'cursor-not-allowed border-[#DADADA] text-[#DADADA] shadow-none'
        : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] active:bg-gray-50'
    }`,

    // 보라색 배경 위에서 쓰는 흰 테두리 버튼 (역할 선택 화면 등)
    'outline-white': `h-12 w-full gap-2.5 rounded-[10px] border border-white bg-transparent p-2.5 text-[16px] font-medium leading-normal text-white ${
      disabled
        ? 'cursor-not-allowed border-white/40 text-white/40'
        : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] active:bg-white/10'
    }`,


    // 밑줄(회원가입) 버튼 
    underline: `gap-2.5 border-b border-[#8C8C8C] py-px text-sm font-medium leading-normal text-[#8C8C8C] ${
      disabled
        ? 'cursor-not-allowed opacity-50'
        : 'cursor-pointer hover:text-gray-600 hover:border-gray-600 active:text-gray-800'
    }`
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {variant === 'primary-plus' && (
        <img src="/icons/plus-white.svg" alt="" className="h-4 w-4" />
      )}
      {children}
    </button>
  );
};

export default Button;