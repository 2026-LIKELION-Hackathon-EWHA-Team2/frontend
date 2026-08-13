// 3. 증상 입력 단계의 부모 페이지

import { useState } from 'react';
import Step0Intro from './components/Step0Intro';
import Step1Photo from './components/Step1Photo';
import Step2Symptom from './components/Step2Symptom';
import Step3Preview from './components/Step3Preview';
import Step4Certificate from './components/Step4Certificate';

const CaseUploadPage = () => {
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

export default CaseUploadPage;