// 내용 수정 완료
// 기존에는 수정 / 수정후 를 굳이 두 개의 페이지로 구분하지 않았는데,
// 피그마를 보니 두 페이지를 계속 왔다갔다 해야 할 일이 있을 것 같아 페이지를 하나 더 만들었습니다!

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import Textarea from '../../../../../components/Textarea';
import Button from '../../../../../components/button/Button';
import HospitalReviewCard from '../../../../../components/card/HospitalReviewCard';
import useAgreementStore from '../../../../../store/useAgreementStore';
import { useHospitalProfileQuery } from '../../../../../hooks/useMockQueries';
import { AI_SUMMARY_NOTE, MOCK_LAST_EDITED_AT } from '../../../../../mock/mockdata';

// 근거 tone('경미'/'없음'/'권장' 등)을 문장으로 자연스럽게 이어붙이기 위한 어미 처리
// tone이 없는(사용자가 직접 추가한) 근거는 label만 표시
const reasonText = ({ label, tone }) => {
  if (!tone) return label;
  return `${label} ${tone === '없음' ? tone : `${tone}함`}`;
};

// 검토 완료 시 처리(상대 병원 검토 여부에 따라 최종 합의서로 보낼지, 홈 + 안내 토스트로 보낼지)는
// 부모(ConsultAgreementPage)의 handleAgree가 담당 - Step1AiDraft의 '검토 완료'와 로직을 공유하기 위함
const Step3EditComplete = ({ onComplete, prevStep }) => {
  const participants = useAgreementStore((s) => s.participants);
  const finalJudgement = useAgreementStore((s) => s.finalJudgement);
  const reasons = useAgreementStore((s) => s.reasons);
  const opinion = useAgreementStore((s) => s.opinion);
  const { data: profile } = useHospitalProfileQuery();

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="협진 합의" showBack onBack={prevStep} rightSlot={<></>} />

      <PageContainer className="flex flex-col gap-6 pt-1 pb-8">
        <p className="text-center font-wantedsans text-xs font-medium leading-normal text-[#8C8C8C]">
          양측 의료진이 협진 내용을 합의하고 최종 의견을 확정합니다.
        </p>

        {/* 수정 완료 안내 */}
        <div className="flex items-center gap-1.5">
          <img src="/icons/check-lightpurple.svg" alt="" className="h-4 w-4 shrink-0" />
          <span className="font-wantedsans text-xs font-medium leading-normal text-[#181818]">
            {profile?.name} 수정 · {MOCK_LAST_EDITED_AT}
          </span>
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

        <p className="whitespace-pre-line rounded-[10px] bg-[#F5F3FF] px-4 py-3 text-center font-wantedsans text-[11px] font-normal leading-normal text-[#8C8C8C]">
          {AI_SUMMARY_NOTE}
        </p>

        <div className="flex gap-2">
          <Button variant="outline" onClick={prevStep} className="flex-1">
            합의안 수정
          </Button>
          <Button variant="primary" onClick={onComplete} className="flex-1">
            검토 완료
          </Button>
        </div>
      </PageContainer>
    </div>
  );
};

export default Step3EditComplete;
