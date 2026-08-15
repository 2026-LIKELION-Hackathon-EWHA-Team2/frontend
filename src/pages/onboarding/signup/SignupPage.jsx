import { useState } from 'react';
import Header from '../../../components/layout/Header';
import ProgressSteps from '../../../components/ProgressSteps';
import Step1Info from './components/Step1Info';
import Step2Terms from './components/Step2Terms';
import Step3Complete from './components/Step3Complete';

const STEP_LABELS = ['정보 입력', '약관 동의', '가입 완료'];

const SignupPage = () => {
  const [step, setStep] = useState(1);

  // 다음 단계로 넘어가는 함수
  const nextStep = () => setStep((prev) => prev + 1);
  // 이전 단계로 돌아가는 함수
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="회원가입" showBack rightSlot={<></>} />

      {step < 3 && (
        <div className="px-6 pt-6">
          <ProgressSteps steps={STEP_LABELS} currentIndex={step - 1} />
        </div>
      )}

      {step === 1 && <Step1Info onNext={nextStep} />}
      {step === 2 && <Step2Terms onNext={nextStep} onPrev={prevStep} />}
      {step === 3 && <Step3Complete />}
    </div>
  );
};

export default SignupPage;
