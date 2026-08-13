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
    <div className={`grid w-full grid-cols-3 gap-5 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);

        return (
          <button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            className={`
              relative flex h-15 w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border px-5 py-2.5 transition-all duration-200 ease-in-out
              ${isSelected
                ? 'border-[#6B5DD6] bg-[#A78AF4]/10'
                : 'border-[#DADADA] bg-white hover:bg-gray-50'
              }
            `}
          >
            {/* 우측 상단 체크 아이콘 */}
            {isSelected && (
              <img
                src="/icons/symptom-area-check.svg"
                alt="체크됨"
                className="absolute -right-1.5 -top-1.5 h-4 w-4"
              />
            )}

            {/* 글씨 영역 */}
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