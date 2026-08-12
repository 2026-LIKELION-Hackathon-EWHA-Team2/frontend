// 6-2 케이스 동기화페이지에서, 부작용을 복수 선택하는 토글입니다

const TextChipToggle = ({
  options = [],
  selectedValues = [],
  onChange,
  className = ''
}) => {
  const handleToggle = (id) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((value) => value !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    // 💡 grid-cols-3로 3칸을 나누고, gap-5(20px)로 정확한 간격을 설정! 
    // width를 고정하지 않고 w-full을 주어 화면 크기에 맞춰 유연하게 변함.
    <div className={`grid w-full grid-cols-3 gap-5 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);

        return (
          <button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            // 💡 h-[60px], px-5, py-2.5 등 테일윈드 표준 문법과 둥근 모서리(rounded-[10px]) 적용
            className={`
              relative flex h-[60px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border px-5 py-2.5 transition-all duration-200 ease-in-out
              ${isSelected
                ? 'border-[#6B5DD6] bg-[#A78AF4]/10'
                : 'border-[#DADADA] bg-white hover:bg-gray-50'
              }
            `}
          >
            {/* 🟣 우측 상단 체크 아이콘 */}
            {isSelected && (
              <img
                src="/icons/symptom-area-check.svg"
                alt="체크됨"
                className="absolute -right-1.5 -top-1.5 h-4 w-4"
              />
            )}

            {/* 📝 글씨 영역 (선택 유무 상관없이 #181818 색상 유지) */}
            <span className="font-wantedsans text-sm font-medium text-[#181818]">
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TextChipToggle;