// GNB '채팅' 버튼 누르면 나오는 메인 페이지. 채팅 목록이 표시되는 화면.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import PageContainer from '../../../components/layout/PageContainer';
import QueryState from '../../../components/state/QueryState';
import ChatCard from '../../../components/card/ChatCard';
import Badge from '../../../components/Badge';
import SmallButton from '../../../components/button/SmallButton';
import Tabs from '../../../components/Tabs';
import { useConsultPatientsQuery } from '../../../hooks/useMockQueries';
import { CASE_STATUS_BADGE } from '../../../utils/caseStatus';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'reviewing', label: '검토중' },
  { key: 'done', label: '완료' },
];

const ChatListPage = () => {
  const navigate = useNavigate();
  const { data: allChats, isLoading, isError } = useConsultPatientsQuery();
  const [activeTab, setActiveTab] = useState('all');

  // '신규 요청' 상태는 아직 협진 시작 전(케이스 조회에서 '협진 시작하기'를 눌러야 채팅방이 생김)이라 목록에서 제외
  const ongoingChats = allChats?.filter((chat) => chat.status !== 'new');
  const chats =
    activeTab === 'all' ? ongoingChats : ongoingChats?.filter((chat) => chat.status === activeTab);

  return (
    <>
      <Header title="채팅" rightSlot={<></>} />
      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} className="mb-2 mt-0.63 px-5.5" />

      <PageContainer className="pt-6 pb-10">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!chats?.length}
          emptyProps={{ title: '진행 중인 채팅이 없어요' }}
        >
          <div className="flex flex-col gap-3">
            {chats?.map((chat) => {
              const statusBadge = CASE_STATUS_BADGE[chat.status];
              const isDone = chat.status === 'done';

              return (
                <ChatCard
                  key={chat.id}
                  patientName={chat.name}
                  caseId={chat.caseId}
                  hospital={chat.hospital}
                  time={chat.requestedAt?.split(' ')[1]}
                  unreadCount={chat.unreadCount}
                  to={`/hospital/chat/room/${chat.id}`}
                  hospitalExtra={
                    <>
                      {statusBadge && (
                        <Badge tone={statusBadge.tone} size="lg">
                          {statusBadge.label}
                        </Badge>
                      )}
                      {isDone && (
                        <SmallButton
                          variant="arrow"
                          label="합의안 보기"
                          onClick={() =>
                            navigate(`/hospital/chat/agreement/${chat.id}`, { state: { initialStep: 4 } })
                          }
                        />
                      )}
                    </>
                  }
                />
              );
            })}
          </div>
        </QueryState>
      </PageContainer>
    </>
  );
};

export default ChatListPage;
