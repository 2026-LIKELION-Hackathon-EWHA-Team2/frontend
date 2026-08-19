// 2-4 인계 서류 (협진 결과 인계서)

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../../../components/layout/Header';
import PageContainer from '../../../../components/layout/PageContainer';
import QueryState from '../../../../components/state/QueryState';
import Textarea from '../../../../components/Textarea';
import ResultActionButton from '../../../../components/button/ResultActionButton';
import HospitalReviewCard from '../../../../components/card/HospitalReviewCard';
import useGnbOverrideStore from '../../../../store/useGnbOverrideStore';
import { useProcedureHistoryDetailQuery } from '../../../../hooks/useMockQueries';

// 근거 tone('경미'/'없음'/'권장' 등)을 문장으로 자연스럽게 이어붙이기 위한 어미 처리
// tone이 없는(사용자가 직접 추가한) 근거는 label만 표시
const reasonText = ({ label, tone }) => {
  if (!tone) return label;
  return `${label} ${tone === '없음' ? tone : `${tone}함`}`;
};

const ConsultHistoryPage = () => {
  const { id } = useParams();
  const setOverridePath = useGnbOverrideStore((state) => state.setOverridePath);
  const clearOverridePath = useGnbOverrideStore((state) => state.clearOverridePath);

  const { data: procedure, isLoading, isError } = useProcedureHistoryDetailQuery(id);
  const { participants, finalJudgement, reasons, opinion } = procedure?.agreement ?? {};

  // 마이페이지 하위 경로지만, 이 화면에서는 하단 GNB의 '병원' 탭을 활성 표시
  useEffect(() => {
    setOverridePath('/patient/hospital');
    return () => clearOverridePath();
  }, [setOverridePath, clearOverridePath]);

  return (
    <>
      <Header title="협진 결과 인계서" showBack rightSlot={<></>} />

      <PageContainer className="flex flex-col gap-6 pt-3 pb-10">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!procedure}
          emptyProps={{ title: '협진 결과 인계서를 찾을 수 없어요' }}
          errorMessage="완료된 시술 이력을 찾을 수 없어요"
        >
          {procedure && (
            <>
              <p className="-mt-3 text-center font-wantedsans text-[11px] font-normal leading-normal text-[#626262]">
                CROSS-BORDER COLLABORATION RECORD
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
                    <HospitalReviewCard key={p.name} name={p.name} status="검토 완료" />
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
            </>
          )}
        </QueryState>
      </PageContainer>
    </>
  );
};

export default ConsultHistoryPage;
