// GNB '채팅' 버튼 누르면 나오는 메인 페이지. 채팅 목록이 표시되는 화면.

import Header from '../../../components/layout/Header';
import PageContainer from '../../../components/layout/PageContainer';
import QueryState from '../../../components/state/QueryState';
import ChatCard from '../../../components/card/ChatCard';
import { useConsultPatientsQuery } from '../../../hooks/useMockQueries';

const ChatListPage = () => {
  const { data: chats, isLoading, isError } = useConsultPatientsQuery();

  return (
    <>
      <Header title="채팅" rightSlot={<></>} />

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
                consultType={chat.consultType}
                hospital={chat.hospital}
                time={chat.requestedAt?.split(' ')[1]}
                unreadCount={chat.unreadCount}
                to={`/hospital/chat/room/${chat.id}`}
              />
            ))}
          </div>
        </QueryState>
      </PageContainer>
    </>
  );
};

export default ChatListPage;
