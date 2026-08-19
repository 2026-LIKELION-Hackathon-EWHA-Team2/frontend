// 병원 홈 피드

import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import PageContainer from '../../../components/layout/PageContainer';
import QueryState from '../../../components/state/QueryState';
import ConsultPatientCard from '../../../components/card/ConsultPatientCard';
import useAuthStore from '../../../store/useAuthStore';
import { useHospitalProfileQuery, useHospitalDashboardQuery } from '../../../hooks/useMockQueries';

const HospitalHomePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const { data: profile } = useHospitalProfileQuery();
  const { data: dashboard, isLoading, isError } = useHospitalDashboardQuery();

  const ongoing = dashboard?.ongoingCollaborations;
  const counts = {
    new: dashboard?.todaySummary.new_request_count ?? 0,
    reviewing: dashboard?.todaySummary.in_review_count ?? 0,
    done: dashboard?.todaySummary.completed_count ?? 0,
  };

  const handleLogoClick = () => {
    // 임시 로그아웃 처리
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      // clear() 전에 cancelQueries()로 진행 중인 요청부터 취소하도록 수정
      queryClient.cancelQueries();
      queryClient.clear();
      navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    }
  };

  return (
    <>
      {/* aftor 로고 */}
      <header className="top-0 z-50 flex items-center bg-white px-6 pb-10 pt-10">
        <img
          src="/icons/aftor-logo.svg"
          alt="aftor"
          className="h-6 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        />
      </header>

      <PageContainer className="flex flex-col gap-8 pt-3 pb-4">
        {/* 인사말 카드 */}
        {profile && ( 
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
                  {profile.name} 님
                </h1>
                <p className="font-wantedsans text-sm font-normal pt-4 text-[#626262]">
                  {profile.name}님 오늘의 협진 현황이에요
                </p>
              </div>

              <div className=" flex justify-center gap-2">
                {[
                  ['신규 요청', counts.new],
                  ['검토중', counts.reviewing],
                  ['완료', counts.done],
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
          {!isLoading && <h2 className="font-wantedsans text-sm font-bold text-[#181818]">진행 중 협진</h2>}

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