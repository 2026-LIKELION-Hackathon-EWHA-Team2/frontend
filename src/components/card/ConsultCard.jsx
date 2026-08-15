// 2-4-1 상세수술 이력 페이지에서, 관련 협진 이력 카드이자 버튼입니다. 클릭 시 상세 페이지로 이동합니다.

import Badge from '../Badge'; 

const ConsultCard = ({
  caseId = '2026-0813',
  hospitalName = 'Tokyo Medical',
  date = '2026.07.31',
  status = '확인 서명 완료',
  isSelected = false,
  showBadge = true,
  onClick,
  className = ''
}) => {
    // 상태에 따른 뱃지 톤 매핑 (Badge.jsx의 TONE_CLASSES와 매칭했습니다!)
  const getBadgeTone = (statusText) => {
    if (statusText.includes('대기중')) return 'orange';
    if (statusText.includes('완료')) return 'mint';
    return 'gray'; // 기본값
  };


  return (
    <div
      onClick={onClick}
      className={`
        relative flex w-full cursor-pointer items-center justify-between rounded-[10px] border border-[#EDEDF1] bg-white px-4 py-2 transition-all duration-150 ease-in-out hover:bg-gray-50 active:border-[#6B5DD6] active:bg-[#f7f4fd]
        ${className}
      `}
    >
      <div className="flex items-center gap-4">
        
        <div className="flex h-11.25 w-11.25 shrink-0 items-center justify-center rounded-full bg-[#F1F0F3]">
          <img
            src="/icons/home-case.svg"
            alt="Case Icon"
            className="h-[25.7px] w-[25.7px]"
          />
        </div>

        {/* 텍스트 정보 그룹 */}
        <div className="flex flex-col gap-1.5">
          
          {/* Case 타이틀 */}
          <span className="font-wantedsans text-[14px] font-medium -mb-0.5 leading-4.5xt-[#181818]">
            Case #{caseId}
          </span>

          {/* 서브 정보 그룹 */}
          <div className="flex flex-col gap-0.75">
            {/* 병원 정보 */}
            <div className="flex items-center gap-1">
              <img src="/icons/case-hospital.svg" alt="Hospital" className="h-3 w-3" />
              <span className="font-wantedsans text-[10px] font-normal leading-3.5 text-[#686868]">
                {hospitalName}과 협진
              </span>
            </div>
            
            {/* 날짜 정보 */}
            <div className="flex items-center gap-1">
              <img src="/icons/case-clock.svg" alt="Clock" className="h-3 w-3" />
              <span className="font-wantedsans text-[10px] font-normal leading-3.5 text-[#686868]">
                {date}
              </span>
            </div>
          </div>
          
        </div>
      </div>

      {/* 우측 상단 뱃지 */}
      {showBadge && (
        <div className="absolute right-[15.162px] top-2.25">
          {/* status에 따라 tone이 자동으로 바뀜 */}
          <Badge tone={getBadgeTone(status)} rounded="md" size="lg">
            {status}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ConsultCard;