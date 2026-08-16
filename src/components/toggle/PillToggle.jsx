// PillToggle, 하나만 선택 가능한 형태의 선택 버튼
// 여성/남성, 시술직후/시술후며칠뒤


const PillToggle = ({ 
  options = [], 
  selectedValue, 
  onChange, 
  className = '' 
}) => {
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
              flex flex-1 items-center justify-center gap-2.5 rounded-[10px] border px-3.5 py-3 transition-colors
              cursor-pointer duration-200 ease-in-out
              ${isSelected 
                ? 'border-[#6B5DD6] bg-[rgba(167,138,244,0.10)]'
                : 'border-[#DADADA] bg-white hover:bg-gray-50'     
              }
            `}
          >
            {/* 글씨 스타일 */}
            <span className="text-[#181818] font-wantedsans text-[0.75rem] font-medium leading-normal">
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PillToggle;