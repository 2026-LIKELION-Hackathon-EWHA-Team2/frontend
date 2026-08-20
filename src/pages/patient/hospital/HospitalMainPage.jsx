// [초기화면] 연결된 병원 없음

import Header from '../../../components/layout/Header';
import PageContainer from '../../../components/layout/PageContainer';
import Button from '../../../components/button/Button';

const HospitalMainPage = () => {
  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
      <Header title="병원" showBack rightSlot={<></>} />

      <PageContainer className="flex flex-1 flex-col pt-3 pb-10">
        <p className="text-center font-wantedsans text-[11px] font-normal leading-3.5 text-[#626262]">
          AI 추천 분석을 통한 병원과 매칭되어
          <br />
          한국 병원과 협진을 경험할 수 있어요.
        </p>

        <div className="mt-20.5 flex flex-col items-center">
          <div className="flex h-25 w-25 items-center justify-center rounded-full bg-[#A78AF4]/10">
            <img src="/icons/case-hospital.svg" alt="" className="h-11 w-11" />
          </div>

          <p className="mt-5 text-center font-wantedsans text-2xl font-medium leading-normal text-[#181818]">
            아직 연결된 병원이 없어요
          </p>
          <p className="mt-3 text-center font-wantedsans text-[13px] font-medium leading-5 text-[#626262]">
            전문 분야와 거리를 기준으로
            <br />
            자국에서 치료를 이어갈 병원을 찾아드려요
          </p>
        </div>
      </PageContainer>

      <div className="flex flex-col items-center px-5.5 pb-6 pt-3">
        <div className="relative mb-3 w-fit rounded-lg bg-[#303030] px-3 py-2">
          <p className="whitespace-nowrap font-wantedsans text-xs font-medium text-white">
            해당 증상에 대한 진단서가 도착해야 매칭을 진행할 수 있어요.
          </p>
          <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#303030]" />
        </div>

        <Button variant="primary" to="/patient/hospital/select-case">
          케이스 선택하기
        </Button>
      </div>
    </div>
  );
};

export default HospitalMainPage;