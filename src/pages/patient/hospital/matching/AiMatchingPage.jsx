//  (부모) 매칭 Step과 설정 데이터를 관리하는 병원 매칭 페이지

import { useState } from 'react';
import Step1Setting from './components/Step1Setting';
import Step2List from './components/Step2List';
import Step3Detail from './components/Step3Detail';
import Step4Consent from './components/Step4Consent';
import Step5Complete from './components/Step5Complete';
import useHospitalMatchStore from '../../../../store/useHospitalMatchStore';

const AiMatchingPage = () => {
  // 병원은 선택됐지만(selectedHospitalId) 아직 동의(personalInfoAgreed)가 안 끝난 상태로 돌아왔다면
  // 완료 화면(5)이 아니라 동의 화면(4)부터 다시 보여줘야 함 - 동의 없이는 Case 전송 건 생성이 막히기 때문
  // (네트워크 병원 선택도 매칭 요청을 새로 만들기 때문에 AI 추천 병원 선택과 동일하게 동의가 필요함)
  // -> 동기화 페이지에서 '동기화 시작하기'를 누르는 순간 매칭 store가 reset 되니, 그 전까지만 유효
  const [step, setStep] = useState(() => {
    const { selectedHospitalId, personalInfoAgreed } = useHospitalMatchStore.getState();
    if (!selectedHospitalId) return 1;
    return personalInfoAgreed ? 5 : 4;
  });

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