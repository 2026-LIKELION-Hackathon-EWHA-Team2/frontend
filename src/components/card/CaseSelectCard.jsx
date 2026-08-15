// 병원 - 케이스 선택 화면의 케이스 카드. 선택되면 보라색으로 강조됨!
// props: title, thumbnails, recordedAt, symptoms, symptomStartedAt, selected, onClick
// 병원 측 화면에서도 해당 컴포넌트 재활용되는 것 같으니 요긴하게 써보길...

const VISIBLE_THUMB_SLOTS = 3;

const CaseSelectCard = ({
  title,
  thumbnails = [],
  recordedAt,
  symptoms,
  symptomStartedAt,
  selected = false,
  onClick,
}) => {
  // 미리보기는 항상 3칸까지만, 그 이상은 마지막 칸에 +N으로 표시
  const slots = Array.from({ length: VISIBLE_THUMB_SLOTS }, (_, i) => thumbnails[i]);
  const extraCount = Math.max(thumbnails.length - VISIBLE_THUMB_SLOTS, 0);

  const rows = [
    ['기록 일시', recordedAt],
    ['선택 증상', symptoms],
    ['증상 시작일', symptomStartedAt],
  ];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-end justify-between self-stretch rounded-[10px] border px-3 py-2.5 text-left transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] ${
        selected ? 'border-[#6B5DD6] bg-[#6B5DD6]/5' : 'border-[#EDEDF1] bg-white'
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.25">
            {slots.map((thumb, idx) => {
              const isLastVisible = idx === VISIBLE_THUMB_SLOTS - 1;
              const showMoreOverlay = isLastVisible && extraCount > 0;

              return (
                <div
                  key={idx}
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F5F5F5]"
                >
                  {thumb ? (
                    <img src={thumb} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <img src="/icons/photo-none.svg" alt="" className="h-full w-full object-cover" />
                  )}
                  {showMoreOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="font-wantedsans text-xs font-semibold text-white">+{extraCount}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-center font-wantedsans text-base font-medium leading-normal text-[#181818]">{title}</p>
        </div>

        <div className="flex flex-col gap-1">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-6">
              <span className="font-wantedsans text-xs font-medium text-[#181818]">{label}</span>
              <span className="font-wantedsans text-xs font-normal text-[#686868]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#DADADA]">
        <img src="/icons/arrow-right.svg" alt="" className="h-3 w-3" />
      </span>
    </button>
  );
};

export default CaseSelectCard;
