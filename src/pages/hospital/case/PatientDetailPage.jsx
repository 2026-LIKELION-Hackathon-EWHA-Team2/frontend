// 환자 케이스 상세 보기 (열람 동의 모달 포함)

// 백엔드 연동 시: useConsultPatientDetailQuery(id) 내부의 mock fetch만 실제 단건 조회 API로 교체.

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../../../components/layout/Header';
import PageContainer from '../../../components/layout/PageContainer';
import Badge from '../../../components/Badge';
import CaseSummaryCard from '../../../components/card/CaseSummaryCard';
import QueryState from '../../../components/state/QueryState';
import { useConsultPatientDetailQuery } from '../../../hooks/useMockQueries';

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 pt-1">
    <img src={icon} alt="" className="h-4 w-4 shrink-0" />
    <span className="w-20 shrink-0 text-[#333] font-wantedsans text-[0.625rem] font-medium leading-normal">{label}</span>
    <span className="text-[#333] font-wantedsans text-[0.625rem] font-normal leading-[0.875rem]">{value}</span>
  </div>
);

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: patient, isLoading } = useConsultPatientDetailQuery(id);

  return (
    <>
      <Header title="환자 정보 상세 보기" showBack rightSlot={<></>} />

      <PageContainer>
        <QueryState
          isLoading={isLoading}
          isError={!patient}
          errorMessage="해당 환자 정보를 찾을 수 없습니다"
        >
        <CaseSummaryCard
          patientName={patient.name}
          caseId={patient.caseId}
          consultType={patient.consultType}
          hospital={patient.hospital}
          requestedAt={patient.requestedAt}
          className="mt-5 mb-5"
        />

        <h2 className="mb-3 text-[#181818] font-wantedsans text-sm font-medium leading-[1.125rem]">환자 제공 정보</h2>
        <div className="mb-4 rounded-[0.625rem] border border-[#EDEDF1] px-3 py-2.5">
          <p className="mb-3.5 text-[#181818] font-wantedsans text-xs font-medium leading-normal">증상 사진</p>
          {patient.photos && patient.photos.length > 0 ? (
            <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-none">
              {patient.photos.map((photo, i) => (
                <img
                  key={`${photo}-${i}`}
                  src={photo}
                  alt={`증상 사진 ${i + 1}`}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="mb-4 font-wantedsans text-xs font-medium text-[#9F9F9F]">
              환자가 등록한 증상 사진이 없습니다
            </p>
          )}

          <div className='flex items-center mb-2 gap-3'>
          <span className="text-[#181818] font-wantedsans text-xs font-medium leading-normal">주요 증상</span>
          <div className="flex flex-wrap gap-1.5">
            {patient.symptomTags && patient.symptomTags.length > 0 ? (
              patient.symptomTags.map((tag) => (
                <Badge key={tag} tone="bsymptom" rounded="full" size="xl">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="font-wantedsans text-xs font-medium text-[#9F9F9F]">특이 증상 없음</span>
            )}
          </div>
          </div>

          <div className="border-t border-[#EDEDF1] gap-2 pt-1.5">
            <InfoRow icon="/icons/info-area.svg" label="증상 부위" value={patient.symptomArea} />
            <InfoRow icon="/icons/info-calendar.svg" label="증상 시작일" value={patient.symptomDate} />
            <InfoRow icon="/icons/info-calendar.svg" label="시술일" value={patient.procedureAt?.split(' ')[0]} />
            <InfoRow icon="/icons/info-pain.svg" label="통증 정도" value={patient.symptomLevel} />
            <InfoRow icon="/icons/info-desc.svg" label="증상 설명" value={patient.symptomDesc} />
          </div>
        </div>

        <h2 className="mb-2 text-[#181818] font-wantedsans text-sm font-medium leading-[1.125rem]">부작용 유형</h2>
        <div className="mb-4 rounded-[0.625rem] border border-[#EDEDF1] px-3 py-2.5">
          {patient.sideEffects && patient.sideEffects.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {patient.sideEffects.map((effect) => (
                <Badge
                  key={effect}
                  tone="bsymptom"
                  rounded="full"
                  size="xl"
                  icon={<img src="/icons/badge-check-purple.svg" alt="" className="mr-1 h-3.5 w-3.5" />}
                >  {effect}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="font-wantedsans text-xs font-medium text-[#9F9F9F]">보고된 부작용이 없습니다.</span>
          )}
        </div>

        <div className="rounded-[0.625rem] border border-[#6B5DD6]/20 bg-[#FAFAFF] px-3 py-2.5">
          <div className="pb-1.5 border-b border-[#6B5DD6]/20 flex items-start gap-1.5">
            <img src="/icons/ai-sparkle.svg" alt="" className="h-5 w-5" />
            <div className='flex flex-col gap-1'>
            <h3 className="text-[#181818] font-wantedsans text-sm font-medium leading-[1.125rem]">AI 번역·요약</h3>
            <p className="font-wantedsans text-[11px] font-medium text-[#8C8C8C]">
            환자가 제공한 정보와 진단서를 바탕으로 AI가 번역·요약했습니다.
          </p>
            </div>
          </div>
          <p className="pt-1.5 text-[#333] font-wantedsans text-[0.625rem] font-normal leading-[0.875rem]">
            {patient.aiSummary}
          </p>
        </div>
        </QueryState>
      </PageContainer>
    </>
  );
};

export default PatientDetailPage;