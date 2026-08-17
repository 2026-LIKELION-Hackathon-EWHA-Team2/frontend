// AI 초안 검토

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import Badge from '../../../../../components/Badge';
import Textarea from '../../../../../components/Textarea';
import Button from '../../../../../components/button/Button';
import HospitalReviewCard from '../../../../../components/card/HospitalReviewCard';
import useAgreementStore from '../../../../../store/useAgreementStore';
import { AI_SUMMARY_NOTE } from '../../../../../mock/mockdata';

// 근거 tone('경미'/'없음'/'권장' 등)을 문장으로 자연스럽게 이어붙이기 위한 어미 처리
// tone이 없는(사용자가 직접 추가한) 근거는 label만 표시
const reasonText = ({ label, tone }) => {
  if (!tone) return label;
  return `${label} ${tone === '없음' ? tone : `${tone}함`}`;
};

const Step1AiDraft = ({ aiDraftLabel, aiDraftDesc, onEdit, onComplete }) => {
  const participants = useAgreementStore((s) => s.participants);
  const finalJudgement = useAgreementStore((s) => s.finalJudgement);
  const reasons = useAgreementStore((s) => s.reasons);
  const complete = useAgreementStore((s) => s.complete);
  const opinion = useAgreementStore((s) => s.opinion);
  const setOpinion = useAgreementStore((s) => s.setOpinion);

  const handleComplete = () => {
    complete();
    onComplete();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="협진 합의" showBack rightSlot={<></>} />

      <PageContainer className="flex flex-col gap-6 pt-1 pb-8">
        <p className="text-center font-wantedsans text-xs font-medium leading-normal text-[#8C8C8C]">
          양측 의료진이 협진 내용을 합의하고 최종 의견을 확정합니다.
        </p>

        {/* AI 정리 초안 */}
        <div className="flex items-start gap-3 rounded-[10px] bg-[#F2F0FD] p-4">
          <div className="mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#6B5DD6]">
            <img src="/icons/ai-glitter.svg" alt="" className="h-7 w-7" />
          </div>
          <div className="flex flex-col gap-1 pt-0.5">
            <p className="font-wantedsans text-base font-bold leading-normal text-[#6B5DD6]">{aiDraftLabel}</p>
            <p className="whitespace-pre-line font-wantedsans text-xs font-medium leading-normal text-[#626262]">
              {aiDraftDesc}
            </p>
          </div>
        </div>

        {/* 참여 병원 */}
        <div className="flex flex-col gap-2">
          <h2 className="font-wantedsans text-[15px] font-medium text-[#181818]">참여 병원</h2>
          <div className="flex gap-3">
            {participants.map((p) => (
              <HospitalReviewCard key={p.name} name={p.name} status={p.status} />
            ))}
          </div>
        </div>

        {/* 최종 합의 내용 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-wantedsans text-[15px] font-medium text-[#181818]">최종 합의 내용</h2>
            <span className="inline-block origin-left scale-90">
              <Badge tone="purple" rounded="full" size="lg">
                AI 초안
              </Badge>
            </span>
          </div>
          <div className="flex items-start gap-2 rounded-[10px] bg-[#F5F5F5] px-3 py-2">
            <span className="shrink-0 font-wantedsans text-xs font-bold leading-normal text-[#6B5DD6]">
              최종 판단
            </span>
            <span className="font-wantedsans text-xs font-medium leading-normal text-[#333333]">
              {finalJudgement}
            </span>
          </div>
        </div>

        {/* 주요 근거 */}
        <div className="-mt-2 flex flex-col gap-2">
          <h2 className="font-wantedsans text-[13px] font-medium text-[#181818]">주요 근거</h2>
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
                <span className="font-wantedsans text-xs font-medium leading-normal text-[#333333]">
                  {reasonText(reason)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 추가 소견 */}
        <div className="flex flex-col gap-2">
          <h2 className="font-wantedsans text-[15px] font-medium text-[#181818]">추가 소견</h2>
          <Textarea
            placeholder="소견을 입력해 주세요"
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
          />
        </div>

        <p className="whitespace-pre-line rounded-[10px] bg-[#F5F3FF] px-4 py-3 text-center font-wantedsans text-[11px] font-medium leading-normal text-[#8C8C8C]">
          {AI_SUMMARY_NOTE}
        </p>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit} className="flex-1">
            합의안 수정
          </Button>
          <Button variant="primary" onClick={handleComplete} className="flex-1">
            검토 완료
          </Button>
        </div>
      </PageContainer>
    </div>
  );
};

export default Step1AiDraft;
