// # 케이스 동기화 전체 Step과 전송 데이터를 관리하는 페이지

import { useState } from 'react';
import Step0Intro from './components/Step0Intro';
import Step1Identify from './components/Step1Identify';
import Step2Select from './components/Step2Select';
import Step3AiReview from './components/Step3AiReview';
import Step4Consent from './components/Step4Consent';
import Step5Complete from './components/Step5Complete';

const CaseSyncPage = () => {
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

export default CaseSyncPage;