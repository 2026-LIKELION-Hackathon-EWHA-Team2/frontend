// 개인 정보 제공 동의

import { useState } from 'react';
import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import Button from '../../../../../components/button/Button';
import ConsentCheckbox from '../../../../../components/checkbox/ConsentCheckbox';
import useHospitalMatchStore from '../../../../../store/useHospitalMatchStore';
import useToastStore from '../../../../../store/useToastStore';
import { useConsentMatchRequestMutation } from '../../../../../hooks/useMockQueries';

const CONSENT_ITEMS = [
  { key: 'provide', label: '이 병원에 개인 정보를 제공하는 것에 동의합니다. (필수)' },
  { key: 'scope', label: '제공되는 정보의 항목과 목적을 확인했습니다. (필수)' },
  { key: 'purpose', label: '개인정보는 진료 및 상담 목적으로만 사용됩니다. (필수)' },
  { key: 'withdraw', label: '동의는 언제든지 철회할 수 있습니다. (필수)' },
];

const Step4Consent = ({ nextStep, prevStep }) => {
  const { matchRequestId, setPersonalInfoAgreed } = useHospitalMatchStore();
  const showToast = useToastStore((state) => state.showToast);
  const consentMutation = useConsentMatchRequestMutation();

  const [agreements, setAgreements] = useState(
    CONSENT_ITEMS.reduce((acc, item) => ({ ...acc, [item.key]: false }), {})
  );

  const allChecked = CONSENT_ITEMS.every((item) => agreements[item.key]);

  const toggleAll = (next) => {
    setAgreements(CONSENT_ITEMS.reduce((acc, item) => ({ ...acc, [item.key]: next }), {}));
  };

  // 이 API는 동의 정보만 저장하고 의료정보를 병원에 최종 전송하진 않음 (실제 Case 전송은 별도 흐름)
  const handleSubmit = () => {
    consentMutation.mutate(
      { matchRequestId, agreements },
      {
        onSuccess: () => {
          setPersonalInfoAgreed(true);
          nextStep();
        },
        onError: () => {
          showToast('동의 처리에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
      <Header title="개인 정보 동의" showBack onBack={prevStep} rightSlot={<></>} />

      <PageContainer className="flex flex-1 flex-col">
        <p className="mt-1 text-center font-wantedsans text-xs font-normal leading-normal text-[#626262]">
          매칭된 병원에 개인 정보를 공유하기 위해
          <br />
          아래 내용을 확인하고 동의해주세요.
        </p>

        <div className="mt-14 flex flex-col gap-3">
          {CONSENT_ITEMS.map((item) => (
            <ConsentCheckbox
              key={item.key}
              label={item.label}
              checked={agreements[item.key]}
              onChange={(next) => setAgreements((prev) => ({ ...prev, [item.key]: next }))}
            />
          ))}
        </div>

        <div className="mt-8">
          <ConsentCheckbox label="모두 동의합니다" checked={allChecked} onChange={toggleAll} />
        </div>
      </PageContainer>

      <div className="px-5.5 pb-6 pt-3">
        <Button
          variant="primary"
          disabled={!allChecked || consentMutation.isPending}
          onClick={handleSubmit}
        >
          {consentMutation.isPending ? '처리 중...' : '전송하기'}
        </Button>
      </div>
    </div>
  );
};

export default Step4Consent;