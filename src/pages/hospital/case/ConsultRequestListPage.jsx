// 케이스 조회. GNB '케이스' 버튼 누르면 나오는 메인 페이지.

import { useMemo, useState } from 'react';

import Header from '../../../components/layout/Header';
import PageContainer from '../../../components/layout/PageContainer';
import Tabs from '../../../components/Tabs';
import Badge from '../../../components/Badge';
import SmallButton from '../../../components/button/SmallButton';
import SearchBar from '../../../components/SearchBar';
import ChatCard from '../../../components/card/ChatCard';
import QueryState from '../../../components/state/QueryState'
import { useConsultPatientsQuery } from '../../../hooks/useMockQueries';
import { CASE_STATUS_BADGE, getCaseStatusCounts } from '../../../utils/caseStatus';

const ConsultRequestListPage = () => {
  const { data: patients, isLoading } = useConsultPatientsQuery();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'reviewing' | 'done' 
  const [searchTerm, setSearchTerm] = useState('');

  // Badge 상태 인식해서 숫자 자동 반영! utils 만들엇어요~~
  const counts = useMemo(() => getCaseStatusCounts(patients ?? []), [patients]);

  const tabs = [
    { key: 'all', label: '전체 수신', count: counts.all },
    { key: 'reviewing', label: '검토중', count: counts.reviewing },
    { key: 'done', label: '완료', count: counts.done },
  ];

  const tabFiltered = useMemo(() => {
    if (!patients) return [];
    if (activeTab === 'all') return patients;
    return patients.filter((p) => p.status === activeTab);
  }, [patients, activeTab]);

  const visiblePatients = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return tabFiltered;
    return tabFiltered.filter(
      (p) => p.name.toLowerCase().includes(keyword) || p.caseId.toLowerCase().includes(keyword)
    );
  }, [tabFiltered, searchTerm]);

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
      <Header title="케이스 조회" showBack rightSlot={<></>} />
      <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} className="mb-5 mt-0.63 px-5.5" />
      <SearchBar value={searchTerm} onChange={setSearchTerm} className="mb-6 mx-5.5" />

      <PageContainer>
        <p className="mb-3 text-[#686868] font-wantedsans text-xs font-medium leading-normal">
          전체 전달 환자 <span className="text-[#6B5DD6]">{tabFiltered.length}건</span>
        </p>

        <div className="flex flex-col gap-2">
          {isLoading && (
            <p className="py-10 text-center font-wantedsans text-sm text-[#9F9F9F]">불러오는 중...</p>
          )}

          {!isLoading && visiblePatients.length === 0 && (
            <p className="py-10 text-center font-wantedsans text-sm text-[#9F9F9F]">
              검색 결과가 없습니다.
            </p>
          )}

          {visiblePatients.map((patient) => {
            const statusBadge = CASE_STATUS_BADGE[patient.status];
            const detailPath = `/hospital/case/request/${patient.id}`;

            return (
              <ChatCard
                key={patient.id}
                patientName={patient.name}
                caseId={patient.caseId}
                consultType={patient.consultType}
                hospital={patient.hospital}
                to={detailPath}
                rightContent={
                  <>
                    {statusBadge && (
                      <Badge tone={statusBadge.tone} rounded="md" size="ml">
                        {statusBadge.label}
                      </Badge>
                    )}
                    <SmallButton variant="arrow" label="케이스 보기" to={detailPath} />
                  </>
                }
              />
            );
          })}
        </div>
      </PageContainer>
    </div>
  );
};

export default ConsultRequestListPage;