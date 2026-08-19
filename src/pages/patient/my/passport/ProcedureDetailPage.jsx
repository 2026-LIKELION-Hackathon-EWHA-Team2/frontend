// 2-4-1 상세수술이력

import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../../components/layout/Header';
import PageContainer from '../../../../components/layout/PageContainer';
import QueryState from '../../../../components/state/QueryState';
import ConsultCard from '../../../../components/card/ConsultCard';
import Button from '../../../../components/button/Button';
import { useProcedureHistoryDetailQuery } from '../../../../hooks/useMockQueries';

const ProcedureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: procedure, isLoading, isError } = useProcedureHistoryDetailQuery(id);

  return (
    <>
      <Header title="상세 수술 이력" showBack rightSlot={<></>} />

      <PageContainer className="flex flex-1 flex-col gap-6 pt-3 pb-10">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!procedure}
          emptyProps={{ title: '시술 이력을 찾을 수 없어요' }}
          errorMessage="완료된 시술 이력을 찾을 수 없어요"
        >
          {procedure && (
            <>
              <div className="flex flex-col gap-3">
                <h1 className="font-wantedsans text-[15px] font-bold text-[#181818]">
                  {procedure.name} ({procedure.tag})
                </h1>

                <div className="flex flex-col rounded-[10px] border border-[#EDEDF1]">
                  {[
                    ['시술 병원', procedure.hospital],
                    ['시술 위치', procedure.location],
                    ['시술일', procedure.date],
                  ].map(([label, value], idx) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-3.5 py-2 ${idx !== 0 ? 'border-t border-[#EDEDF1]' : ''}`}
                    >
                      <span className="font-wantedsans text-sm font-medium text-[#181818]">{label}</span>
                      <span className="font-wantedsans text-sm font-normal text-[#686868]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {procedure.relatedCaseId && (
                <div className="flex flex-col gap-3">
                  <h2 className="font-wantedsans text-[15px] font-bold text-[#181818]">관련 협진 이력</h2>
                  <ConsultCard
                    caseId={procedure.consult.caseId}
                    hospitalName={procedure.consult.hospitalName}
                    date={procedure.consult.date}
                    status="확인 서명 완료"
                    onClick={() => navigate(`/patient/my/passport/${procedure.id}/consult`)}
                  />
                </div>
              )}

              {procedure.relatedCaseId && (
                <Button
                  variant="primary-shadow"
                  className="mt-auto"
                  onClick={() => navigate(`/patient/my/passport/${procedure.id}/consult`)}
                >
                  협진 인계 서류 보기
                </Button>
              )}
            </>
          )}
        </QueryState>
      </PageContainer>
    </>
  );
};

export default ProcedureDetailPage;
