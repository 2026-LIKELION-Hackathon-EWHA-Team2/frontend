// 클릭 안 되는 카드...라 
const CaseSummaryCard = ({
  patientName,
  caseId,
  consultType,
  hospital,
  requestedAt,
  rightContent, // 우측 슬롯 ('상세 보기' SmallButton). 필요 없으면 생략.
  className = '',
}) => {
  return (
    <div
      className={`flex w-full items-center gap-4 rounded-[0.625rem] border border-[#EDEDF1] py-2 px-2.5 ${className}`}
    >
      <div className="flex h-11.25 w-11.25 shrink-0 items-center justify-center rounded-full bg-[#F1F0F3]">
        <img src="/icons/profile-outline.svg" alt="" className="h-6 w-6" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex flex-col gap-[0.0625rem]">
        <p className="text-[#181818] font-wantedsans text-sm font-medium leading-[1.125rem]">{patientName}</p>
        <p className="text-[#686868] font-wantedsans text-[0.5625rem] font-medium leading-normal">
          Case #{caseId} &nbsp;|&nbsp; {consultType}
        </p>
        </div>
        <div className="flex items-center gap-1">
          <img src="/icons/case-hospital.svg" alt="" className="h-3 w-3" />
          <span className="text-[#686868] text-center font-wantedsans text-[0.625rem] font-normal leading-[0.875rem]">{hospital}</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/icons/case-clock.svg" alt="" className="h-3 w-3" />
          <span className="text-[#686868] text-center font-wantedsans text-[0.625rem] font-normal leading-[0.875rem]">
            요청시간&nbsp;&nbsp;{requestedAt}
          </span>
        </div>
      </div>

      {rightContent && <div className="shrink-0">{rightContent}</div>}
    </div>
  );
};

export default CaseSummaryCard;