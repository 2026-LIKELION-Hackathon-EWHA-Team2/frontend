// 개인화 설정 (슬라이더, 체크박스 폼)

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import Button from '../../../../../components/button/Button';
import LevelBarCard from '../../../../../components/card/LevelBarCard';
import useHospitalMatchStore from '../../../../../store/useHospitalMatchStore';
import useToastStore from '../../../../../store/useToastStore';
import { useCreateMatchRequestMutation } from '../../../../../hooks/useMockQueries';

// LevelBarCard 기준, 표시 퍼센트는 (value-1)/4*100 => 5=100%,4=75%,3=50%,2=25%,1=0%
const PERCENT_LABELS = ['0', '25', '50', '75', '100'];

const PREFERENCE_OPTIONS = [
  {
    key: 'department',
    icon: '/icons/case-hospital.svg',
    title: '전문 분야 일치도',
    description: '내 증상과 전문 분야의 일치도',
  },
  {
    key: 'distance',
    icon: '/icons/location.svg',
    title: '거리',
    description: '내 위치에서의 거리',
  },
  {
    key: 'experience',
    icon: '/icons/world.svg',
    title: '협진 경험',
    description: '외국인 환자 협진 경험',
  },
];

// 프론트 슬라이더(1~5)를 백엔드 가중치(0~100)로 변환
const levelToWeight = (level) => (level - 1) * 25;

const Step1Setting = ({ nextStep }) => {
  const { selectedCaseId, preference, setPreference, setMatchRequestId, setRecommendedHospitals } =
    useHospitalMatchStore();
  const showToast = useToastStore((state) => state.showToast);
  const createMatchRequest = useCreateMatchRequestMutation();

  const weights = {
    specialty_weight: levelToWeight(preference.department),
    distance_weight: levelToWeight(preference.distance),
    collaboration_weight: levelToWeight(preference.experience),
  };
  // 세 가중치가 모두 0일 수 없음 (슬라이더를 전부 최저로 내리면 발생 가능)
  const allWeightsZero = Object.values(weights).every((w) => w === 0);

  const handleSubmit = () => {
    if (allWeightsZero) {
      showToast('선호 기준을 하나 이상 설정해주세요.');
      return;
    }

    createMatchRequest.mutate(
      {
        symptom_case: selectedCaseId,
        location_source: 'PROFILE',
        ...weights,
      },
      {
        onSuccess: (data) => {
          setMatchRequestId(data.match_request.match_request_id);
          setRecommendedHospitals(data.recommendations);
          nextStep();
        },
        onError: () => {
          showToast('병원 추천을 불러오지 못했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
      <Header title="AI 추천 병원 설정" showBack rightSlot={<></>} />

      <PageContainer className="flex flex-1 flex-col pt-3 pb-10">
        <p className="text-center font-wantedsans text-[11px] font-normal leading-3.5 text-[#626262]">
          추천 결과와 정확도를 높이기 위해
          <br />
          기준을 직접 설정해주세요.
        </p>

        <p className="mt-6.5 font-wantedsans text-[0.9375rem] font-bold leading-normal text-black">
          선호 기준 선택
        </p>

        <div className="mt-3 flex flex-col gap-2.5">
          {PREFERENCE_OPTIONS.map((option) => (
            <LevelBarCard
              key={option.key}
              icon={<img src={option.icon} alt="" className="h-4.5 w-4.5" />}
              title={option.title}
              description={option.description}
              value={preference[option.key]}
              onChange={(value) => setPreference({ [option.key]: value })}
              levelLabels={PERCENT_LABELS}
            />
          ))}
        </div>
      </PageContainer>

      <div className="px-5.5 pb-6 pt-3">
        <Button variant="primary" disabled={createMatchRequest.isPending} onClick={handleSubmit}>
          {createMatchRequest.isPending ? '추천받는 중...' : 'AI로 추천받기'}
        </Button>
      </div>
    </div>
  );
};

export default Step1Setting;