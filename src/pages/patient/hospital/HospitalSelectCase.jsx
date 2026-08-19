// (케이스 선택하게 하고, AI 추천 or 둘러보기 분기점)

import { useEffect, useState } from 'react';
import Header from '../../../components/layout/Header';
import PageContainer from '../../../components/layout/PageContainer';
import QueryState from '../../../components/state/QueryState';
import Button from '../../../components/button/Button';
import CaseSelectCard from '../../../components/card/CaseSelectCard';
import { useSubmittedSymptomCaseListQuery } from '../../../hooks/useMockQueries';
import useHospitalMatchStore from '../../../store/useHospitalMatchStore';

const HospitalSelectCase = () => {
  // 병원 매칭 전(SUBMITTED) 상태인 케이스만 필터링해서 내려주는 훅
  const { data: cases, isLoading, isError } = useSubmittedSymptomCaseListQuery();
  const [selectedId, setSelectedId] = useState(null);
  const setSelectedCaseId = useHospitalMatchStore((state) => state.setSelectedCaseId);
  const resetHospitalMatch = useHospitalMatchStore((state) => state.reset);

  useEffect(() => {
    if (cases?.length && !selectedId) {
      setSelectedId(cases[0].id);
    }
  }, [cases, selectedId]);

  // 선택한 케이스를 매칭 store에도 그대로 반영 (이후 단계에서 계속 참조 필요해서요 ㅠ)
  // 이전에 다른 케이스로 매칭을 진행하다 만 상태(selectedHospitalId, personalInfoAgreed 등)가
  // store에 남아있으면 AiMatchingPage가 다른 케이스인데도 동의/완료 화면으로 바로 건너뛰는
  // 버그가 있어서, 케이스가 실제로 바뀔 때만 이전 상태를 reset 후 새 케이스를 저장하는 형태로 수정 ~.~
  useEffect(() => {
    if (!selectedId) return;

    const prevCaseId = useHospitalMatchStore.getState().selectedCaseId;
    if (prevCaseId !== selectedId) {
      resetHospitalMatch();
    }
    setSelectedCaseId(selectedId);
  }, [selectedId, setSelectedCaseId, resetHospitalMatch]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="병원" showBack rightSlot={<></>} />

      <PageContainer className="flex flex-1 flex-col pt-3 pb-10">
        <p className="text-center font-wantedsans text-[11px] font-normal leading-3.5 text-[#626262]">
          AI가 의료 정보를 번역하고 구조화합니다.
        </p>

        <div className="mt-6.5 flex flex-col items-center">
          <div className="flex h-17.5 w-17.5 items-center justify-center rounded-full bg-[#A78AF4]/10">
            <img src="/icons/case-select.svg" alt="" className="h-9 w-auto" />
          </div>

          <p className="mt-4 flex h-7 items-center justify-center self-stretch text-center font-wantedsans text-xl font-medium leading-normal text-[#181818]">
            케이스 선택
          </p>
          <p className="mt-1 text-center font-wantedsans text-[11px] font-medium leading-normal text-[#626262]">
            이번 부작용과 관련된 시술을 선택해주세요.
          </p>
        </div>

        <div className="mt-8.5 flex flex-col gap-3">
          <QueryState isLoading={isLoading} isError={isError} isEmpty={!cases?.length}>
            {cases?.map((item) => (
              <CaseSelectCard
                key={item.id}
                title={item.title}
                thumbnails={item.thumbnails}
                recordedAt={item.recordedAt}
                symptoms={item.symptoms}
                symptomStartedAt={item.symptomStartedAt}
                selected={item.id === selectedId}
                onClick={() => setSelectedId(item.id)}
              />
            ))}
          </QueryState>
        </div>

        <div className="mt-auto flex flex-col items-center gap-4 pt-8">
          <p className="text-center font-wantedsans text-[11px] font-normal text-[#8C8C8C]">
            현재 파일럿은 일본 지역 병원만 지원돼요
          </p>

          <div className="flex w-full flex-col gap-3">
            <Button variant="primary" disabled={!selectedId} to="/patient/hospital/matching">
              AI 추천 받기
            </Button>
            <Button variant="outline" to="/patient/hospital/network">
              네트워크 병원 둘러보기
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default HospitalSelectCase;