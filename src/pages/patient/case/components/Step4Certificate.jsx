// [step 4] 진단서 입력 화면

import { useMemo, useState } from 'react';
import useCaseFormStore from '../../../../store/useCaseFormStore';
import { useHospitalAccountsListQuery } from '../../../../hooks/useMockQueries'; // accounts 병원 목록 API 적용

// 필드명 맞추기 위한 함수...
const normalizeHospital = (h) => ({
  id: h.hospital_id, // ★ hospital_id → id
  name: h.name,
  // specialties 배열에서 이름만 뽑아 콤마로 이어붙임
  department: h.specialties?.map((s) => s.specialty_name).join(', ') || '',
});

const Step4Certificate = () => {
  const { data: rawHospitals, isLoading, isError } = useHospitalAccountsListQuery();
  const hospitals = useMemo(() => rawHospitals?.map(normalizeHospital), [rawHospitals]);
  const { setHospital, diagnosisFile, setDiagnosisFile } = useCaseFormStore();

  const [hospitalQuery, setHospitalQuery] = useState('');
  const [showHospitalList, setShowHospitalList] = useState(false);

  const filteredHospitals = useMemo(() => {
    if (!hospitals) return [];
    if (!hospitalQuery.trim()) return hospitals;
    return hospitals.filter((h) => h.name.toLowerCase().includes(hospitalQuery.trim().toLowerCase()));
  }, [hospitals, hospitalQuery]);

  const handleSelectHospital = (h) => {
    setHospital({ id: h.id, name: h.name });
    setHospitalQuery(h.name);
    setShowHospitalList(false);
  };

  const handleHospitalInputChange = (e) => {
    const value = e.target.value;
    setHospitalQuery(value);
    setShowHospitalList(true);
    // 리스트에 없는 이름을 직접 입력하는 경우, 문자열 그대로 저장 (사실 필요 없을 거 같긴 한데 일단 혹시...ㅎㅎ)
    setHospital(value ? value : null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 실제 업로드에 쓸 file과, 화면 미리보기용 previewUrl을 같이 저장 (API 연동을 위해 file도 보관)
    setDiagnosisFile({ file, name: file.name, previewUrl: URL.createObjectURL(file) });
  };

  return (
    <>
    <div className="rounded-[0.625rem] border border-solid border-[#EDEDF1] p-4">
      <p className="mb-3 text-[#6B5DD6] font-wantedsans text-[0.875rem] font-bold leading-normal">진단서 직접 업로드</p>
      <p className="mb-5 text-[#626262] font-wantedsans text-[0.625rem] font-medium leading-[0.875rem]">진단서 정보를 입력해주세요.</p>

      <div className="relative mb-4">
        <p className="mb-2 text-[#181818] font-wantedsans text-[0.75rem] font-bold leading-normal">시술 받은 병원</p>
        <div className="flex h-11 items-center gap-2 rounded-[0.625rem] border border-[#DADADA] px-[0.875rem] py-3">
          <img src="/icons/search.svg" alt="" className="h-5 w-5 shrink-0" />
          <input
            type="text"
            value={hospitalQuery}
            onChange={handleHospitalInputChange}
            onFocus={() => setShowHospitalList(true)}
            placeholder="병원 이름을 검색해주세요"
            className="w-full text-[#181818] font-wantedsans text-[0.75rem] font-medium leading-[0.875rem] outline-none placeholder:text-[#C7C7CC]"
          />
        </div>

        {showHospitalList && hospitalQuery && (
          <ul className="absolute mt-[0.1rem] z-10 max-h-48 w-full overflow-y-auto rounded-[0.625rem] border border-[#EDEDF1] bg-white shadow-md">
            {isLoading && (
              <li className="px-3 py-2.5 font-wantedsans text-[0.625rem] font-normal text-[#9F9F9F]">
                병원 목록 불러오는 중...
              </li>
            )}
            {!isLoading && isError && (
              <li className="px-3 py-2.5 font-wantedsans text-[0.625rem] font-normal text-[#9F9F9F]">
                병원 목록을 불러오지 못했습니다
              </li>
            )}
            {!isLoading && !isError && filteredHospitals.length === 0 && (
              <li className="px-3 py-2.5 font-wantedsans text-[0.625rem] font-normal text-[#9F9F9F]">
                검색 결과가 없습니다
              </li>
            )}
            {!isLoading &&
              !isError &&
              filteredHospitals.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectHospital(h)}
                    className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-[#FAFAFA]"
                  >
                    <span className="font-wantedsans text-xs font-medium text-[#181818]">{h.name}</span>
                    <span className="font-wantedsans text-[0.625rem] font-normal text-[#9F9F9F]">{h.department}</span>
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      <p className="mb-3 text-[#181818] font-wantedsans text-[0.75rem] font-bold leading-normal">진단서 업로드</p>
      <label className="flex w-full h-16 cursor-pointer items-center gap-[0.625rem] rounded-[0.625rem] border border-dashed border-[#DADADA] bg-white px-3 py-[0.875rem]">
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
        {diagnosisFile ? (
          <>
            <img src="/icons/case-intro-doc.svg" alt="" className="h-8 w-8 shrink-0" />
            <span className="text-[#626262] font-wantedsans text-[0.625rem] font-medium leading-[0.875rem]">{diagnosisFile.name}</span>
          </>
        ) : (
          <>
            <img src="/icons/upload-cloud.svg" alt="" className="h-9 w-9 shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="text-[#626262] font-wantedsans text-[0.625rem] font-medium leading-[0.875rem]">
                진단서 원본 파일을 업로드해주세요.
              </span>
              <span className="text-[#9F9F9F] font-wantedsans text-[0.625rem] font-normal leading-[0.875rem]">
                JPG, PNG, PDF (최대 100MB)
              </span>
            </div>
          </>
        )}
      </label>
      </div>
    </>
  );
};

export default Step4Certificate;