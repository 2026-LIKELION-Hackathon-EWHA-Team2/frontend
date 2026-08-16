// [step 2] 보낼 케이스 검토 및 선택 확인

import { useEffect } from 'react';
import useCaseSyncStore from '../../../../../store/useCaseSyncStore';
import { useCaseListQuery } from '../../../../../hooks/useMockQueries';

const Step2Select = () => {
  const { data: cases = [] } = useCaseListQuery();
  const {
    selectedCaseId,
    setLinkedDiagnosis,
    setProcedureName,
    setProcedurePart,
    setProcedureDate,
    setMedications,
    setDoctorNote,
  } = useCaseSyncStore();

  const selectedCase = cases.find((c) => c.id === selectedCaseId);
  console.log('selectedCaseId:', selectedCaseId, 'cases:', cases, 'selectedCase:', selectedCase);

  // 케이스 데이터를 '케이스 검토(Step3)'에서 쓸 store 필드로 동기화
  // (실제 연동 시엔 이 자리에서 AI 구조화 API를 호출해 응답으로 set 하면 될 것 같아요!!)
  useEffect(() => {
    if (!selectedCase) return;
    setLinkedDiagnosis(
      selectedCase.diagnosisAttached
        ? { name: selectedCase.diagnosisName }
        : null
    );
    setProcedureName(selectedCase.procedureName ?? '');
    setProcedurePart(selectedCase.procedureArea ?? '');
    setProcedureDate(selectedCase.procedureDate ?? '');
    setMedications(selectedCase.ingredients ?? []);
    setDoctorNote(selectedCase.doctorNote ?? '');
  }, [selectedCase]);

  if (!selectedCase) return null;

  return (
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
          <div className="flex flex-col gap-1">
            <span className="text-[#181818] font-wantedsans text-[0.75rem] font-bold leading-normal">
              연동된 진단서
            </span>
            <span className="text-[#626262] font-wantedsans text-[0.625rem] font-medium leading-[0.875rem]">
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
  );
};

export default Step2Select;