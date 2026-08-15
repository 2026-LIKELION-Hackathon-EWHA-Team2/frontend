// 3. 증상 입력 단계의 부모 페이지

// Header, PageContainer, ProgressSteps, Button은 매 step마다 겹치는 공통 레이아웃이라
// 여기 부모에서 한 번만 렌더링하고, step 내부 컨텐츠(입력 필드 영역)만 갈아끼우는 구조
// step: 0 = 인트로, 1 = 사진 입력, 2 = 증상 제시(체크리스트), 3 = 증상 입력(상세), 4 = 진단서 입력

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import PageContainer from '../../../components/layout/PageContainer';
import ProgressSteps from '../../../components/ProgressSteps';
import Button from '../../../components/button/Button';
import useCaseFormStore from '../../../store/useCaseFormStore';
import { useCreateCaseMutation } from '../../../hooks/useMockQueries';

import Step0Intro from './components/Step0Intro';
import Step1Photo from './components/Step1Photo';
import Step2SymptomSelect from './components/Step2SymptomSelect';
import Step3SymptomDetail from './components/Step3SymptomDetail';
import Step4Certificate from './components/Step4Certificate';

const PROGRESS_STEPS = ['사진 입력', '증상 입력', '진단서 입력'];

const CaseUploadPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: createCase, isPending: isSubmitting } = useCreateCaseMutation();

  // 다른 페이지에서 navigate('/patient/case/upload', { state: { initialStep: 1 } }) 형태로 넘기면
  // 인트로를 건너뛰고 원하는 step 부터 바로 시작할 수 있더라구요!!
  const [step, setStep] = useState(location.state?.initialStep ?? 0);

  // 하단 버튼의 활성화(disabled) 조건, 완료 처리 로직에 store 값이 필요해서 부모에서 직접 구독하도록
  const {
    photos,
    symptomArea,
    customArea,
    symptomStartDate,
    symptomTiming,
    symptomDetail,
    painLevel,
    checkedSymptoms,
    hospital,
    diagnosisFile,
    reset,
  } = useCaseFormStore();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // 완료 처리: 폼 전체 값을 넘겨서 등록 -> 성공하면 폼 초기화 + 홈 화면으로 이동
  // (지금은 mock이라 바로 성공하는 형태고, 실제 API 연동 후에도 이 부분은 그대로 써도 될 거 같긴 해요!!
  //  query hook 만 수정하면 되지 않을까.....)
  const handleComplete = () => {
    createCase(
      {
        photos,
        symptomArea,
        customArea,
        symptomStartDate,
        symptomTiming,
        symptomDetail,
        painLevel,
        checkedSymptoms,
        hospital,
        diagnosisFile,
      },
      {
        onSuccess: () => {
          reset();
          navigate('/patient/home');
        },
      }
    );
  };

  // step 별 설정 - 헤더 아래 안내 문구(subtitle), ProgressSteps 인덱스(null이면 컴포넌트 자체를 숨김)
  // 내부 컨텐츠 빼고 나머지는 여기에 다 설정해서 모아뒀어요!! 
  const STEP_CONFIG = {
    0: {
      subtitle: '자신의 케이스를 등록해보세요',
      progressIndex: null,
      containerClassName: 'flex flex-col items-center text-center',
      content: <Step0Intro />,
      buttonLabel: '시작하기',
      buttonSub: '약 3분 정도 소요돼요',
      disabled: false,
      onClick: () => {
        reset(); // 이전에 입력하다 만 값이 남아있지 않도록 진입 시 초기화
        nextStep();
      },
    },
    1: {
      subtitle: '사진과 증상을 입력하면 자신의 상태를 기록할 수 있습니다',
      progressIndex: 0,
      containerClassName: '',
      content: <Step1Photo />,
      buttonLabel: '다음 단계',
      buttonSub:'',
      disabled: photos.length === 0,
      onClick: nextStep,
    },
    2: {
      subtitle: '사진과 증상을 입력하면 자신의 상태를 기록할 수 있습니다',
      progressIndex: 1,
      containerClassName: '',
      content: <Step2SymptomSelect />,
      buttonLabel: '다음 단계',
      buttonSub:'',
      disabled: checkedSymptoms.length === 0,
      onClick: nextStep,
    },
    3: {
      subtitle: '사진과 증상을 입력하면 자신의 상태를 기록할 수 있습니다',
      progressIndex: 1,
      containerClassName: '',
      content: <Step3SymptomDetail />,
      buttonLabel: '다음 단계',
      buttonSub:'',
      disabled: !(symptomArea.length > 0 && symptomTiming),
      onClick: nextStep,
    },
    4: {
      subtitle: '진단서를 입력하면 더 자세한 정보를 기록할 수 있습니다',
      progressIndex: 2,
      containerClassName: '',
      content: <Step4Certificate />,
      buttonLabel: isSubmitting ? '등록중' : '완료',
      buttonSub:'',
      disabled: isSubmitting,
      onClick: handleComplete,
    },
  };

  const current = STEP_CONFIG[step] ?? STEP_CONFIG[0];

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
      <Header title="케이스 등록" showBack onBack={step > 0 ? prevStep : undefined} />

      <PageContainer className={current.containerClassName}>
        {current.subtitle && (
          <p className="mb-[1.9rem] text-[#626262] font-wantedsans text-center text-[0.625rem] font-normal leading-normal">
            {current.subtitle}
          </p>
        )}
        {current.progressIndex !== null && (
          <div className='-mx-14 mb-10'>
            <ProgressSteps steps={PROGRESS_STEPS} currentIndex={current.progressIndex} showCheck />
          </div>
        )}
        {current.content}
      </PageContainer>

      <div className="flex flex-col items-center gap-[0.58rem] px-[1.375rem] pb-[0.4rem] pt-[1.04rem]">
        <Button variant="primary" disabled={current.disabled} onClick={current.onClick}>
          {current.buttonLabel}
        </Button>
        {current.buttonSub && (
          <span className="text-center text-[#626262] font-wantedsans text-[0.6875rem] font-medium leading-[1.25rem]">{current.buttonSub}</span>
        )}
      </div>
    </div>
  );
};

export default CaseUploadPage;