// 3-3 증상 입력 페이지에서, 통증 정도를 나타내는 동그라미 모양 토글입니다!

const DotToggle = ({ 
  options = [], 
  selectedValue, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`flex items-start justify-center px-3 gap-14 sm:gap-12.5 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValue === option;
        
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className="group flex cursor-pointer flex-col items-center gap-2"
          >
            {/* 동그라미 영역 */}
            <div className={`
              flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200 ease-in-out
              ${isSelected 
                ? 'bg-[#6B5DD6]' 
                : 'border border-[#CBCBCB] bg-white group-hover:border-gray-400 group-active:bg-gray-100' // 선택 안 됨: 회색 테두리, 호버 시 테두리 진해짐
              }
            `}>
              {/* 선택되었을 때만 나타나는 안쪽 하얀색 작은 점 */}
              {isSelected && (
                <div className="h-1 w-1 rounded-full bg-white" />
              )}
            </div>

            {/* 텍스트 영역 */}
            <span className="whitespace-nowrap text-[#181818] font-wantedsans text-[0.5625rem] font-medium leading-normal transition-colors duration-200 group-hover:text-gray-600">
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DotToggle;