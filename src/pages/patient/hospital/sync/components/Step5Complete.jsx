// [step 5] 전송 완료 안내

const Step5Complete = () => {
  return (
    <div className="flex flex-col items-center pt-10 text-center">
      <div className="mb-5 flex items-center justify-center">
        <img src="/icons/send-check.svg" alt="" className="h-25 w-25" />
      </div>
      <p className="mb-3 text-[#181818] text-center font-wantedsans text-2xl font-medium leading-normal">
        전송되었습니다!
      </p>
      <p className="text-[#626262] text-center font-wantedsans text-[0.8125rem] font-medium leading-[1.25rem]">
        선택한 자국 병원으로 케이스가 안전하게 전송되었습니다.
        <br />
        해당 병원 수신함에서 내용을 확인할 수 있습니다.
      </p>
    </div>
  );
};

export default Step5Complete;