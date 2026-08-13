// 누르면 페이지가 바뀌는 PillToggle
// 3-2 진단서 입력 페이지에서, 진단서 불러오기/직접 업로드 선택 버튼입니다!
// 2-2 동의철회이력/공유이력 선택 버튼입니다!

const PageToggle = ({ 
  variant = 'box', // 'box' (진단서 방식) | 'underline' (이력 조회)
  options = [], 
  selectedValue, 
  onChange, 
  className = '' 
}) => {
  
  // 밑줄형 토글 렌더링
  if (variant === 'underline') {
    return (
      <div className={`flex w-full ${className}`}>
        {options.map((option) => {
          const isSelected = selectedValue === option;
          
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`
                flex flex-1 items-center justify-center gap-2.5 p-2.5
                cursor-pointer transition-all duration-200 ease-in-out
                ${isSelected 
                  ? 'border-b-[1.5px] border-[#6B5DD6] text-[#6B5DD6]' 
                  : 'border-b border-[#DADADA] text-[#626262] hover:bg-gray-50' 
                }
              `}
            >
              <span className="font-wantedsans text-sm font-medium leading-4">
                {option}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // 박스형 토글 렌더링
  return (
    <div className={`flex w-full items-center gap-2 rounded-[10px] border border-[#EDEDF1] bg-white py-1.5 pl-1 pr-2 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValue === option;
        
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`
              flex h-11 flex-1 items-center justify-center gap-2.5 rounded-[10px] px-3.5 py-3 
              cursor-pointer transition-all duration-200 ease-in-out
              ${isSelected 
                ? 'border border-[#6B5DD6] bg-[#A78AF4]/10 text-[#212121]' 
                : 'border border-transparent bg-transparent text-[#212121] hover:bg-gray-50' 
              }
            `}
          >
            <span className="font-wantedsans text-sm font-medium leading-4.5">
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PageToggle;