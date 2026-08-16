// AI 추천 병원 리스트

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import QueryState from '../../../../../components/state/QueryState';
import HospitalCard from '../../../../../components/card/HospitalCard';
import { useHospitalListQuery } from '../../../../../hooks/useMockQueries';
import useHospitalMatchStore from '../../../../../store/useHospitalMatchStore';

const Step2List = ({ nextStep, prevStep }) => {
  const { data: hospitals, isLoading, isError } = useHospitalListQuery();
  const { setSelectedHospitalId } = useHospitalMatchStore();

  const handleDetailClick = (hospitalId) => {
    setSelectedHospitalId(hospitalId);
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
          <QueryState isLoading={isLoading} isError={isError} isEmpty={!hospitals?.length}>
            {hospitals?.map((hospital) => (
              <HospitalCard
                key={hospital.id}
                image={hospital.image}
                name={hospital.name}
                department={hospital.department}
                distance={hospital.distance}
                onDetailClick={() => handleDetailClick(hospital.id)}
              />
            ))}
          </QueryState>
        </div>
      </PageContainer>
    </div>
  );
};

export default Step2List;
