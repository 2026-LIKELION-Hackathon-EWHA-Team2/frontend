// (부모) 합의서 상태 관리

import { useEffect, useState } from 'react';
import Step1AiDraft from './components/Step1AiDraft';
import Step2Edit from './components/Step2Edit';
import Step3EditComplete from './components/Step3EditComplete';
import Step4Final from './components/Step4Final';
import QueryState from '../../../../components/state/QueryState';
import { useAgreementDraftQuery } from '../../../../hooks/useMockQueries';
import useAgreementStore from '../../../../store/useAgreementStore';

const ConsultAgreementPage = () => {
  const [step, setStep] = useState(1);
  const { data: draft, isLoading, isError } = useAgreementDraftQuery();
  const initFrom = useAgreementStore((s) => s.initFrom);

  // AI 정리 초안(mock)을 받아오면 store를 채움 (페이지 진입 시 1회)
  useEffect(() => {
    if (draft) initFrom(draft);
  }, [draft, initFrom]);

  // 다음 단계로 넘어가는 함수
  const nextStep = () => setStep((prev) => prev + 1);
  // 이전 단계로 돌아가는 함수
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <QueryState isLoading={isLoading} isError={isError} isEmpty={!draft}>
      {step === 1 && (
        <Step1AiDraft
          aiDraftLabel={draft?.aiDraftLabel}
          aiDraftDesc={draft?.aiDraftDesc}
          onEdit={nextStep}
          onComplete={() => setStep(4)}
        />
      )}
      {step === 2 && <Step2Edit nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <Step3EditComplete nextStep={nextStep} prevStep={prevStep} />}
      {step === 4 && <Step4Final prevStep={prevStep} />}
    </QueryState>
  );
};

export default ConsultAgreementPage;