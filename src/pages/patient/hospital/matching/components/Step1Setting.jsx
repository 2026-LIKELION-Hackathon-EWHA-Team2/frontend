// 개인화 설정 (슬라이더, 체크박스 폼)

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import Button from '../../../../../components/button/Button';
import LevelBarCard from '../../../../../components/card/LevelBarCard';
import useHospitalMatchStore from '../../../../../store/useHospitalMatchStore';

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

const Step1Setting = ({ nextStep }) => {
  const { preference, setPreference } = useHospitalMatchStore();

  return (
    <div className="flex min-h-screen flex-col">
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

        <div className="mt-40">
          <Button variant="primary" onClick={nextStep}>
            AI로 추천받기
          </Button>
        </div>
      </PageContainer>
    </div>
  );
};

export default Step1Setting;
