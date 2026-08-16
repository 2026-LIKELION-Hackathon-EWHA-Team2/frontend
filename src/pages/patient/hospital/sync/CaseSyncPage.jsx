// # 케이스 동기화 전체 Step과 전송 데이터를 관리하는 페이지

// Header, PageContainer, ProgressSteps, Button은
// 매 step마다 겹치는 공통 레이아웃이라 여기 부모에서 한 번만 렌더링하고,
// step 내부 컨텐츠만 갈아끼우는 구조로 제작했어요! 
// step: 0 = 인트로, 1 = 환자 식별 정보, 2 = 케이스 선택 확인, 3 = AI 검토, 4 = 전송 동의, 5 = 전송 완료

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/layout/Header';
import PageContainer from '../../../../components/layout/PageContainer';
import ProgressSteps from '../../../../components/ProgressSteps';
import Button from '../../../../components/button/Button';
import useCaseSyncStore from '../../../../store/useCaseSyncStore';
import useHospitalMatchStore from '../../../../store/useHospitalMatchStore';
import { useHospitalListQuery } from '../../../../hooks/useMockQueries';

import Step0Intro from './components/Step0Intro';
import Step1Identify from './components/Step1Identify';
import Step2Select from './components/Step2Select';
import Step3AiReview from './components/Step3AiReview';
import Step4Consent from './components/Step4Consent';
import Step5Complete from './components/Step5Complete';

const PROGRESS_STEPS = ['환자 정보', '케이스 검토', '전송 동의'];

const CaseSyncPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const { patientName, agreements, setSelectedCaseId, setTargetHospital, setIsSent, reset } = useCaseSyncStore();

  // '병원과 동기화하기' 버튼으로 이 페이지에 진입할 때 매칭 store 값을 그대로 승계받기!
  const { selectedCaseId: matchedCaseId, selectedHospitalId, reset: resetHospitalMatch } = useHospitalMatchStore();
  const { data: hospitals = [] } = useHospitalListQuery();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // 전송 처리: 지금은 mock이라 잠깐의 지연 후 바로 성공 처리 되도록 구현해두고,,
  // 실제 API 연동 시엔 이 자리에서 케이스 전송 mutation 호출 후 onSuccess에서 아래 로직 실행하면 될 것 같아요!!
  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSent(true);
      setIsSending(false);
      nextStep();
    }, 600);
  };

  const handleFinish = () => {
    reset();
    navigate('/patient/home');
  };

  const STEP_CONFIG = {
    0: {
      subtitle: null,
      progressIndex: null,
      containerClassName: '',
      content: <Step0Intro />,
      buttonLabel: '동기화 시작하기',
      disabled: false,
      onClick: () => {
        reset(); // 이전에 입력하다 만 값이 남아있지 않도록 진입 시 초기화
        // 매칭 완료 단계에서 넘어온 케이스/병원 정보 승계
        if (matchedCaseId) setSelectedCaseId(matchedCaseId);
        const matchedHospital = hospitals.find((h) => h.id === (selectedHospitalId ?? 'tokyo-medical'));
        if (matchedHospital) {
          setTargetHospital({ name: matchedHospital.name, info: `일본 · ${matchedHospital.department}` });
        }
        resetHospitalMatch(); // 값 다 승계받았으니 매칭 store는 다음 매칭을 위해 초기화
        nextStep();
      },
    },
    1: {
      subtitle: 'AI가 의료 정보를 번역하고 구조화합니다.',
      progressIndex: 0,
      containerClassName: '',
      content: <Step1Identify />,
      buttonLabel: '다음 단계',
      disabled: patientName.trim().length === 0,
      onClick: nextStep,
    },
    2: {
      subtitle: 'AI가 의료 정보를 번역하고 구조화합니다.',
      progressIndex: 0,
      containerClassName: '',
      content: <Step2Select />,
      buttonLabel: 'AI로 구조화하기',
      disabled: false,
      onClick: nextStep,
    },
    3: {
      subtitle: 'AI가 의료 정보를 번역하고 구조화합니다.',
      progressIndex: 1,
      containerClassName: '',
      content: <Step3AiReview />,
      buttonLabel: '확인하기',
      disabled: false,
      onClick: nextStep,
    },
    4: {
      subtitle: 'AI가 의료 정보를 번역하고 구조화합니다.',
      progressIndex: 2,
      containerClassName: '',
      content: <Step4Consent />,
      buttonLabel: isSending ? '전송중' : '전송하기',
      disabled: isSending || agreements.some((checked) => !checked),
      onClick: handleSend,
    },
    5: {
      subtitle: 'AI가 의료 정보를 번역하고 구조화합니다.',
      progressIndex: null,
      containerClassName: 'flex flex-1 flex-col',
      content: <Step5Complete />,
      buttonLabel: '확인',
      disabled: false,
      onClick: handleFinish,
    },
  };

  const current = STEP_CONFIG[step] ?? STEP_CONFIG[0];

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
      <Header title="케이스 동기화" showBack onBack={step > 0 ? prevStep : undefined} rightSlot={<></>} />

      <PageContainer className={current.containerClassName}>
        {current.subtitle && (
          <p className="mb-[1.75rem] text-[#626262] font-wantedsans text-center text-[0.625rem] font-normal leading-normal">
            {current.subtitle}
          </p>
        )}
        {current.progressIndex !== null && (
          <div className='px-[0.2rem] mb-7'>
            <ProgressSteps steps={PROGRESS_STEPS} currentIndex={current.progressIndex} showCheck />
          </div>
        )}
        {current.content}
      </PageContainer>

      <div className="flex flex-col px-[1.375rem] pb-[0.625rem] pt-[0.3rem]">
        <Button variant="primary" disabled={current.disabled} onClick={current.onClick}>
          {current.buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default CaseSyncPage;