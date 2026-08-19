// 협진 합의 - primary_action 기반 단일 화면 (검토완료/최종확정 모두 같은 버튼 하나로 처리)

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../../../components/layout/Header';
import PageContainer from '../../../../components/layout/PageContainer';
import Badge from '../../../../components/Badge';
import Textarea from '../../../../components/Textarea';
import Button from '../../../../components/button/Button';
import ResultActionButton from '../../../../components/button/ResultActionButton';
import HospitalReviewCard from '../../../../components/card/HospitalReviewCard';
import QueryState from '../../../../components/state/QueryState';
import {
  useAgreementDetailQuery,
  useUpdateAgreementMutation,
  useReviewAgreementMutation,
  useChatRoomListQuery,
  useHospitalProfileQuery,
} from '../../../../hooks/useMockQueries';
import useToastStore from '../../../../store/useToastStore';

const AI_SUMMARY_NOTE = 'AI는 초안 정리만 수행하며,\n최종 의료 판단과 후속 조치는 양측 의료진이 직접 확인합니다.';

const ConsultAgreementPage = () => {
  const { caseId, roomId } = useParams();
  const showToast = useToastStore((s) => s.showToast);

  const { data: agreement, isLoading, isError } = useAgreementDetailQuery(caseId, roomId);
  const { data: profile } = useHospitalProfileQuery();
  // 상대 병원 이름은 합의안 응답의 reviews(검토를 완료한 병원만 존재)에 없을 수 있어 채팅방 목록에서 보조로 가져옴
  const { data: rooms } = useChatRoomListQuery();
  const room = rooms?.find((r) => String(r.id) === roomId);

  const updateAgreement = useUpdateAgreementMutation(caseId, roomId);
  const reviewAgreement = useReviewAgreementMutation(caseId, roomId);

  const [isEditing, setIsEditing] = useState(false);
  const [judgmentDraft, setJudgmentDraft] = useState('');
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [additionalOpinion, setAdditionalOpinion] = useState('');

  const isFinal = agreement?.status === 'FINAL';
  const counterpartName =
    agreement?.reviews?.find((r) => r.hospital_name !== profile?.name)?.hospital_name ?? room?.hospital ?? '상대 병원';

  // '합의안 수정' 클릭 시점의 서버 값을 편집 폼에 스냅샷으로 채움
  const handleStartEdit = () => {
    setJudgmentDraft(agreement.judgmentDraft ?? '');
    setEvidenceItems(agreement.evidenceItems ?? []);
    setAdditionalOpinion(agreement.additionalOpinion ?? '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => setIsEditing(false);

  const handleSave = () => {
    updateAgreement.mutate(
      {
        judgment_draft: judgmentDraft,
        evidence_items: evidenceItems.map((item, idx) => ({ ...item, order: idx + 1 })),
        additional_opinion: additionalOpinion,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          showToast('합의안이 수정되었습니다.');
        },
        onError: () => showToast('합의안 수정에 실패했습니다.'),
      }
    );
  };

  // primary_action.code가 REVIEW/FINALIZE일 때만 버튼이 활성화되어 이 핸들러가 호출됨
  const handlePrimaryAction = () => {
    reviewAgreement.mutate(undefined, {
      onSuccess: (data) =>
        showToast(data.status === 'FINAL' ? '협진 합의가 최종 확정되었습니다.' : '검토가 완료되었습니다.'),
      onError: () => showToast('처리에 실패했습니다. 다시 시도해주세요.'),
    });
  };

  const addEvidence = () =>
    setEvidenceItems((prev) => [...prev, { id: `evidence-${Date.now()}`, content: '', order: prev.length + 1 }]);

  const updateEvidenceContent = (id, content) =>
    setEvidenceItems((prev) => prev.map((item) => (item.id === id ? { ...item, content } : item)));

  const removeEvidence = (id) => setEvidenceItems((prev) => prev.filter((item) => item.id !== id));

  const displayedEvidence = (isEditing ? evidenceItems : agreement?.evidenceItems ?? [])
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="협진 합의" showBack rightSlot={<></>} />

      <QueryState isLoading={isLoading} isError={isError} isEmpty={!agreement}>
        <PageContainer className="flex flex-col gap-6 pt-1 pb-8">
          <p className="text-center font-wantedsans text-xs font-medium leading-normal text-[#8C8C8C]">
            양측 의료진이 협진 내용을 합의하고 최종 의견을 확정합니다.
          </p>

          {isFinal ? (
            <div className="flex items-center gap-3 rounded-[10px] bg-[#F2F0FD] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6B5DD6]">
                <img src="/icons/check-mark.svg" alt="" className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-wantedsans text-base font-bold leading-normal text-[#6B5DD6]">신속 협진 합의 완료</p>
                <p className="whitespace-pre-line font-wantedsans text-xs font-medium leading-normal text-[#626262]">
                  {'양측 병원이 협진 내용을 검토하고\n최종 의견을 합의했습니다.'}
                </p>
              </div>
            </div>
          ) : (
            agreement?.editedByName && (
              <div className="flex items-center gap-1.5">
                <img src="/icons/check-lightpurple.svg" alt="" className="h-4 w-4 shrink-0" />
                <span className="font-wantedsans text-xs font-medium leading-normal text-[#181818]">
                  {agreement.editedByName} 수정 · {agreement.editedAt}
                </span>
              </div>
            )
          )}

          {/* 참여 병원 */}
          <div className="flex flex-col gap-2">
            <h2 className="font-wantedsans text-[15px] font-medium text-[#181818]">참여 병원</h2>
            <div className="flex gap-3">
              <HospitalReviewCard
                name={profile?.name ?? '우리 병원'}
                status={agreement?.myReviewCompleted ? '검토 완료' : '검토 대기'}
              />
              <HospitalReviewCard
                name={counterpartName}
                status={agreement?.counterpartReviewCompleted ? '검토 완료' : '검토 대기'}
              />
            </div>
          </div>

          {/* 최종 합의 내용 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-wantedsans text-[15px] font-medium text-[#181818]">최종 합의 내용</h2>
              {!isEditing && (
                <span className="inline-block origin-left scale-90">
                  <Badge tone="purple" rounded="full" size="lg">
                    v{agreement?.version}
                  </Badge>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-[10px] bg-[#F5F5F5] px-3 py-2">
              <span className="shrink-0 font-wantedsans text-xs font-bold leading-normal text-[#6B5DD6]">최종 판단</span>
              {isEditing ? (
                <input
                  type="text"
                  value={judgmentDraft}
                  onChange={(e) => setJudgmentDraft(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent font-wantedsans text-xs font-medium leading-normal text-[#333333] outline-none"
                />
              ) : (
                <span className="font-wantedsans text-xs font-medium leading-normal text-[#333333]">
                  {agreement?.judgmentDraft}
                </span>
              )}
            </div>
          </div>

          {/* 주요 근거 */}
          <div className="-mt-2 flex flex-col gap-2">
            <h2 className="font-wantedsans text-[13px] font-medium text-[#181818]">주요 근거</h2>
            <div className="flex flex-col rounded-[10px] border border-[#EDEDF1]">
              {displayedEvidence.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 px-4 py-2 ${
                    idx !== displayedEvidence.length - 1 ? 'border-b border-[#EDEDF1]' : ''
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6B5DD6] font-wantedsans text-[12px] font-medium leading-normal text-white">
                    {idx + 1}
                  </span>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={item.content}
                        onChange={(e) => updateEvidenceContent(item.id, e.target.value)}
                        className="min-w-0 flex-1 bg-transparent font-wantedsans text-xs font-medium leading-normal text-[#333333] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeEvidence(item.id)}
                        className="shrink-0 cursor-pointer font-wantedsans text-[11px] font-medium leading-normal text-[#D97862]"
                      >
                        근거 삭제
                      </button>
                    </>
                  ) : (
                    <span className="font-wantedsans text-xs font-medium leading-normal text-[#333333]">
                      {item.content}
                    </span>
                  )}
                </div>
              ))}

              {isEditing && (
                <button
                  type="button"
                  onClick={addEvidence}
                  className="flex cursor-pointer items-center justify-center gap-1.5 border-t border-[#EDEDF1] py-2.5"
                >
                  <img src="/icons/add.svg" alt="" className="h-5 w-5" />
                  <span className="font-wantedsans text-xs font-medium leading-normal text-[#181818]">근거 추가하기</span>
                </button>
              )}
            </div>
          </div>

          {/* 추가 소견 */}
          <div className="flex flex-col gap-2">
            <h2 className="font-wantedsans text-[15px] font-medium text-[#181818]">추가 소견</h2>
            <Textarea
              placeholder={isEditing ? '소견을 입력해 주세요' : '추가 소견이 없습니다'}
              value={isEditing ? additionalOpinion : agreement?.additionalOpinion ?? ''}
              onChange={isEditing ? (e) => setAdditionalOpinion(e.target.value) : undefined}
              readOnly={!isEditing}
            />
          </div>

          <p className="whitespace-pre-line rounded-[10px] bg-[#F5F3FF] px-4 py-3 text-center font-wantedsans text-[11px] font-medium leading-normal text-[#8C8C8C]">
            {AI_SUMMARY_NOTE}
          </p>

          {isFinal ? (
            <div className="-mt-2 flex gap-3">
              <div className="flex-1">
                <ResultActionButton variant="share" />
              </div>
              <div className="flex-1">
                <ResultActionButton variant="download" />
              </div>
            </div>
          ) : isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                취소
              </Button>
              <Button variant="primary" disabled={updateAgreement.isPending} onClick={handleSave} className="flex-1">
                {updateAgreement.isPending ? '저장 중...' : '수정 내용 저장'}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              {agreement?.canEdit && (
                <Button variant="outline" onClick={handleStartEdit} className="flex-1">
                  합의안 수정
                </Button>
              )}
              <Button
                variant="primary"
                disabled={!agreement?.primaryAction?.enabled || reviewAgreement.isPending}
                onClick={handlePrimaryAction}
                className="flex-1"
              >
                {reviewAgreement.isPending ? '처리 중...' : agreement?.primaryAction?.label}
              </Button>
            </div>
          )}
        </PageContainer>
      </QueryState>
    </div>
  );
};

export default ConsultAgreementPage;
