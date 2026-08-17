// 병원 홈 피드

import PageContainer from '../../../components/layout/PageContainer';
import QueryState from '../../../components/state/QueryState';
import ConsultPatientCard from '../../../components/card/ConsultPatientCard';
import { useHospitalHomeQuery, useConsultPatientsQuery } from '../../../hooks/useMockQueries';

const HospitalHomePage = () => {
  const { data: home } = useHospitalHomeQuery();
  const { data: patients, isLoading, isError } = useConsultPatientsQuery();

  const ongoing = patients?.filter((p) => p.status === 'reviewing');
  // 통계는 별도 mock이 아니라 실제 목록에서 직접 집계 (숫자가 목록과 어긋나지 않도록)
  // '전체 수신'은 카드가 검토중/완료 두 항목만 세분화해서 보여주므로, 그 합으로 정의 (신규 접수 전 상태는 이 카드에서 별도 집계하지 않음)
  const reviewingCount = ongoing?.length ?? 0;
  const doneCount = patients?.filter((p) => p.status === 'done').length ?? 0;
  const totalCount = reviewingCount + doneCount;

  return (
    <>
      {/* aftor 로고 */}
      <header className="top-0 z-50 flex items-center bg-white px-6 pb-10 pt-10">
        <img src="/icons/aftor-logo.svg" alt="aftor" className="h-6" />
      </header>

      <PageContainer className="flex flex-col gap-8 pt-3 pb-4">
        {/* 인사말 카드 */}
        {home && (
          <section className="relative w-full overflow-hidden rounded-[10px] bg-linear-to-b from-white to-[#A78AF4] to-[455.28%] shadow-[-1px_-1px_10px_0_rgba(192,192,192,0.01),1px_1px_20px_0_rgba(192,192,192,0.40)]">
            <img
              src="/icons/hospital-gradient.svg"
              alt=""
              className="pointer-events-none absolute right-2 top-11 h-37 w-37"
            />

            <div className="relative z-10 flex flex-col gap-5 px-5 pt-11 pb-5">
              <div className="flex flex-col gap-2">
                <h1 className="w-full whitespace-nowrap font-wantedsans text-[22px] font-medium leading-7.5 text-[#181818]">
                  안녕하세요,
                  <br />
                  {home.hospitalName} 님
                </h1>
                <p className="font-wantedsans text-sm font-normal pt-4 text-[#626262]">
                  {home.doctorName}님 오늘의 협진 현황이에요
                </p>
              </div>

              <div className=" flex justify-center gap-2">
                {[
                  ['전체 수신', totalCount],
                  ['검토중', reviewingCount],
                  ['완료', doneCount],
                ].map(([label, count]) => (
                  <div
                    key={label}
                    className="flex w-29 shrink-0 flex-col items-start rounded-lg bg-[#FEFEFE] px-3 py-1.5 shadow-[0_2px_4px_0_rgba(0,0,0,0.04)]"
                  >
                    <p className="self-stretch font-wantedsans text-xs font-medium leading-normal text-[#333]">
                      {label}
                    </p>
                    <p className="flex items-baseline font-wantedsans">
                      <span className="text-2xl font-semibold leading-normal text-[#6B5DD6]">{count}</span>
                      <span className="ml-1 text-xs font-medium leading-normal text-[#212121]">건</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 진행 중 협진 */}
        <section className="flex flex-col gap-4">
          <h2 className="font-wantedsans text-sm font-bold text-[#181818]">진행 중 협진</h2>

          <QueryState
            isLoading={isLoading}
            isError={isError}
            isEmpty={!ongoing?.length}
            emptyProps={{ title: '진행 중인 협진이 없어요' }}
          >
            <div className="flex flex-col gap-3">
              {ongoing?.map((patient) => (
                <ConsultPatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          </QueryState>
        </section>
      </PageContainer>
    </>
  );
};

export default HospitalHomePage;
