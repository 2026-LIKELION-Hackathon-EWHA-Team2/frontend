// 환자 - 증상 케이스(selfsymptoms) 관련 쿼리

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSymptomCaseApi, getSymptomCaseListApi } from '../../apis/symptomCaseApi';
import {
  buildSymptomCaseFormData,
  normalizeSymptomCaseForHome,
  normalizeSymptomCaseForSelect,
} from '../../mappers/symptomCaseMapper';

// 증상 케이스 생성 (useCaseFormStore 값을 그대로 넘기면 내부에서 FormData로 변환)
export const useCreateSymptomCaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formValues) => createSymptomCaseApi(buildSymptomCaseFormData(formValues)),
    onSuccess: () => {
      // 홈 최근 케이스 / 케이스 선택 목록에서 같이 쓰는 목록 캐시라 한번에 갱신
      queryClient.invalidateQueries({ queryKey: ['symptomCases'] });
    },
  });
};

// 증상 케이스 목록 (raw, 변환 전) - 아래 훅들에서 공통으로 사용
export const useSymptomCaseListQuery = () =>
  useQuery({ queryKey: ['symptomCases'], queryFn: getSymptomCaseListApi });

// 환자 홈 피드 - 최근 케이스 목록
// data를 useMemo로 감싸서 query.data가 안 바뀌면 배열/객체 참조도 그대로 유지되게 함
export const useRecentSymptomCasesQuery = () => {
  const query = useSymptomCaseListQuery();
  const data = useMemo(() => query.data?.map(normalizeSymptomCaseForHome), [query.data]);
  return { ...query, data };
};

// AI 추천 병원 매칭 진입 전 - 케이스 선택 화면 (HospitalSelectCase)
// status가 SUBMITTED(등록만 하고 병원 매칭은 아직 안 한 상태)인 케이스만 필터링해서 보여줌
export const useSubmittedSymptomCaseListQuery = () => {
  const query = useSymptomCaseListQuery();
  const data = useMemo(
    () => query.data?.filter((c) => c.status === 'SUBMITTED').map(normalizeSymptomCaseForSelect),
    [query.data]
  );
  return { ...query, data };
};

// 케이스 동기화 Step2Select에서 사용
// Case 전송 건 생성(POST /cases/transfers/) 전제조건이 '증상 Case가 HOSPITAL_SELECTED 상태'라서
// AI 매칭까지 끝낸 케이스만 필터링해서 보여줘야 함
export const useHospitalSelectedSymptomCaseListQuery = () => {
  const query = useSymptomCaseListQuery();
  const data = useMemo(
    () => query.data?.filter((c) => c.status === 'HOSPITAL_SELECTED').map(normalizeSymptomCaseForSelect),
    [query.data]
  );
  return { ...query, data };
};
