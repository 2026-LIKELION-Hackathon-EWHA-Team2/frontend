/*
 * 회원가입/케이스 등록 등 다단계 상단 스텝 인디케이터 컴포넌트!
 * steps: 문자열 [] 형태로 주면 됨 (스텝 라벨)
 * currentIndex: 0부터 시작임! 3이면 2라고 입력해야 함!! 주의!! 
 * showLabel: 라벨 표시 여부
 * showCheck: 완료된 스텝에 체크 아이콘 사용 여부
 * width: 폭 설정 가능하도록 만듦! 
 */
const ProgressSteps = ({ steps, currentIndex, showLabel = true, showCheck = false, width, className = '' }) => {
    const circleSize = showCheck ? 'h-8 w-8' : 'h-7 w-7 text-xs leading-[1.125rem]';
  
    return (
      <ol className="mx-auto flex" style={{ width: width ?? '100%' }}>
        {steps.map((step, idx) => {
          const done = idx < currentIndex;
          const active = idx === currentIndex;
          const filled = done || active;
          const leftLineDone = idx <= currentIndex; 
          const rightLineDone = idx < currentIndex; 
  
          return (
            <li key={step} className="flex flex-1 flex-col">
              <div className="flex w-full items-center">
                {idx !== 0 && (
                  <div className={`h-[0.05rem] flex-1 ${leftLineDone ? 'bg-[#6B5DD6]' : 'bg-[#DFDFE4]'}`} />
                )}
                {/* 원+라벨을 같은 부모(items-center)로 묶어서 라벨 텍스트 중심이 항상 원 중심과 일치하도록 함 */}
                <div className="flex shrink-0 flex-col items-center">
                  <div
                    className={`flex ${circleSize} shrink-0 items-center justify-center rounded-full font-medium font-wantedsans ${
                      filled ? 'bg-[#6B5DD6] text-white' : 'border border-[#C7C7CC] bg-[#FFFEFE] text-[#C7C7CC]'
                    }`}
                  >
                    {done && showCheck ? (
                      <img src="/icons/check-mark.svg" alt="완료" className="h-4 w-4" />
                    ) : (
                      <span className="text-sm">{idx + 1}</span>
                    )}
                  </div>
                  {showLabel && (
                    <span
                      className={`mt-1 whitespace-nowrap font-wantedsans text-[0.625rem] font-medium leading-normal ${
                        filled ? 'text-[#6B5DD6]' : 'text-[#C7C7CC]'
                      }`}
                    >
                      {step}
                    </span>
                  )}
                </div>
                {idx !== steps.length - 1 && (
                  <div className={`h-[0.05rem] flex-1 ${rightLineDone ? 'bg-[#6B5DD6]' : 'bg-[#DFDFE4]'}`} />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  };
  
  export default ProgressSteps;