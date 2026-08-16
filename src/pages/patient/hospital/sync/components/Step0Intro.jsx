// [step 0] 케이스 동기화 인트로 - 진행 절차 안내

const Step0Intro = () => {
  return (
    <div className="flex flex-col">
      <div className="mt-[1.36rem] mb-[0.86rem] flex flex-col items-center text-center">
        <p className="mb-3 text-black font-wantedsans text-lg font-medium leading-normal">
          의료 정보 동기화를 시작합니다.
        </p>
        <p className="text-[#686868] text-center font-wantedsans text-[0.6875rem] font-normal leading-normal">
          최적의 협진을 위해
          <br />
          다음 정보를 순서대로 입력해주세요.
        </p>
      </div>

      <img
        src="/icons/illustration-sync.svg"
        alt=""
        className="mt-[0.86rem] mb-[2.4rem] h-[5.9rem] shrink-0"
      />

      <p className="mb-3 text-[#181818] font-wantedsans text-sm font-medium leading-[1.125rem]">
        입력 단계 안내
      </p>
      <div className="mb-4 rounded-[0.625rem] border border-[#EDEDF1] px-4 py-4">
        <img src="/icons/case-sync-guide.svg" alt="" className="h-[8.25rem] shrink-0" /> 
      </div>

      <div className="flex items-start gap-2 rounded-[0.625rem] bg-[#F9F9FA] px-3 py-3">
        <img src="/icons/shield.svg" alt="" className="h-6 w-6 shrink-0" />
        <div className="flex flex-col">
          <span className="mb-1 text-[#181818] font-wantedsans text-xs font-medium leading-normal">
            안전한 데이터 보호
          </span>
          <span className="text-[#626262] font-wantedsans text-[0.625rem] font-normal leading-[0.75rem]">
            입력된 모든 정보는 암호화되어 안전하게 보호되며, 
            <br />협진 목적으로만 사용됩니다.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Step0Intro;