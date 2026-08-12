/*
 * 협진이력서 화면의 케이스 진행 이력 세로 타임라인 컴포넌트! 
 * title: 상단 제목 (진행 이력처럼요!)
 * items: [{ title, date, done }]의 배열로 전달하는 구조입니당! — done=true인 항목은 보라색 체크 원으로 표시(확인 서명처럼)
 */
const CircleVerticalTimeline = ({ title, items }) => {
    return (
      <div>
        {title && (
          <p className="mb-3 text-[#181818] font-wantedsans text-sm font-bold leading-normal">
            {title}
          </p>
        )}
        <ol className="rounded-[0.625rem] border border-[#EDEDF1] px-4 py-4">
          {items.map((item, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex gap-3 pb-3 last:pb-0">
                <div className="relative flex w-6 shrink-0 flex-col items-center justify-center">
                  {!isFirst && (
                    <span className="absolute left-1/2 top-0 h-1/2 w-[0.0625rem] -translate-x-1/2 border-l border-dashed border-[#DADADA]" />
                  )}
                  {!isLast && (
                    <span className="absolute left-1/2 top-1/2 -bottom-3 w-[0.0625rem] -translate-x-1/2 border-l border-dashed border-[#DADADA]" />
                  )}
                  <div
                    className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-wantedsans text-[0.625rem] font-medium leading-[1.125rem] ${
                      item.done
                        ? 'bg-[#6B5DD6] text-white'
                        : 'border border-[#DADADA] bg-white text-[#181818]'
                    }`}
                  >
                    {item.done ? (
                      <img src="/icons/check-mark.svg" alt="완료" className="h-3 w-3" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                </div>
  
                <div>
                  <p className="text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-[1.125rem]">{item.title}</p>
                  <p className="text-[#626262] font-wantedsans text-[0.5625rem] font-normal leading-[1.125rem]">{item.date}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  };
  
  export default CircleVerticalTimeline;