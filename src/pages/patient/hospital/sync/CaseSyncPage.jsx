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
import useToastStore from '../../../../store/useToastStore';
import {
  useCreateCaseTransferMutation,
  useReviewCaseTransferMutation,
  useSendCaseTransferMutation,
} from '../../../../hooks/useMockQueries';
import { getCountryName } from '../../../../utils/country';
import { toApiGender, toApiDateFormat } from '../../../../utils/format';

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

  const {
    patientName,
    gender,
    birth,
    selectedCaseId,
    recommendationId,
    agreements,
    transferId,
    setSelectedCaseId,
    setRecommendationId,
    setTargetHospital,
    setTransferId,
    setProcedureName,
    setProcedurePart,
    setProcedureDate,
    setMedications,
    setDoctorNote,
    setIsSent,
    reset,
  } = useCaseSyncStore();

  // '병원과 동기화하기' 버튼으로 이 페이지에 진입할 때 매칭 store 값을 그대로 승계받기!
  const {
    selectedCaseId: matchedCaseId,
    selectedHospitalId,
    selectedRecommendationId,
    recommendedHospitals,
    partnerHospitalName,
    reset: resetHospitalMatch,
  } = useHospitalMatchStore();
  const showToast = useToastStore((state) => state.showToast);

  const createTransferMutation = useCreateCaseTransferMutation();
  const reviewMutation = useReviewCaseTransferMutation();
  const sendMutation = useSendCaseTransferMutation();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // 'AI로 구조화하기' 클릭 시 실제 Case 전송 건 생성 API를 호출 (진단서 AI 분석·구조화가 여기서 일어남)
  // 응답의 structured_data를 Step3AiReview가 보여줄 store 필드에 반영하고, transferId를 저장해둬야
  // 이후 검토(review)·전송(send) 단계에서 진짜 CaseTransfer를 가리킬 수 있음
  const handleStructure = () => {
    createTransferMutation.mutate(
      {
        symptom_case_id: selectedCaseId,
        recommendation_id: recommendationId,
        patient_name: patientName,
        patient_gender: toApiGender(gender),
        patient_birth_date: toApiDateFormat(birth),
      },
      {
        onSuccess: (data) => {
          setTransferId(data.id);
          setProcedureName(data.structured_data.procedure.name);
          setProcedurePart(data.structured_data.procedure.area);
          setProcedureDate(data.structured_data.procedure.date);
          setMedications(data.structured_data.ingredients ?? []);
          setDoctorNote(data.structured_data.clinician_note ?? '');
          nextStep();
        },
        onError: () => {
          showToast('AI 구조화에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  // 전송 처리: 검토(review)로 READY_TO_TRANSFER 확인 후에만 최종 전송(send) 호출
  // (review만 끝난 상태에서 바로 완료 화면으로 넘어가면 안 됨 - 아직 병원에 전송된 게 아니라서)
  const handleSend = () => {
    setIsSending(true);
    reviewMutation.mutate(
      { transferId, agreements },
      {
        onSuccess: (reviewed) => {
          if (reviewed.status !== 'READY_TO_TRANSFER') {
            setIsSending(false);
            showToast('필수 동의 처리에 실패했습니다. 다시 시도해주세요.');
            return;
          }
          sendMutation.mutate(transferId, {
            onSuccess: () => {
              setIsSending(false);
              setIsSent(true);
              nextStep();
            },
            onError: () => {
              setIsSending(false);
              showToast('전송에 실패했습니다. 다시 시도해주세요.');
            },
          });
        },
        onError: () => {
          setIsSending(false);
          showToast('필수 동의 처리에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
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
        if (selectedRecommendationId) setRecommendationId(selectedRecommendationId);
        if (partnerHospitalName) {
          // 추천 병원 선택(select) API는 병원명만 주므로, 국가/진료분야는 아직 store에 남아있는
          // recommendedHospitals에서 같은 hospital_id를 찾아 보충함
          const matchedHospital = recommendedHospitals.find(
            (r) => r.hospital.hospital_id === selectedHospitalId
          )?.hospital;
          const info = matchedHospital
            ? [getCountryName(matchedHospital.country), matchedHospital.specialties[0]?.specialty_name]
                .filter(Boolean)
                .join(' · ')
            : '';
          setTargetHospital({ name: partnerHospitalName, info });
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
      buttonLabel: createTransferMutation.isPending ? '구조화 중...' : 'AI로 구조화하기',
      disabled: createTransferMutation.isPending,
      onClick: handleStructure,
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
      containerClassName: '',
      content: <Step5Complete />,
      buttonLabel: '확인',
      disabled: false,
      onClick: handleFinish,
    },
  };

  const current = STEP_CONFIG[step] ?? STEP_CONFIG[0];

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
      <Header title="케이스 동기화" showBack onBack={step > 0 ? prevStep : () => navigate(-1)} rightSlot={<></>} />

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