//  (부모) 매칭 Step과 설정 데이터를 관리하는 병원 매칭 페이지

import { useState } from 'react';
import Step1Setting from './components/Step1Setting';
import Step2List from './components/Step2List';
import Step3Detail from './components/Step3Detail';
import Step4Consent from './components/Step4Consent';
import Step5Complete from './components/Step5Complete';

const AiMatchingPage = () => {
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

export default AiMatchingPage;