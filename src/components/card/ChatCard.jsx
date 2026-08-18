// 병원 - 채팅 목록 카드 한 개 (환자 케이스 기준 협진 상대 병원과의 채팅방)

// - 기본: 채팅 목록에서처럼 오른쪽에 마지막 메시지 시간 + 안읽음 뱃지 표시
// - rightContent를 넘기면: 오른쪽 영역이 통째로 교체 -> 요렇게 수정해서 사용합니당 굿굿

import { useNavigate } from 'react-router-dom';

const ChatCard = ({
  patientName,
  caseId,
  hospital,
  time,
  unreadCount,
  to,
  rightContent, //요거 추가했어용
  className = '',
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-[10px] border border-[#EDEDF1] p-3 text-left transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F1F0F3]">
        <img src="/icons/profile-outline.svg" alt="" className="h-6 w-6" />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="font-wantedsans text-sm font-medium text-[#181818]">{patientName}</p>
        <p className="-mt-1 font-wantedsans text-[11px] font-normal text-[#626262]">
          Case #{caseId}
        </p>
        <div className="flex items-center gap-1">
          <img src="/icons/case-hospital.svg" alt="" className="h-3 w-3" />
          <span className="font-wantedsans text-[11px] font-normal text-[#737373]">{hospital}</span>
        </div>
      </div>

      {rightContent ? (
        <div
          className="flex shrink-0 flex-col items-end gap-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {rightContent}
        </div>
      ) : (
        <div className="flex shrink-0 self-start flex-col items-end gap-1.5">
          <span className="font-wantedsans text-[10px] font-normal text-[#8C8C8C]">{time}</span>
          {unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6B5DD6] font-wantedsans text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatCard;