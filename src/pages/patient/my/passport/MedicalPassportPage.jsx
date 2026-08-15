// 2-4 시술 이력(여권)

import Header from '../../../../components/layout/Header';
import PageContainer from '../../../../components/layout/PageContainer';
import QueryState from '../../../../components/state/QueryState';
import ProcedureHistoryCard from '../../../../components/card/ProcedureHistoryCard';
import { usePatientProfileQuery, useProcedureHistoryQuery } from '../../../../hooks/useMockQueries';

const MedicalPassportPage = () => {
  const { data: patient } = usePatientProfileQuery();
  const { data: procedures, isLoading, isError } = useProcedureHistoryQuery();

  return (
    <>
      <Header title="시술 이력 (여권)" showBack rightSlot={<></>} />

      <PageContainer className="flex flex-col gap-6 pt-6 pb-10">
        <p className="text-center font-wantedsans text-xs font-normal leading-4.5 text-[#8C8C8C]">
          병원 방문 시, 시술 이력과 정보를
          <br />
          공유할 수 있는 나만의 의료 여권입니다.
        </p>

        {patient && (
          <section className="flex w-full items-center justify-end gap-6.25 overflow-hidden rounded-lg bg-white pl-6 shadow-[-1px_-1px_10px_0_rgba(192,192,192,0.01),1px_1px_20px_0_rgba(192,192,192,0.40)]">
            <div className="flex flex-1 flex-col py-5">
              <div className="inline-flex w-fit items-center gap-0.5 rounded border border-[#EDEDF1] bg-white px-1 py-0.5">
                <img src="/icons/passport-mini.svg" alt="" className="h-5 w-4.5" />
                <span className="font-wantedsans text-[9px] font-medium leading-normal text-[#6B5DD6]">
                  MEDICAL PASSPORT
                </span>
              </div>

              <p className="mt-4 self-stretch font-wantedsans text-xl font-medium leading-normal text-black">
                {patient.name}
              </p>
              <p className="mt-1 font-wantedsans text-[11px] font-medium leading-normal text-[#626262]">
                여권번호&nbsp;&nbsp;{patient.medicalPassportNo}
              </p>

              <div className="mt-6 flex items-center gap-1.5">
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#6B5DD6]">
                  <img src="/icons/check-mark.svg" alt="" className="h-2 w-2" />
                </span>
                <span className="font-wantedsans text-[10px] font-medium leading-normal text-[#626262]">
                  최종 업데이트&nbsp;&nbsp;{patient.lastUpdated}
                </span>
              </div>
            </div>

            <img
              src="/icons/passport-background.svg"
              alt=""
              className="pointer-events-none h-50 w-[173.063px] shrink-0"
            />
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="font-wantedsans text-sm font-bold text-[#181818]">
            시술 이력 목록 {procedures ? `(${procedures.length})` : ''}
          </h2>

          <QueryState
            isLoading={isLoading}
            isError={isError}
            isEmpty={!procedures?.length}
            emptyProps={{ title: '등록된 시술 이력이 없어요' }}
          >
            <div className="flex flex-col gap-3">
              {procedures?.map((procedure) => (
                <ProcedureHistoryCard
                  key={procedure.id}
                  name={procedure.name}
                  hospital={procedure.hospital}
                  location={procedure.location}
                  date={procedure.date}
                  to={`/patient/my/passport/${procedure.id}`}
                />
              ))}
            </div>
          </QueryState>
        </section>
      </PageContainer>
    </>
  );
};

export default MedicalPassportPage;
