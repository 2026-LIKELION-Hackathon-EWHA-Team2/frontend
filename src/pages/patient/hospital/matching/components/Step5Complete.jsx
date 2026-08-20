// 매칭 완료 화면

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import Button from '../../../../../components/button/Button';
import useHospitalMatchStore from '../../../../../store/useHospitalMatchStore';

const Step5Complete = ({ prevStep }) => {
  // partnerHospitalName은 추천 병원 선택 API(select) 응답값 - mock 병원 목록 조회 필요 없음
  // (매칭 store는 여기서 reset하지 않음 - CaseSyncPage 진입 시 이 값들을 읽어간 뒤에 resetHospitalMatch()로 정리함)
  const partnerHospitalName = useHospitalMatchStore((state) => state.partnerHospitalName);

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
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
            {partnerHospitalName}
            <br />
            으로 매칭이 완료되었습니다.
          </p>
        </div>
      </PageContainer>

      <div className="flex flex-col items-center gap-4 px-5.5 pb-6 pt-3">
        <p className="text-center font-wantedsans text-[11px] font-normal text-[#8C8C8C]">
          동의한 개인 정보가 병원 진료에 활용될 수 있습니다.
        </p>
        <Button variant="primary" to="/patient/hospital/sync">
          병원과 동기화하기
        </Button>
      </div>
    </div>
  );
};

export default Step5Complete;
