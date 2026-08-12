// 3-3 증상 입력페이지에서, 증상 복수 선택 토글입니다

const ChipToggle = ({
  options = [],
  selectedValues = [],
  onChange,
  customValue = '',
  onCustomChange,
  className = ''
}) => {
  // 토글 클릭 핸들러 (다중 선택 로직)
  const handleToggle = (id) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((value) => value !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    <div className={`justify-center flex w-full flex-wrap items-center gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.id);

        return (
          <div
            key={option.id}
            onClick={() => {
              // 입력창(isInput)이 아닐 때만 컨테이너 클릭으로 토글
              if (!option.isInput) {
                handleToggle(option.id);
              }
            }}
            // button 태그 대신 div를 사용해 input 중첩 오류 방지
            className={`
              relative flex h-18 w-15 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border transition-all duration-200 ease-in-out
              ${isSelected
                ? 'border-[#6B5DD6] bg-[#A78AF4]/10'
                : 'border-[#DADADA] bg-white hover:bg-gray-50'
              }
            `}
          >
            {/* 우측 상단 체크 아이콘 (선택되었을 때만 노출) */}
            {isSelected && (
              <img
                src="/icons/symptom-area-check.svg"
                alt="체크됨"
                className="absolute -right-1.5 -top-1.5 h-5 w-5"
              />
            )}

            {/* 메인 아이콘 */}
            <div className="flex h-8 items-center justify-center">
              <img 
                src={option.icon} 
                alt={option.label} 
                className={`
                  object-contain 
                  ${option.isInput ? 'h-5 w-5' : 'h-8 w-8'} 
                `} 
              />
            </div>
            {/* 직접 추가(Input) or 일반 텍스트 렌더링 */}
            {option.isInput ? (
              <input
                type="text"
                value={customValue}
                placeholder="직접 추가"
                onChange={(e) => {
                  const val = e.target.value;
                  if (onCustomChange) onCustomChange(val);
                  
                  // 글씨를 쓰면 자동으로 체크되고, 다 지우면 체크가 해제되는 로직
                  if (val.trim() !== '' && !selectedValues.includes(option.id)) {
                    onChange([...selectedValues, option.id]);
                  } else if (val.trim() === '' && selectedValues.includes(option.id)) {
                    onChange(selectedValues.filter((v) => v !== option.id));
                  }
                }}
                className={`
                  w-full bg-transparent text-center font-wantedsans text-[11px] font-medium leading-3.5 outline-none 
                  placeholder:text-[#181818]
                  ${isSelected ? 'text-[#6B5DD6]' : 'text-[#181818]'}
                `}
              />
            ) : (
              <span className={`font-wantedsans text-xs font-medium leading-4 ${isSelected ? 'text-[#6B5DD6]' : 'text-[#181818]'}`}>
                {option.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChipToggle;