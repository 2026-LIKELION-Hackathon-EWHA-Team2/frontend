import { useState } from 'react';
import Step1Info from './components/Step1Info';
import Step2Terms from './components/Step2Terms';
import Step3Complete from './components/Step3Complete';

const SignupPage = () => {
  const [step, setStep] = useState(1);

  // 유저가 입력한 모든 데이터를 하나로 모아서 관리
  const [formData, setFormData] = useState({
    role: '', 
    name: '',
    id: '',
    password: '',
    // 추후수정
  });

  // 다음 단계로 넘어가는 함수
  const nextStep = () => setStep((prev) => prev + 1);
  // 이전 단계로 돌아가는 함수
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="p-10 text-center text-xl font-bold">
      {step === 1 && (
        <Step1Info 
          formData={formData} 
          setFormData={setFormData} 
          onNext={nextStep} 
        />
      )}
      {step === 2 && (
        <Step2Terms 
          onNext={nextStep} 
          onPrev={prevStep} 
        />
      )}
      {step === 3 && (
        <Step3Complete />
      )}

    </div>
  );
};

export default SignupPage;