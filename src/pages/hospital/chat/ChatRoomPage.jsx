// 신속 협진 화면 (실시간 채팅 UI)

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import QueryState from '../../../components/state/QueryState';
import Badge from '../../../components/Badge';
import SmallButton from '../../../components/button/SmallButton';
import ConfirmModal from '../../../components/modal/ConfirmModal';
import { useQuickConsultQuery, useSendQuickConsultMessage } from '../../../hooks/useMockQueries';

const ChatRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: consult, isLoading, isError } = useQuickConsultQuery();
  const sendMessage = useSendQuickConsultMessage();
  // 원문보기/번역보기를 눌러 일본어 버전을 보고 있는 메시지의 인덱스 모음
  const [japaneseShown, setJapaneseShown] = useState(new Set());
  const [inputValue, setInputValue] = useState('');
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInputValue('');
  };

  const toggleJapanese = (key) => {
    setJapaneseShown((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col overflow-hidden">
      <Header title="병원 신속 협진" showBack rightSlot={<></>} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <QueryState isLoading={isLoading} isError={isError} isEmpty={!consult}>
          {consult && (
            <>
              {/* 상단 고정 영역: 요청 정보 카드 + 병원 간 메시지 헤더 */}
              <div className="flex shrink-0 flex-col gap-4 px-5 pt-3">
                <div className="flex w-full flex-col items-start gap-3 rounded-[10px] border border-[#EDEDF1] p-3">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img src="/icons/case-select.svg" alt="" className="h-6 w-6" />
                      <span className="font-wantedsans text-sm font-medium leading-normal text-[#181818]">
                        자국 의사 검토 요청
                      </span>
                    </div>
                    <Badge tone="purple" size="lg">
                      {consult.status}
                    </Badge>
                  </div>

                  <div className="flex w-full flex-col gap-2 border-t border-[#EDEDF1] pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img src="/icons/chat-hospital.svg" alt="" className="h-4 w-4" />
                        <span className="font-wantedsans text-xs font-medium leading-normal text-[#626262]">
                          요청 병원
                        </span>
                      </div>
                      <span className="font-wantedsans text-xs font-medium leading-normal text-[#212121]">
                        {consult.requestHospital}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img src="/icons/chat-subject.svg" alt="" className="h-4 w-4" />
                        <span className="font-wantedsans text-xs font-medium leading-normal text-[#626262]">
                          검토 대상
                        </span>
                      </div>
                      <span className="font-wantedsans text-xs font-medium leading-normal text-[#212121]">
                        {consult.reviewTarget}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img src="/icons/chat-clock.svg" alt="" className="h-4 w-4" />
                        <span className="font-wantedsans text-xs font-medium leading-normal text-[#626262]">
                          응답 기준
                        </span>
                      </div>
                      <span className="font-wantedsans text-xs font-medium leading-normal text-[#212121]">
                        {consult.responseDeadline}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img src="/icons/chat-check.svg" alt="" className="h-6 w-6" />
                    <span className="font-wantedsans text-sm font-bold text-[#181818]">병원 간 메시지</span>
                  </div>
                  <SmallButton variant="arrow" label="합의 완료" onClick={() => setShowAgreementModal(true)} />
                </div>
              </div>

              {/* 메시지 목록: 이 영역만 스크롤, 최신 메시지가 기본으로 보이도록 역순 배치 */}
              <div className="flex flex-1 flex-col-reverse gap-4 overflow-y-auto px-5 py-4">
                {[...consult.messages].reverse().map((msg, idx) => {
                  const key = consult.messages.length - 1 - idx;
                  const showJa = japaneseShown.has(key);
                  const displayText = showJa ? msg.textJa : msg.text;

                  return msg.mine ? (
                    <div key={key} className="flex items-end justify-end gap-2">
                      <div className="flex max-w-[75%] flex-col items-end gap-1">
                        <span className="font-wantedsans text-xs font-normal text-[#181818]">{msg.from}</span>
                        <div className="rounded-2xl rounded-br-sm bg-[#EEE7FF] px-3 py-2">
                          <span className="font-wantedsans text-[12px]/[14px] font-normal text-[#333333]">{displayText}</span>{' '}
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleJapanese(key)}
                            onKeyDown={(e) => e.key === 'Enter' && toggleJapanese(key)}
                            className="cursor-pointer font-wantedsans text-[10px]/[14px] font-medium text-[#6B5DD6]"
                          >
                            번역보기
                          </span>
                        </div>
                        <span className="font-wantedsans text-[10px] font-normal text-[#8C8C8C]">{msg.time}</span>
                      </div>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEE7FF]">
                        <img src="/icons/hospital-purple.svg" alt="" className="h-5 w-5" />
                      </div>
                    </div>
                  ) : (
                    <div key={key} className="flex items-end gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F0F3]">
                        <img src="/icons/hospital-gray.svg" alt="" className="h-5 w-5" />
                      </div>
                      <div className="flex max-w-[75%] flex-col items-start gap-1">
                        <span className="font-wantedsans text-xs font-normal text-[#181818]">{msg.from}</span>
                        <div className="rounded-2xl rounded-bl-sm bg-[#F5F5F5] px-3 py-2">
                          <span className="font-wantedsans text-[12px]/[14px] font-normal text-[#333333]">{displayText}</span>{' '}
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleJapanese(key)}
                            onKeyDown={(e) => e.key === 'Enter' && toggleJapanese(key)}
                            className="cursor-pointer font-wantedsans text-[10px]/[14px] font-medium text-[#8C8C8C]"
                          >
                            원문보기
                          </span>
                        </div>
                        <span className="font-wantedsans text-[10px] font-normal text-[#8C8C8C]">{msg.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 하단 고정 메시지 입력 */}
              <div className="flex shrink-0 items-center gap-2 px-5 pb-4 pt-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="메시지를 입력하세요."
                  className="h-11 flex-1 rounded-full border border-[#DADADA] px-4 font-wantedsans text-sm font-normal text-[#181818] outline-none placeholder:text-[#9F9F9F]"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#6B5DD6]"
                >
                  <img src="/icons/send-white.svg" alt="전송" className="pl-1 h-10 w-10" />
                </button>
              </div>
            </>
          )}
        </QueryState>
      </div>

      <ConfirmModal
        open={showAgreementModal}
        title="최종 합의 완료하시겠습니까?"
        description="대화를 바탕으로 AI가 협진 내용을 요약 정리해줍니다."
        onCancel={() => setShowAgreementModal(false)}
        onConfirm={() => navigate(`/hospital/chat/agreement/${id}`)}
      />
    </div>
  );
};

export default ChatRoomPage;
