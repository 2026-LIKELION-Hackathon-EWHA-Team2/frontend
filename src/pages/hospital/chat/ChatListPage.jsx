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
import { useChatRoomListQuery } from '../../../hooks/useMockQueries';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'reviewing', label: '검토중' },
  { key: 'done', label: '완료' },
];

const STATUS_PARAM = { reviewing: 'IN_REVIEW', done: 'COMPLETED' };
const STATUS_TONE = { IN_REVIEW: 'blue', COMPLETED: 'mint' };

const ChatListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const { data: chats, isLoading, isError } = useChatRoomListQuery(STATUS_PARAM[activeTab]);

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
            {chats?.map((chat) => (
              <ChatCard
                key={chat.id}
                patientName={chat.name}
                caseId={chat.caseId}
                hospital={chat.hospital}
                time={chat.lastMessageAt?.split(' ')[1]}
                unreadCount={chat.unreadCount}
                to={`/hospital/chat/room/${chat.medicalCaseId}/${chat.id}`}
                hospitalExtra={
                  <>
                    <Badge tone={STATUS_TONE[chat.chatStatus]} size="lg">
                      {chat.statusLabel}
                    </Badge>
                    {chat.canViewAgreement && (
                      <SmallButton
                        variant="arrow"
                        label="합의안 보기"
                        onClick={() => navigate(`/hospital/chat/agreement/${chat.medicalCaseId}/${chat.id}`)}
                      />
                    )}
                  </>
                }
              />
            ))}
          </div>
        </QueryState>
      </PageContainer>
    </>
  );
};

export default ChatListPage;
