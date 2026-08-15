// 2-1 홈 피드

import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/layout/PageContainer';
import Button from '../../../components/button/Button';
import QuickLaunch from '../../../components/button/QuickLaunch';
import Badge from '../../../components/Badge';
import QueryState from '../../../components/state/QueryState';
import { usePatientProfileQuery, useRecentCasesQuery } from '../../../hooks/useMockQueries';

const PatientHomePage = () => {
  const navigate = useNavigate();
  const { data: patient } = usePatientProfileQuery();
  const { data: cases, isLoading, isError } = useRecentCasesQuery();

  return (
    <>
      {/* aftor 로고 */}
      <header className=" top-0 z-50 flex items-center bg-white px-6 pb-10 pt-10">
        <img src="/icons/aftor-logo.svg" alt="aftor" className="h-6" />
      </header>

      <PageContainer className="flex flex-col gap-8 pt-3 pb-4">
        {/* 인사말 카드 */}
        <section className="relative py-4 w-full overflow-hidden rounded-[10px] bg-linear-to-b from-white to-[#A78AF4] to-[455.28%] shadow-[-1px_-1px_10px_0_rgba(192,192,192,0.01),1px_1px_20px_0_rgba(192,192,192,0.40)]">
          <img src="/images/home-med.png" alt="" className="pointer-events-none absolute right-5 top-4 h-10 w-10" />
          <img src="/images/home-earth.png" alt="" className="pointer-events-none absolute right-45 top-20 h-10 w-10" />
          <img src="/images/home-carrier.png" alt="" className="pointer-events-none absolute bottom-0 right-8 w-36" />

          <div className="relative z-10 flex min-h-54.5 flex-col justify-between px-5 py-6 top-3">
            <div className="flex flex-col gap-2 pt-1">
              <h1 className="w-50 font-wantedsans text-2xl font-medium leading-7.5 text-[#181818]">
                안녕하세요,
                <br />
                {patient?.firstName} 님
              </h1>
              <p className="font-wantedsans text-sm font-normal text-[#626262]">
                귀국 후 건강 상태를 관리해보세요.
              </p>
            </div>

            <Button variant="primary-plus" to="/patient/case/upload">
              새 케이스 시작하기
            </Button>
          </div>
        </section>

        {/* 빠른 실행 */}
        <section className="flex flex-col gap-4">
          <h2 className="font-wantedsans text-sm font-medium leading-4.5 text-[#181818]">빠른 실행</h2>
          <div className="flex gap-3">
            <QuickLaunch
              title="증상 입력"
              description={<>현재 증상을<br />자세히 입력하세요</>}
              iconPath="/icons/home-camera-purple.svg"
              className="flex-1"
              onClick={() => navigate('/patient/case/upload', { state: { initialStep: 1 } })}
            />
            <QuickLaunch
              title="진단서 등록"
              description={<>진단서를<br />자세히 입력하세요</>}
              iconPath="/icons/home-case-purple.svg"
              className="flex-1"
              onClick={() => navigate('/patient/case/upload', { state: { initialStep: 4 } })}
            />
          </div>
        </section>

        {/* 최근 케이스 */}
        <section className="flex flex-col gap-4">
          <h2 className="font-wantedsans text-sm font-bold text-[#181818]">최근 케이스</h2>

          <QueryState
            isLoading={isLoading}
            isError={isError}
            isEmpty={!cases?.length}
            emptyProps={{ title: '아직 등록된 케이스가 없어요' }}
          >
            <div className="flex flex-col items-start rounded-[10px] border border-[#EDEDF1] bg-white py-5">
              {cases?.map((c, index) => (
                <div
                  key={`${c.id}-${index}`}
                  className="flex w-full items-center justify-between gap-3 px-5 pb-7 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full bg-[#F1F0F3]">
                      <img src="/icons/home-case.svg" alt="" className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-wantedsans text-sm font-medium text-[#181818]">
                        Case #{c.id}
                      </span>
                      <span className="font-wantedsans text-[10px] font-normal leading-3.5 text-[#737373]">
                        {c.date}
                      </span>
                    </div>
                  </div>

                  <Badge tone={c.tone}>{c.status}</Badge>
                </div>
              ))}
            </div>
          </QueryState>
        </section>
      </PageContainer>
    </>
  );
};

export default PatientHomePage;
