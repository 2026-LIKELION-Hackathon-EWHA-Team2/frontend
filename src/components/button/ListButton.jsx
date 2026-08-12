import { useNavigate } from 'react-router-dom';

// 2-2 프로필 부분에 있는 회색 버튼입니다!

const ListButton = ({ 
  label, 
  to, 
  onClick, 
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (to) navigate(to);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        flex w-full items-end justify-between px-4 py-4
        rounded-[10px] bg-[#F5F5F5]
        cursor-pointer transition-colors hover:bg-gray-200 active:bg-gray-300
        ${className}
      `}
    >
      {/* 텍스트 영역 */}
      <span className="font-wantedsans text-[15px] font-bold text-[#181818]">
        {label}
      </span>
      
      {/* 화살표 아이콘 영역 */}
      <img 
        src="/icons/arrow-right.svg" 
        alt="이동" 
        className="h-5 w-5 pb-1 shrink-0"
      />
    </button>
  );
};

export default ListButton;