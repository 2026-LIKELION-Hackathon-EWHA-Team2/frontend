// 매칭 완료 화면

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import Button from '../../../../../components/button/Button';
import { useHospitalListQuery } from '../../../../../hooks/useMockQueries';
import useHospitalMatchStore from '../../../../../store/useHospitalMatchStore';

const Step5Complete = ({ prevStep }) => {
  const { data: hospitals } = useHospitalListQuery();
  const { selectedHospitalId, reset } = useHospitalMatchStore();

  const hospital = hospitals?.find((item) => item.id === selectedHospitalId);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="" showBack onBack={prevStep} rightSlot={<></>} />

      <PageContainer className="flex flex-1 flex-col pt-3 pb-10">
        <div className="mt-24 flex flex-1 flex-col items-center">
          <div
            className="flex items-center justify-center rounded-full bg-[#A78AF4]/10"
            style={{ width: '4.375rem', height: '4.375rem', padding: '0.625rem 0.3125rem 0.3125rem 0.625rem' }}
          >
            <img src="/icons/matching-done.svg" alt="" className="h-8 w-9" />
          </div>

          <p className="mt-4 font-wantedsans text-xl font-medium leading-normal text-[#181818]">
            매칭 완료
          </p>
          <p className="mt-2 text-center font-wantedsans text-sm font-medium leading-normal text-[#626262]">
            {hospital?.name}
            <br />
            으로 매칭이 완료되었습니다.
          </p>
        </div>

        <div className="mb-16 flex flex-col items-center gap-4">
          <p className="text-center font-wantedsans text-[11px] font-normal text-[#8C8C8C]">
            동의한 개인 정보가 병원 진료에 활용될 수 있습니다.
          </p>
          <Button variant="primary" to="/patient/hospital/sync" onClick={reset}>
            병원과 동기화하기
          </Button>
        </div>
      </PageContainer>
    </div>
  );
};

export default Step5Complete;
