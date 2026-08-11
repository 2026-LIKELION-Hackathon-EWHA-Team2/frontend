import { useState } from 'react';
import Step1PatientSelect from './components/Step1PatientSelect';
import Step2Intro from './components/Step2Intro';
import Step3Procedure from './components/Step3Procedure';
import Step4Materials from './components/Step4Materials';
import Step5DoctorNote from './components/Step5DoctorNote';

const HospitalCaseSyncPage = () => {
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

export default HospitalCaseSyncPage;