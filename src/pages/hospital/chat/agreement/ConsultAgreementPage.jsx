// (부모) 합의서 상태 관리

import { useState } from 'react';
import Step1AiDraft from './components/Step1AiDraft';
import Step2Edit from './components/Step2Edit';
import Step3EditComplete from './components/Step3EditComplete';
import Step4Final from './components/Step4Final';

const ConsultAgreementPage = () => {
  const [step, setStep] = useState(1);

  // 다음 단계로 넘어가는 함수
  const nextStep = () => setStep((prev) => prev + 1);
  // 이전 단계로 돌아가는 함수
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="p-10 text-center text-xl font-bold">

    </div>
  );
};

export default ConsultAgreementPage;