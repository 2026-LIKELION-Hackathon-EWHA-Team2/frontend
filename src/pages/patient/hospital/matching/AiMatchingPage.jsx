//  (부모) 매칭 Step과 설정 데이터를 관리하는 병원 매칭 페이지

import { useState } from 'react';
import Step1Setting from './components/Step1Setting';
import Step2List from './components/Step2List';
import Step3Detail from './components/Step3Detail';
import Step4Consent from './components/Step4Consent';
import Step5Complete from './components/Step5Complete';
import useHospitalMatchStore from '../../../../store/useHospitalMatchStore';

const AiMatchingPage = () => {
  // 케이스 동기화 페이지에서 뒤로가기로 돌아왔을 때, 이미 매칭이 끝난 상태(selectedHospitalId 있음)라면
  // 1단계부터가 아니라 매칭 완료 화면(5)부터 다시 보여주기 위해 수정!! 
  // -> 동기화 페이지에서 '동기화 시작하기'를 누르는 순간 매칭 store가 reset 되니, 그 전까지만 유효
  const [step, setStep] = useState(() => (useHospitalMatchStore.getState().selectedHospitalId ? 5 : 1));

  // 다음 단계로 넘어가는 함수
  const nextStep = () => setStep((prev) => prev + 1);
  // 이전 단계로 돌아가는 함수
  const prevStep = () => setStep((prev) => prev - 1);

  switch (step) {
    case 1:
      return <Step1Setting nextStep={nextStep} />;
    case 2:
      return <Step2List nextStep={nextStep} prevStep={prevStep} />;
    case 3:
      return <Step3Detail nextStep={nextStep} prevStep={prevStep} />;
    case 4:
      return <Step4Consent nextStep={nextStep} prevStep={prevStep} />;
    case 5:
      return <Step5Complete prevStep={prevStep} />;
    default:
      return <Step1Setting nextStep={nextStep} />;
  }
};

export default AiMatchingPage;