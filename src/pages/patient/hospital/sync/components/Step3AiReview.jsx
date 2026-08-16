// [step 3] AI가 구조화한 시술 정보 / 약물 성분 / 의료진 소견 확인

import useCaseSyncStore from '../../../../../store/useCaseSyncStore';

const Step3AiReview = () => {
  const { procedureName, procedurePart, procedureDate, medications, doctorNote } = useCaseSyncStore();

  const INFO_ROWS = [
    { label: '시술명', value: procedureName },
    { label: '시술 부위', value: procedurePart },
    { label: '시술 일자', value: procedureDate },
  ];

  return (
    <div className="flex flex-col">
      <div className="mb-9 flex flex-col items-center text-center">
        <div className="mb-4 flex items-center justify-center">
          <img src="/icons/clipboard-check.svg" alt="" className="h-17.5 w-17.5" />
        </div>
        <p className="mb-1 text-[#181818] text-center font-wantedsans text-xl font-medium leading-normal">
          케이스 검토
        </p>
        <p className="text-[#626262] font-wantedsans text-[0.6875rem] font-medium leading-normal">
          한국 병원이 입력한 내용 기반으로 AI가 분석한 정보를 확인해주세요.
        </p>
      </div>

      <p className="mb-2 flex items-center gap-1 text-[#181818] font-wantedsans text-sm font-medium leading-[1.125rem]">
        <img src="/icons/docs-check.svg" alt="" className="h-4.75 w-4.75" />
        시술 정보
      </p>
      <div className="mb-3 rounded-[0.625rem] border border-[#EDEDF1] px-3 py-1.5">
        {INFO_ROWS.map((row, idx) => (
          <div
          key={row.label}
          className={`flex items-center gap-3 py-2 ${
            idx !== INFO_ROWS.length - 1 ? 'border-b border-[#EDEDF1]' : ''
          }`}
        >
          <span className="w-24 shrink-0 text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-[1.125rem]">
            {row.label}
          </span>
          <span className="text-[#626262] font-wantedsans text-[0.6875rem] font-medium leading-[1.125rem]">
            {row.value}
          </span>
        </div>
        ))}
      </div>

      <p className="mb-2 flex items-center gap-1.25 text-[#181818] font-wantedsans text-sm font-medium leading-[1.125rem]">
        <img src="/icons/flask.svg" alt="" className="h-4.45 w-4.45" />
        약물 재료 성분명
      </p>
      <div className="mb-5 flex flex-col gap-1">
        {medications.map((med) => (
          <div
            key={med}
            className="rounded-[0.625rem] border border-[#EDEDF1] bg-white px-3 py-1 text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-[1.125rem]"
          >
            {med}
          </div>
        ))}
      </div>

      <p className="mb-2 flex items-center gap-2 text-[#181818] font-wantedsans text-sm font-medium leading-[1.125rem]">
        <img src="/icons/chat-check.svg" alt="" className="h-4 w-4" />
        의료진 소견
      </p>
      <div className="rounded-[0.625rem] border border-[#EDEDF1] bg-white px-3 py-1">
        <p className="text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-[1.125rem]">{doctorNote}</p>
      </div>
    </div>
  );
};

export default Step3AiReview;