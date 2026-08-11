/*AI 추천 기준 분석 (50%, 100% 등) 화면에서 쓰는 원형 진행률 표시 컴포넌트*/

const ScoreDial = ({ percent, label, size = 145, strokeWidth = 5, className = '' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);
  
    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none stroke-[#EDEDF1]"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="fill-none stroke-[#6B5DD6] transition-[stroke-dashoffset] duration-700"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute flex flex-col items-center gap-1.5">
          {label && <span className="text-[#181818] text-center font-wantedsans text-base font-bold leading-normal">{label}</span>}
          <span className="inline-flex items-baseline font-wantedsans text-[#6B5DD6]">
            <span className="text-[2rem] font-bold leading-normal">{percent}</span>
            <span className="text-xl font-bold leading-normal">%</span>
            </span>
        </div>
      </div>
    );
  };
  
  export default ScoreDial;