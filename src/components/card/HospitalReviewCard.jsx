// 협진 합의 - 참여 병원 카드 (검토 대기 / 검토 중 / 검토 완료 상태별 스타일)
// props: name, status ('검토 대기' | '검토 중' | '검토 완료')

const STATUS_STYLES = {
  '검토 대기': {
    container: 'border-[#EDEDF1] bg-white',
    dot: 'bg-[#9F9F9F]',
    text: 'text-[#9F9F9F]',
  },
  '검토 중': {
    container: 'border-[#6B5DD6] bg-[#F5F3FF]',
    dot: 'bg-[#181818]',
    text: 'text-[#181818]',
  },
  '검토 완료': {
    container: 'border-[#EDEDF1] bg-white',
    dot: 'bg-[#6B5DD6]',
    text: 'text-[#6B5DD6]',
  },
};

const HospitalReviewCard = ({ name, status }) => {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES['검토 대기'];
  // 자국 병원(로그인된 우리 병원)은 아이콘을 보라색으로 구분
  const isSelf = name === '자국 병원';

  return (
    <div className={`flex flex-1 items-center gap-3 rounded-[10px] border p-3 ${style.container}`}>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
          isSelf ? 'bg-[#EEE7FF]' : 'bg-[#F5F5F5]'
        }`}
      >
        <img src={isSelf ? '/icons/hospital-purple.svg' : '/icons/hospital-gray.svg'} alt="" className="h-7 w-7" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-wantedsans text-sm font-medium leading-normal text-[#181818]">{name}</p>
        <div className="flex items-center gap-1">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
          <span className={`font-wantedsans text-[11px] font-medium leading-normal ${style.text}`}>{status}</span>
        </div>
      </div>
    </div>
  );
};

export default HospitalReviewCard;
