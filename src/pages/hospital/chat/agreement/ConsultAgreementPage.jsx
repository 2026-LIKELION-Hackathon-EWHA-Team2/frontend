// (부모) 합의서 상태 관리

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Step1AiDraft from './components/Step1AiDraft';
import Step2Edit from './components/Step2Edit';
import Step3EditComplete from './components/Step3EditComplete';
import Step4Final from './components/Step4Final';
import QueryState from '../../../../components/state/QueryState';
import { useAgreementDraftQuery } from '../../../../hooks/useMockQueries';
import useAgreementStore from '../../../../store/useAgreementStore';

const ConsultAgreementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // '완료'된 케이스에서 4단계로 바로 진입한 경우 - 3단계를 거친 적이 없어서 뒤로가기는 이전 페이지로 나가야 함
  const enteredAtFinal = location.state?.initialStep === 4;
  const [step, setStep] = useState(enteredAtFinal ? 4 : 1);
  const { data: draft, isLoading, isError } = useAgreementDraftQuery();
  const initFrom = useAgreementStore((s) => s.initFrom);
  const complete = useAgreementStore((s) => s.complete);

  // AI 정리 초안(mock)을 받아오면 store를 채움 (페이지 진입 시 1회)
  // 4단계로 바로 진입하는 경우(완료된 케이스)는 검토 완료 액션을 거치지 않았으니, 여기서 대신 호출해서
  // 참여 병원 상태를 '검토 완료'로 맞춰줌
  useEffect(() => {
    if (draft) {
      initFrom(draft);
      if (enteredAtFinal) complete();
    }
  }, [draft, initFrom, complete, enteredAtFinal]);

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
      {step === 4 && <Step4Final prevStep={enteredAtFinal ? () => navigate(-1) : prevStep} />}
    </QueryState>
  );
};

export default ConsultAgreementPage;