// 최종 협진 합의 완료

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import Textarea from '../../../../../components/Textarea';
import ResultActionButton from '../../../../../components/button/ResultActionButton';
import HospitalReviewCard from '../../../../../components/card/HospitalReviewCard';
import useAgreementStore from '../../../../../store/useAgreementStore';

// 근거 tone('경미'/'없음'/'권장' 등)을 문장으로 자연스럽게 이어붙이기 위한 어미 처리
// tone이 없는(사용자가 직접 추가한) 근거는 label만 표시
const reasonText = ({ label, tone }) => {
  if (!tone) return label;
  return `${label} ${tone === '없음' ? tone : `${tone}함`}`;
};

const Step4Final = ({ prevStep }) => {
  const participants = useAgreementStore((s) => s.participants);
  const finalJudgement = useAgreementStore((s) => s.finalJudgement);
  const reasons = useAgreementStore((s) => s.reasons);
  const opinion = useAgreementStore((s) => s.opinion);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="협진 합의" showBack onBack={prevStep} rightSlot={<></>} />

      <PageContainer className="flex flex-col gap-6 pt-1 pb-8">
        <p className="text-center font-wantedsans text-xs font-medium leading-normal text-[#8C8C8C]">
          양측 의료진이 협진 내용을 합의하고 최종 의견을 확정합니다.
        </p>

        {/* 합의 완료 안내 */}
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
          <h2 className="font-wantedsans text-[15px] font-medium text-[#181818]">최종 합의 내용</h2>
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
          <Textarea placeholder="추가 소견이 없습니다" value={opinion} readOnly />
        </div>

        <div className="-mt-2 flex gap-3">
          <div className="flex-1">
            <ResultActionButton variant="share" />
          </div>
          <div className="flex-1">
            <ResultActionButton variant="download" />
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Step4Final;
