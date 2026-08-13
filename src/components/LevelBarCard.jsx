import LevelBar from './LevelBar';

/*
 * 선호 기준 선택 등에 쓰이는 bar card 컴포넌트!
 * icon: <img> 등 아이콘 요소 그대로 넣어주시면 됩니다!
 * title, description: 상단 텍스트
 * value: 현재 단계 (1부터 시작)
 * onChange: 단계 변경 콜백 
 * levelLabels: 단계별 이름 배열 (['낮음', '보통', '높음'])
 */
const LevelBarCard = ({ icon, title, description, value, onChange, levelLabels }) => {
  return (
    <div className="rounded-[0.625rem] border border-[#EDEDF1] px-2.5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-[1.7rem] w-[1.7rem] shrink-0 items-center justify-center rounded-full bg-[#A78AF4]/10">
          {icon}
        </div>
        <div>
          <p className="text-black font-wantedsans text-[0.8125rem] font-medium leading-normal">
            {title}
          </p>
          <p className="mt-1 text-[#686868] font-wantedsans text-[0.625rem] font-medium leading-normal">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-2 mr-6 flex items-center gap-3">
        <div className="h-0 w-8 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <LevelBar value={value} onChange={onChange} steps={levelLabels.length} />
        </div>
        <span className="w-15 text-[#686868] text-center font-wantedsans text-[0.625rem] font-medium leading-normal">
          {levelLabels[value - 1]}
        </span>
      </div>
    </div>
  );
};

export default LevelBarCard;