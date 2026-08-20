// 신속 협진 화면 (실시간 채팅 UI)

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import QueryState from '../../../components/state/QueryState';
import SmallButton from '../../../components/button/SmallButton';
import {
  useChatMessagesQuery,
  useChatRoomListQuery,
  useHospitalProfileQuery,
  useSendChatMessageMutation,
  useMarkChatRoomReadMutation,
} from '../../../hooks/useMockQueries';
import useToastStore from '../../../store/useToastStore';

const ChatRoomPage = () => {
  const { caseId, roomId } = useParams();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const { data: messages, isLoading, isError } = useChatMessagesQuery(caseId, roomId);
  const { data: rooms } = useChatRoomListQuery();
  const { data: profile } = useHospitalProfileQuery();
  const sendMessage = useSendChatMessageMutation(caseId, roomId);
  const markRead = useMarkChatRoomReadMutation(roomId);
  const room = rooms?.find((r) => String(r.id) === roomId);
  const isDone = room?.chatStatus === 'COMPLETED';

  // 채팅방 진입 시 최신 메시지까지 읽음 처리
  useEffect(() => {
    if (roomId) markRead.mutate(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // 원문 보기 상태를 토글한 메시지 id 모음 (상대 병원 메시지만 해당 - 내가 보낸 메시지는 번역본이 따로 없음)
  const [originalShown, setOriginalShown] = useState(new Set());
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    sendMessage.mutate(trimmed, { onError: () => showToast('메시지 전송에 실패했습니다.') });
    setInputValue('');
  };

  const toggleOriginal = (id) => {
    setOriginalShown((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col overflow-hidden">
      <Header title="병원 간 메시지" showBack rightSlot={<></>} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <QueryState isLoading={isLoading} isError={isError} isEmpty={false}>
          <div className="flex shrink-0 flex-col gap-4 px-5 pt-3 pb-2">
            <div className="flex items-center justify-between">
              <span className="font-wantedsans text-sm font-bold text-[#181818]">{room?.hospital}</span>
              <SmallButton
                variant="arrow"
                label={room?.canViewAgreement ? '합의안 보러가기' : '합의 완료'}
                onClick={() => navigate(`/hospital/chat/agreement/${caseId}/${roomId}`)}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col-reverse gap-4 overflow-y-auto px-5 py-4">
            {[...(messages ?? [])].reverse().map((msg) => {
              // senderHospitalId 기준 비교가 profile.id와 매칭되지 않아(네임스페이스 다름 추정) 병원명으로 비교
              const mine = msg.from === profile?.name;
              const showOriginal = originalShown.has(msg.id);
              const displayText = mine ? msg.original : showOriginal ? msg.original : msg.translated;

              return mine ? (
                <div key={msg.id} className="flex items-end justify-end gap-2">
                  <div className="flex max-w-[75%] flex-col items-end gap-1">
                    <span className="font-wantedsans text-xs font-normal text-[#181818]">{msg.from}</span>
                    <div className="rounded-2xl rounded-br-sm bg-[#EEE7FF] px-3 py-2">
                      <span className="font-wantedsans text-[12px]/[14px] font-normal text-[#333333]">
                        {displayText}
                      </span>
                    </div>
                    <span className="font-wantedsans text-[10px] font-normal text-[#8C8C8C]">{msg.time}</span>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEE7FF]">
                    <img src="/icons/hospital-purple.svg" alt="" className="h-5 w-5" />
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex items-end gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F0F3]">
                    <img src="/icons/hospital-gray.svg" alt="" className="h-5 w-5" />
                  </div>
                  <div className="flex max-w-[75%] flex-col items-start gap-1">
                    <span className="font-wantedsans text-xs font-normal text-[#181818]">{msg.from}</span>
                    <div className="rounded-2xl rounded-bl-sm bg-[#F5F5F5] px-3 py-2">
                      <span className="font-wantedsans text-[12px]/[14px] font-normal text-[#333333]">
                        {displayText}
                      </span>{' '}
                      {msg.original !== msg.translated && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleOriginal(msg.id)}
                          onKeyDown={(e) => e.key === 'Enter' && toggleOriginal(msg.id)}
                          className="cursor-pointer font-wantedsans text-[10px]/[14px] font-medium text-[#8C8C8C]"
                        >
                          {showOriginal ? '번역보기' : '원문보기'}
                        </span>
                      )}
                    </div>
                    <span className="font-wantedsans text-[10px] font-normal text-[#8C8C8C]">{msg.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex shrink-0 flex-col gap-1.5 px-5 pb-4 pt-2">
            {isDone && (
              <p className="text-center font-wantedsans text-[11px] font-normal text-[#9F9F9F]">
                이미 합의가 완료된 페이지입니다
              </p>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="메시지를 입력하세요."
                disabled={isDone}
                className="h-11 flex-1 rounded-full border border-[#DADADA] px-4 font-wantedsans text-sm font-normal text-[#181818] outline-none placeholder:text-[#9F9F9F] disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#9F9F9F]"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isDone || sendMessage.isPending}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#6B5DD6] disabled:cursor-not-allowed disabled:bg-[#DADADA]"
              >
                <img src="/icons/send-white.svg" alt="전송" className="pl-1 h-10 w-10" />
              </button>
            </div>
          </div>
        </QueryState>
      </div>
    </div>
  );
};

export default ChatRoomPage;
