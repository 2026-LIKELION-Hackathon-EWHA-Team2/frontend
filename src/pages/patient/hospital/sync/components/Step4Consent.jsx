// [step 4] 전송 대상 병원 확인 + 전송 동의 체크

import useCaseSyncStore from '../../../../../store/useCaseSyncStore';
import CaseSubmitCheckbox from '../../../../../components/checkbox/CaseSubmitCheckbox';

const AGREEMENT_ITEMS = [
  { label: '시술 정보와 약물 관련 정보를 전송하는데 동의합니다. (필수)' },
  { label: '부작용 유형과 의료진 소견 전송에 동의합니다. (필수)' },
  { label: '국외 의료기간 전송 및 AI 번역 처리 안내를 확인했습니다. (필수)' },
];

const Step4Consent = () => {
  const { targetHospital, agreements, setAgreements } = useCaseSyncStore();

  return (
    <div className="flex flex-col">
      <div className="mb-9 flex flex-col items-center text-center">
        <div className="mb-[1.625rem] flex items-center justify-center">
          <img src="/icons/send-check.svg" alt="" className="h-17.5 w-17.5" />
        </div>
        <p className="mb-1 text-[#181818] text-center font-wantedsans text-xl font-medium leading-normal">
          전송 동의
        </p>
        <p className="text-[#626262] font-wantedsans text-[0.6875rem] font-medium leading-normal">
          AI가 요약한 리포트와 선택한 정보를 자국 병원으로 전송합니다.
          <br />
          전송 전 내용을 확인하고 동의해주세요.
        </p>
      </div>

      <p className="mb-2 text-[#181818] font-wantedsans text-sm font-medium leading-[1.125rem]">
        전송 대상 병원
      </p>
      {targetHospital && (
        <div className="mb-4 flex items-center gap-3 rounded-[0.625rem] border border-[#EDEDF1] px-3 py-2.5">
          <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]">
            <img src="/icons/case-hospital.svg" alt="" className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#181818] font-wantedsans text-[0.8125rem] font-medium leading-[1.125rem]">
              {targetHospital.name}
            </span>
            <span className="text-[#626262] font-wantedsans text-xs font-medium leading-[1.125rem]">
              {targetHospital.info}
            </span>
          </div>
        </div>
      )}

      <CaseSubmitCheckbox
        title="동의 항목"
        items={AGREEMENT_ITEMS}
        checkedList={agreements}
        onChangeList={setAgreements}
      />
    </div>
  );
};

export default Step4Consent;