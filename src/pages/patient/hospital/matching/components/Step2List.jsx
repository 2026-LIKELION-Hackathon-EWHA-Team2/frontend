// AI 추천 병원 리스트

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import QueryState from '../../../../../components/state/QueryState';
import HospitalCard from '../../../../../components/card/HospitalCard';
import useHospitalMatchStore from '../../../../../store/useHospitalMatchStore';

const Step2List = ({ nextStep, prevStep }) => {
  // Step1Setting에서 매칭 요청 응답(recommendations)을 그대로 store에 저장해뒀으므로
  // 여기선 별도 API 호출 없이 그 값만 읽어서 보여주면 됨
  const { recommendedHospitals, setSelectedHospitalId, setSelectedRecommendationId } = useHospitalMatchStore();

  const handleDetailClick = (recommendation) => {
    // hospital_id와 recommendation_id는 서로 다른 값이라 각각 저장해야 함
    setSelectedHospitalId(recommendation.hospital.hospital_id);
    setSelectedRecommendationId(recommendation.recommendation_id);
    nextStep();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="AI 추천 병원 리스트" showBack onBack={prevStep} rightSlot={<></>} />

      <PageContainer className="flex flex-1 flex-col pt-3 pb-10">
        <p className="text-center font-wantedsans text-[11px] font-normal leading-3.5 text-[#626262]">
          개인화된 기준으로 추천된 병원입니다.
        </p>

        <div className="mt-6.5 flex flex-col gap-2.5">
          <QueryState isLoading={false} isError={false} isEmpty={!recommendedHospitals.length}>
            {recommendedHospitals.map((recommendation) => (
              <HospitalCard
                key={recommendation.recommendation_id}
                image={recommendation.hospital.image_url}
                name={recommendation.hospital.name}
                department={recommendation.hospital.specialties.map((s) => s.specialty_name).join(', ')}
                distance={`${recommendation.distance_km}km`}
                onDetailClick={() => handleDetailClick(recommendation)}
              />
            ))}
          </QueryState>
        </div>
      </PageContainer>
    </div>
  );
};

export default Step2List;
