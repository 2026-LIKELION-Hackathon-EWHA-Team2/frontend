// [step 2] 보낼 케이스 검토 및 선택 확인

import { useEffect } from 'react';
import useCaseSyncStore from '../../../../../store/useCaseSyncStore';
import { useHospitalSelectedSymptomCaseListQuery } from '../../../../../hooks/useMockQueries';
import QueryState from '../../../../../components/state/QueryState';

const Step2Select = () => {
  const { data: cases = [], isLoading, isError } = useHospitalSelectedSymptomCaseListQuery();
  const { selectedCaseId, setLinkedDiagnosis } = useCaseSyncStore();

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  // 진단서 연동 정보만 store에 동기화 (시술/약물/소견 정보는 여기서 다루지 않음 -
  // '다음 단계(AI로 구조화하기)'에서 실제 Case 전송 건 생성 API를 호출해 응답으로 채움)
  useEffect(() => {
    if (!selectedCase) return;
    setLinkedDiagnosis(
      selectedCase.diagnosisAttached
        ? { name: selectedCase.diagnosisName }
        : null
    );
  }, [selectedCase]);

  if (!selectedCase) return null;

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && !isError && !selectedCase}
      emptyProps={{ title: '선택된 케이스를 찾을 수 없습니다', description: '이전 단계에서 케이스를 다시 선택해주세요' }}
    >
      {selectedCase && (
        <div className="flex flex-col">
          <div className="mb-7 text-center">
            <p className="mb-1 text-[#181818] text-center font-wantedsans text-xl font-medium leading-normal">
              선택한 케이스 확인
            </p>
            <p className="text-[#626262] font-wantedsans text-[0.6875rem] font-medium leading-normal">
              이 케이스로 협진을 진행할게요.
            </p>
          </div>
 
          <div className="mb-6 rounded-[0.625rem] border border-[#DFDFE4] px-3 py-2.5">
            <div className="mb-3 flex gap-1">
              {selectedCase.thumbnails?.map((thumb, idx) => (
                <img
                  key={idx}
                  src={thumb}
                  alt={`${selectedCase.title} 사진 ${idx + 1}`}
                  className="h-12 w-12 rounded-md object-cover"
                />
              ))}
            </div>
            <p className="mb-3 text-[#181818] font-wantedsans text-base font-medium leading-normal">
              {selectedCase.title}
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-normal">
                  기록 일시
                </span>
                <span className="text-[#686868] font-wantedsans text-[0.6875rem] font-medium leading-normal">
                  {selectedCase.recordedAt}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-normal">
                  선택 증상
                </span>
                <span className="text-[#686868] font-wantedsans text-[0.6875rem] font-medium leading-normal">
                  {selectedCase.symptoms}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-normal">
                  증상 발생 시점
                </span>
                <span className="text-[#686868] font-wantedsans text-[0.6875rem] font-medium leading-normal">
                  {selectedCase.symptomStartedAt}
                </span>
              </div>
            </div>
          </div>
 
          <p className="mb-3 text-[#181818] font-wantedsans text-xs font-bold leading-normal">
            연동된 진단서
          </p>
          {selectedCase.diagnosisAttached ? (
            <div className="flex items-center gap-2.5 rounded-[0.625rem] border border-[#DADADA] px-3 py-3.5">
              <img src="/icons/diagnosis-file.svg" alt="" className="h-9.25 w-9.25 shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-[#181818] font-wantedsans text-[0.75rem] font-bold leading-normal">
                  연동된 진단서
                </span>
                <span className="break-all text-[#626262] font-wantedsans text-[0.625rem] font-medium leading-[0.875rem]">
                  {selectedCase.diagnosisName}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-[0.625rem] border border-dashed border-[#DADADA] px-4 py-3.5 text-center">
              <span className="text-[#626262] font-wantedsans text-[0.625rem] font-medium leading-normal">
                연동된 진단서가 없습니다.
              </span>
            </div>
          )}
        </div>
      )}
    </QueryState>
  );
};
 
export default Step2Select;