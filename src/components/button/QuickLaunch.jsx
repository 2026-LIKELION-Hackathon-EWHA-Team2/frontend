import { useNavigate } from 'react-router-dom';

// 홈화면의 '빠른 실행' 버튼입니다!

const QuickLaunch = ({ 
  title, 
  description, 
  iconPath, 
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
        flex w-full items-center gap-3 py-5 pl-3 pr-2.5
        rounded-[10px] border border-[#EDEDF1] bg-white text-left
        cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] active:bg-gray-50
        ${className}
      `}
    >
      <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full bg-[#F1F0F3]">
        <img src={iconPath} alt="" className="h-6 w-6" />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <span className="font-wantedsans text-[13px] font-medium text-[#181818]">
          {title}
        </span>
        <span className="font-wantedsans text-[10px] font-normal leading-3.5 text-[#737373]">
          {description}
        </span>
      </div>

      <img src="/icons/arrow-right.svg" alt="이동" className="h-4 w-4 shrink-0" />
    </button>
  );
};

export default QuickLaunch;