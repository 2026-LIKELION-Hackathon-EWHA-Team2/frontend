// 2-4 인계 서류 (협진 결과 인계서)

import { useEffect } from 'react';
import Header from '../../../../components/layout/Header';
import PageContainer from '../../../../components/layout/PageContainer';
import QueryState from '../../../../components/state/QueryState';
import Badge from '../../../../components/Badge';
import ResultActionButton from '../../../../components/button/ResultActionButton';
import useGnbOverrideStore from '../../../../store/useGnbOverrideStore';
import { useHandoverDocumentQuery } from '../../../../hooks/useMockQueries';

const ConsultHistoryPage = () => {
  const { data: handover, isLoading, isError } = useHandoverDocumentQuery();
  const setOverridePath = useGnbOverrideStore((state) => state.setOverridePath);
  const clearOverridePath = useGnbOverrideStore((state) => state.clearOverridePath);

  // 마이페이지 하위 경로지만, 이 화면에서는 하단 GNB의 '병원' 탭을 활성 표시
  useEffect(() => {
    setOverridePath('/patient/hospital');
    return () => clearOverridePath();
  }, [setOverridePath, clearOverridePath]);

  return (
    <>
      <Header title="협진 결과 인계서" showBack rightSlot={<></>} />

      <PageContainer className="flex flex-col gap-6 pt-3 pb-10">
        <QueryState isLoading={isLoading} isError={isError} isEmpty={!handover}>
          {handover && (
            <>
              <p className="-mt-3 text-center font-wantedsans text-[11px] font-normal leading-normal text-[#626262]">
                CROSS-BORDER COLLABORATION RECORD
              </p>

              <div className="flex w-full items-end rounded-[10px] border border-[#EDEDF1] px-2.5 py-2">
                <div className="flex flex-1 flex-col items-start gap-1">
                  <p className="font-wantedsans text-base font-medium leading-4.5 text-[#181818]">{handover.fromHospital}</p>
                  <p className="font-wantedsans text-xs font-normal text-[#8C8C8C]">발신 등록</p>
                </div>

                <img src="/icons/arrow-right.svg" alt="" className="mx-2 mr-15 -mt-3 h-4 w-4 shrink-0 self-center" />

                <div className="flex flex-col items-start gap-1">
                  <p className="font-wantedsans text-base font-medium leading-4.5 text-[#181818]">{handover.toHospital}</p>
                  <p className="font-wantedsans text-xs font-normal text-[#8C8C8C]">수신 확인 서명</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-wantedsans text-sm font-bold leading-normal text-[#181818]">협진 사유</h2>
                <p className="font-wantedsans text-[13px] font-medium leading-4.5 text-[#181818]">{handover.reason}</p>
              </div>

              <div className="flex flex-col items-start gap-3">
                <h2 className="font-wantedsans text-sm font-bold leading-normal text-[#181818]">전달 방식</h2>
                <Badge tone="mint" size="lg">
                  {handover.transferType}
                </Badge>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-wantedsans text-sm font-bold leading-normal text-[#181818]">의료진 소견</h2>
                <p className="font-wantedsans text-[13px] font-medium leading-4.5 text-[#181818]">{handover.doctorNote}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-wantedsans text-sm font-bold leading-normal text-[#181818]">서명</h2>
                <div className="flex flex-col rounded-[10px] border border-[#EDEDF1]">
                  <div className="flex items-center justify-between border-b border-[#EDEDF1] px-3 py-2">
                    <span className="font-wantedsans text-sm font-medium text-[#181818]">{handover.registeredBy}</span>
                    <span className="font-wantedsans text-sm font-normal text-[#181818]">등록 : {handover.registeredAt}</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-wantedsans text-sm font-medium text-[#181818]">시술일</span>
                    <span className="font-wantedsans text-sm font-normal text-[#181818]">
                      확인 서명 : {handover.confirmedAt}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-center font-wantedsans text-xs font-normal text-[#626262]">
                {handover.fromHospital} 등록 · {handover.toHospital} 확인
              </p>

              <div className="flex gap-3">
                <div className="flex-1">
                  <ResultActionButton variant="share" />
                </div>
                <div className="flex-1">
                  <ResultActionButton variant="download" />
                </div>
              </div>
            </>
          )}
        </QueryState>
      </PageContainer>
    </>
  );
};

export default ConsultHistoryPage;
