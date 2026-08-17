// 내용 수정 폼

import { useEffect } from 'react';
import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import Button from '../../../../../components/button/Button';
import Textarea from '../../../../../components/Textarea';
import HospitalReviewCard from '../../../../../components/card/HospitalReviewCard';
import useAgreementStore from '../../../../../store/useAgreementStore';

const Step2Edit = ({ nextStep, prevStep }) => {
  const participants = useAgreementStore((s) => s.participants);
  const finalJudgement = useAgreementStore((s) => s.finalJudgement);
  const reasons = useAgreementStore((s) => s.reasons);
  const selectParticipant = useAgreementStore((s) => s.selectParticipant);
  const setParticipantStatus = useAgreementStore((s) => s.setParticipantStatus);
  const setFinalJudgement = useAgreementStore((s) => s.setFinalJudgement);
  const setReasonLabel = useAgreementStore((s) => s.setReasonLabel);
  const addReason = useAgreementStore((s) => s.addReason);
  const removeReason = useAgreementStore((s) => s.removeReason);
  const saveEdit = useAgreementStore((s) => s.saveEdit);
  const opinion = useAgreementStore((s) => s.opinion);
  const setOpinion = useAgreementStore((s) => s.setOpinion);

  // 내용 수정 화면 진입 시, 우리(자국) 병원이 수정 의사로 선택되고 검토중 상태로 전환됨
  useEffect(() => {
    selectParticipant('자국 병원');
    setParticipantStatus('자국 병원', '검토 중');
  }, [selectParticipant, setParticipantStatus]);

  const handleSave = () => {
    saveEdit();
    nextStep();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="내용 수정" showBack onBack={prevStep} rightSlot={<></>} />

      <PageContainer className="flex flex-1 flex-col gap-6 pt-1 pb-6">
        {/* 참여 병원 */}
        <div className="flex flex-col gap-2">
          <h2 className="font-wantedsans text-[15px] font-medium text-[#181818]">참여 병원 (수정 의사 선택)</h2>
          <div className="flex gap-3">
            {participants.map((p) => (
              <HospitalReviewCard key={p.name} name={p.name} status={p.status} />
            ))}
          </div>
        </div>

        {/* 최종 합의 내용 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <h2 className="font-wantedsans text-[15px] font-medium text-[#181818]">최종 합의 내용</h2>
            <img src="/icons/edit.svg" alt="" className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-2 rounded-[10px] bg-[#F5F5F5] px-3 py-2">
            <span className="shrink-0 font-wantedsans text-xs font-bold leading-normal text-[#6B5DD6]">
              최종 판단
            </span>
            <input
              type="text"
              value={finalJudgement}
              onChange={(e) => setFinalJudgement(e.target.value)}
              className="min-w-0 flex-1 bg-transparent font-wantedsans text-xs font-medium leading-normal text-[#333333] outline-none"
            />
          </div>
        </div>

        {/* 주요 근거 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <h2 className="font-wantedsans text-[13px] font-medium text-[#181818]">주요 근거</h2>
            <img src="/icons/edit.svg" alt="" className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col rounded-[10px] border border-[#EDEDF1]">
            {reasons.map((reason, idx) => (
              <div
                key={reason.id}
                className={`flex items-center gap-2 px-4 py-2 ${
                  idx !== reasons.length - 1 ? 'border-b border-[#EDEDF1]' : ''
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6B5DD6] font-wantedsans text-[12px] font-medium leading-normal text-white">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={reason.label}
                  onChange={(e) => setReasonLabel(reason.id, e.target.value)}
                  className="min-w-0 flex-1 bg-transparent font-wantedsans text-xs font-medium leading-normal text-[#333333] outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeReason(reason.id)}
                  className="shrink-0 cursor-pointer font-wantedsans text-[11px] font-medium leading-normal text-[#D97862]"
                >
                  근거 삭제
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addReason('새 근거', '')}
              className="flex cursor-pointer items-center justify-center gap-1.5 border-t border-[#EDEDF1] py-2.5"
            >
              <img src="/icons/add.svg" alt="" className="h-5 w-5" />
              <span className="font-wantedsans text-xs font-medium leading-normal text-[#181818]">근거 추가하기</span>
            </button>
          </div>
        </div>

        {/* 추가 소견 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <h2 className="font-wantedsans text-[15px] font-medium text-[#181818]">추가 소견</h2>
            <img src="/icons/edit.svg" alt="" className="h-3.5 w-3.5" />
          </div>
          <Textarea
            placeholder="소견을 입력해 주세요"
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
          />
        </div>

        <div className="mt-auto pb-13">
          <Button variant="primary" onClick={handleSave}>
            수정 내용 저장
          </Button>
        </div>
      </PageContainer>
    </div>
  );
};

export default Step2Edit;
