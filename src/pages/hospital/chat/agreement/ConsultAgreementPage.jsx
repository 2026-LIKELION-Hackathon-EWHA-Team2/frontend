// (부모) 합의서 상태 관리

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Step1AiDraft from './components/Step1AiDraft';
import Step2Edit from './components/Step2Edit';
import Step3EditComplete from './components/Step3EditComplete';
import Step4Final from './components/Step4Final';
import QueryState from '../../../../components/state/QueryState';
import { useAgreementDraftQuery, useCompleteConsultCase } from '../../../../hooks/useMockQueries';
import useAgreementStore from '../../../../store/useAgreementStore';
import useToastStore from '../../../../store/useToastStore';

const ConsultAgreementPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // '완료'된 케이스에서 4단계로 바로 진입한 경우 - 3단계를 거친 적이 없어서 뒤로가기는 이전 페이지로 나가야 함
  const enteredAtFinal = location.state?.initialStep === 4;
  const [step, setStep] = useState(enteredAtFinal ? 4 : 1);
  const { data: draft, isLoading, isError } = useAgreementDraftQuery();
  const initFrom = useAgreementStore((s) => s.initFrom);
  const complete = useAgreementStore((s) => s.complete);
  const requestHospital = useAgreementStore((s) => s.requestHospital);
  const participants = useAgreementStore((s) => s.participants);
  const setParticipantStatus = useAgreementStore((s) => s.setParticipantStatus);
  const showToast = useToastStore((s) => s.showToast);
  const completeCase = useCompleteConsultCase();

  // AI 정리 초안(mock)을 받아오면 store를 채움 (페이지 진입 시 1회)
  // 4단계로 바로 진입하는 경우(완료된 케이스)는 검토 완료 액션을 거치지 않았으니, 여기서 대신 호출해서
  // 참여 병원 상태를 '검토 완료'로 맞춰줌
  useEffect(() => {
    if (draft) {
      initFrom(draft);
      if (enteredAtFinal) complete();
    }
  }, [draft, initFrom, complete, enteredAtFinal]);

  // 다음 단계로 넘어가는 함수
  const nextStep = () => setStep((prev) => prev + 1);
  // 이전 단계로 돌아가는 함수
  const prevStep = () => setStep((prev) => prev - 1);

  // '검토 완료' 클릭 시 공통으로 타는 로직 (AI 초안을 그대로 승인하는 Step1, 내용 수정 후 승인하는 Step3 둘 다 여기로 옴)
  // 상대 병원이 이미 검토 완료한 상태면 -> 이번이 두 번째 합의 -> 케이스 완료 처리 후 최종 합의서로 이동
  // 아직이면 -> 내가 먼저 합의 -> 내 쪽만 완료 처리하고 홈으로 이동 + 안내 토스트 (최종 합의서는 상대 병원도 완료해야 볼 수 있음)
  const handleAgree = () => {
    const myHospital = participants.find((p) => p.name !== requestHospital);
    const counterpartAlreadyAgreed = participants.some(
      (p) => p.name === requestHospital && p.status === '검토 완료'
    );

    if (counterpartAlreadyAgreed) {
      complete();
      if (id) completeCase(id);
      setStep(4);
      showToast('협진 합의안이 생성되었습니다!');
    } else {
      if (myHospital) setParticipantStatus(myHospital.name, '검토 완료');
      navigate('/hospital/home');
      showToast(
        '합의안 작성이 완료되었습니다.\n상대 병원이 합의안을 작성한 이후에\n최종 합의서를 확인하실 수 있습니다.',
        4000
      );
    }
  };

  return (
    <QueryState isLoading={isLoading} isError={isError} isEmpty={!draft}>
      {step === 1 && (
        <Step1AiDraft
          aiDraftLabel={draft?.aiDraftLabel}
          aiDraftDesc={draft?.aiDraftDesc}
          onEdit={nextStep}
          onComplete={handleAgree}
        />
      )}
      {step === 2 && <Step2Edit nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <Step3EditComplete onComplete={handleAgree} prevStep={prevStep} />}
      {step === 4 && <Step4Final prevStep={enteredAtFinal ? () => navigate(-1) : prevStep} />}
    </QueryState>
  );
};

export default ConsultAgreementPage;