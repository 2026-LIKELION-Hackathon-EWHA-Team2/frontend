// 케이스 조회. GNB '케이스' 버튼 누르면 나오는 메인 페이지.

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../../components/layout/Header';
import PageContainer from '../../../components/layout/PageContainer';
import Tabs from '../../../components/Tabs';
import Badge from '../../../components/Badge';
import SmallButton from '../../../components/button/SmallButton';
import SearchBar from '../../../components/SearchBar';
import ChatCard from '../../../components/card/ChatCard';
import QueryState from '../../../components/state/QueryState'
import NewRequestModal from '../../../components/modal/NewRequestModal';
import { useConsultPatientsQuery } from '../../../hooks/useMockQueries';
import { CASE_STATUS_BADGE, getCaseStatusCounts } from '../../../utils/caseStatus';

const ConsultRequestListPage = () => {
  const navigate = useNavigate();
  const { data: patients, isLoading } = useConsultPatientsQuery();

  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'reviewing' | 'done'
  const [searchTerm, setSearchTerm] = useState('');
  // '신규 요청' 카드는 바로 이동하지 않고, 확인 모달을 먼저 띄우기 위해 대상 환자를 잠깐 들고 있음
  const [pendingPatient, setPendingPatient] = useState(null);

  // Badge 상태 인식해서 숫자 자동 반영! utils 만들엇어요~~
  const counts = useMemo(() => getCaseStatusCounts(patients ?? []), [patients]);

  const tabs = [
    { key: 'new', label: '신규 요청', count: counts.new },
    { key: 'reviewing', label: '검토중', count: counts.reviewing },
    { key: 'done', label: '완료', count: counts.done },
  ];

  const tabFiltered = useMemo(() => {
    if (!patients) return [];
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
      <Header title="전체 케이스 조회" showBack rightSlot={<></>} />
      <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} className="mb-5 mt-0.63 px-5.5" />
      <SearchBar value={searchTerm} onChange={setSearchTerm} className="mb-6 mx-5.5" />

      <PageContainer>
        <p className="mb-3 text-[#686868] font-wantedsans text-xs font-medium leading-normal">
          전체 전달 환자 <span className="text-[#6B5DD6]">{tabFiltered.length}건</span>
        </p>

        <div className="flex flex-col gap-2">
          {isLoading && (
            <QueryState isLoading={true}></QueryState>
          )}

          {!isLoading && visiblePatients.length === 0 && (
            <p className="py-10 text-center font-wantedsans text-sm text-[#9F9F9F]">
              검색 결과가 없습니다.
            </p>
          )}

          {visiblePatients.map((patient) => {
            const statusBadge = CASE_STATUS_BADGE[patient.status];
            const detailPath = `/hospital/case/request/${patient.id}`;
            const isNewRequest = patient.status === 'new';

            return (
              <ChatCard
                key={patient.id}
                patientName={patient.name}
                caseId={patient.caseId}
                hospital={patient.hospital}
                to={isNewRequest ? undefined : detailPath}
                onClick={isNewRequest ? () => setPendingPatient(patient) : undefined}
                rightContent={
                  <>
                    {statusBadge && (
                      <Badge tone={statusBadge.tone} rounded="md" size="ml">
                        {statusBadge.label}
                      </Badge>
                    )}
                    <SmallButton
                      variant="arrow"
                      label="케이스 보기"
                      to={isNewRequest ? undefined : detailPath}
                      onClick={isNewRequest ? () => setPendingPatient(patient) : undefined}
                    />
                  </>
                }
              />
            );
          })}
        </div>
      </PageContainer>

      <NewRequestModal
        open={!!pendingPatient}
        patientName={pendingPatient?.name}
        onClose={() => setPendingPatient(null)}
        onConfirm={() => {
          navigate(`/hospital/case/request/${pendingPatient.id}`);
          setPendingPatient(null);
        }}
      />
    </div>
  );
};

export default ConsultRequestListPage;