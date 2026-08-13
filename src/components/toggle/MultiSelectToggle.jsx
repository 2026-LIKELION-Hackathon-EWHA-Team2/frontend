// 환자측 6-1 AI 추천 병원 매칭 - 1. 개인화 설정 언어지원 다중 선택 토글

const MultiSelectToggle = ({
  options = [],         // { label: '영어', value: 'en' } 형태의 배열
  selectedValues = [],  // 현재 선택된 값들의 배열 ['en', 'jp']
  onChange,             // 상태 변경 함수
  className = ''
}) => {
  // 토글 클릭 시 실행되는 함수 (있으면 빼고, 없으면 넣기)
  const handleToggle = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div
      className={`flex p-2.5 flex-wrap items-start gap-2.25 rounded-[10px] border border-[#EDEDF1] ppx-3py-[10px] px-4 py-2.5 bg-white ${className}`}
    >
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);

        return (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-full px-3.5 py-1 font-wantedsans text-[14px] font-medium transition-colors duration-200 ease-in-out
              ${
                isSelected
                  ? 'border border-[#6B5DD6] bg-[#6B5DD6] text-white' // 선택됨
                  : 'border border-[#EDEDF1] bg-white text-[#626262] hover:bg-gray-50' // 선택 안 됨
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default MultiSelectToggle;