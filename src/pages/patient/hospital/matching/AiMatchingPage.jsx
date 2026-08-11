import { useState } from 'react';
import Step1Setting from './components/Step1Setting';
import step2Loading from './components/Step2Loading';
import Step3List from './components/Step3List';
import Step4Detail from './components/Step4Detail';
import Step5Consent from './components/Step5Consent';
import Step6Complete from './components/Step6Complete';

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