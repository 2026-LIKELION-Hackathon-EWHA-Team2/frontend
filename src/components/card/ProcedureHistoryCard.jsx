// 2-4 시술 이력(여권) 목록의 카드 한 개

import SmallButton from '../button/SmallButton';

const ProcedureHistoryCard = ({ name, hospital, location, date, to, onClick, className = '' }) => {
  return (
    <div
      className={`flex items-end justify-between self-stretch rounded-[10px] border border-[#EDEDF1] p-3 ${className}`}
    >
      <div className="flex flex-col gap-2">
        <p className="font-wantedsans text-base font-bold text-[#181818]">{name}</p>

        <div className="flex items-center gap-1">
          <img src="/icons/location-gray.svg" alt="" className="h-3.5 w-3.5" />
          <span className="font-wantedsans text-xs font-normal text-[#737373]">
            {hospital}&nbsp;&nbsp;{location}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <img src="/icons/calendar.svg" alt="" className="h-3.5 w-3.5" />
          <span className="font-wantedsans text-xs font-normal text-[#737373]">{date}</span>
        </div>
      </div>

      <SmallButton variant="arrow" label="상세 보기" to={to} onClick={onClick} />
    </div>
  );
};

export default ProcedureHistoryCard;
