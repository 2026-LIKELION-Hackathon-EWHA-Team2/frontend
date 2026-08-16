import SmallButton from '../button/SmallButton';

// AI 추천 병원 리스트 / 네트워크 병원 목록에서 쓰이는 병원 카드
// props: image, name, department, distance, onDetailClick

const HospitalCard = ({ image, name, department, distance, onDetailClick }) => {
  return (
    <div className="flex items-start gap-5.25 self-stretch rounded-[10px] border border-[#EDEDF1] p-3">
      <div className="h-10.5 w-10.5 shrink-0 overflow-hidden rounded-full bg-[#F5F5F5]">
        <img src={image || '/icons/photo-none.svg'} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 items-start justify-between gap-2">
        <div className="-ml-1 flex flex-col gap-1">
          <p className="self-stretch font-wantedsans text-sm font-medium leading-normal text-black">
            {name}
          </p>
          <p className="self-stretch font-wantedsans text-[11px] font-medium leading-normal text-[#626262]">
            {department}
          </p>
          <div className="flex items-center gap-1">
            <img src="/icons/location-black.svg" alt="" className="h-2.5 w-2.5" />
            <span className="font-wantedsans text-[10px] font-medium leading-normal text-[#626262]">
              {distance}
            </span>
          </div>
        </div>

        <SmallButton variant="arrow" label="상세 보기" onClick={onDetailClick} />
      </div>
    </div>
  );
};

export default HospitalCard;
