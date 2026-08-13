// 6-2 케이스 동기화: 전송 항목 선택 카드 버튼 (환자 정보, 시술 정보, 부작용 유형, 의료진 소견 등)

const CheckCardToggle = ({
  options = [],         // { label: '환자 정보', value: 'patient' } 형태의 배열
  selectedValues = [],  // 현재 체크된 값들의 배열
  onChange,             // 상태 변경 함수
  className = '',
}) => {
  const handleToggle = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className={`flex flex-nowrap gap-2 ${className}`}>
      {options.map((option) => {
        const isChecked = selectedValues.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#EDEDF1] px-2 py-2.5 transition-transform duration-200 ease-in-out hover:scale-105"
          >

            <span
              className={`relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ease-in-out ${
                isChecked ? 'border-[#6B5DD6] bg-[#6B5DD6]' : 'border-[#DADADA] bg-white'
              }`}
            >
              <img
                src="/icons/check-mark.svg"
                alt=""
                className={`h-1.25 w-1.75 transition-opacity duration-200 ease-in-out ${
                  isChecked ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </span>

            <span className="font-wantedsans text-[10px] font-medium leading-4.5 text-[#181818] whitespace-nowrap">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CheckCardToggle;
