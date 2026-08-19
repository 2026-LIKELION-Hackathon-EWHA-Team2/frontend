import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  MOCK_CONSULT_PATIENTS,
  MOCK_HOSPITALS, // ★ useHospitalListQuery에서 사용 (네트워크, 병원 매칭, 케이스 동기화 페이지)
  MOCK_CASES, // ★ 일단 case API 연동을 몰라서 놔두었습니다. 
  MOCK_PROCEDURE_HISTORY,
  MOCK_HANDOVER_DOCUMENT,
  MOCK_HOSPITAL_HOME, // ★ 다른 곳에서 안 쓰면 나중에 지워도 됨
  MOCK_CONSULT_REQUEST_DETAIL,
  MOCK_QUICK_CONSULT,
  MOCK_AGREEMENT,
} from '../mock/mockdata';

import {
  loginApi,
  signupPatientApi,
  signupHospitalApi,
  getPatientProfileApi,
  getHospitalProfileApi,
  getHospitalListApi, // 요거 이제 추가!
} from '../apis/userApi'

import { createSymptomCaseApi, getSymptomCaseListApi } from '../apis/symptomCaseApi';
import {
  buildSymptomCaseFormData,
  normalizeSymptomCaseForHome,
  normalizeSymptomCaseForSelect,
} from '../utils/symptomCaseMapper';

const wait = (data, ms = 400) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

//accounts/api

// 로그인
export const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ userId, password }) => loginApi(userId, password),
  });

// 환자 회원가입
export const useSignupPatientMutation = () =>
  useMutation({
    mutationFn: (data) => signupPatientApi(data),
  });

// 병원 회원가입
export const useSignupHospitalMutation = () =>
  useMutation({
    mutationFn: (data) => signupHospitalApi(data),
  });

// 환자 프로필
export const usePatientProfileQuery = () =>
  useQuery({
    queryKey: ['patientProfile'],
    queryFn: () => getPatientProfileApi(),
  });

// 병원 프로필
export const useHospitalProfileQuery = () =>
  useQuery({
    queryKey: ['hospitalProfile'],
    queryFn: () => getHospitalProfileApi(),
  });

// 진단서 입력 화면 - Step4Certificate에서 '시술 받은 병원' 검색할 때 사용
// 훅 이름을 useHospitalAccountsListQuery로 지음 (기존 useHospitalListQuery랑 구분하려구요! 일단은...)

// search 파라미터로 병원명 검색 가능 (안 넣으면 전체 조회)
export const useHospitalAccountsListQuery = (search = '') =>
  useQuery({
    queryKey: ['hospitalAccountsList', search], // search도 큐키에 포함 - 검색어 바뀔 때마다 재조회됨
    queryFn: () => getHospitalListApi(search),
  });

// AI 추천 병원 리스트 / 네트워크 병원 목록에서 사용
// useHospitalAccountsListQuery(accounts API)랑 다른 훅! 거리/경험치/진료시간 같은
// 필드가 필요해서 별도 병원 상세 API가 나오기 전까지는 mock 유지하는 걸로 해뒀어요 @.@
export const useHospitalListQuery = () =>
  useQuery({
    queryKey: ['hospitalList'],
    queryFn: () => wait(MOCK_HOSPITALS),
  });

// ------------------------------------------------------------
// selfsymptoms/ api

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

// 증상 케이스 목록 (raw, 변환 전) - 아래 두 훅에서 공통으로 사용
export const useSymptomCaseListQuery = () =>
  useQuery({ queryKey: ['symptomCases'], queryFn: getSymptomCaseListApi });

// 환자 홈 피드 - 최근 케이스 목록
export const useRecentSymptomCasesQuery = () => {
  const query = useSymptomCaseListQuery();
  return { ...query, data: query.data?.map(normalizeSymptomCaseForHome) };
};

// AI 추천 병원 매칭 진입 전 - 케이스 선택 화면 
// ★케이스 동기화 Step2Select★ <- 요 부분은 확인 부탁드려요!!
// status가 SUBMITTED(병원 매칭 전)인 케이스만 필터링해서 보여줌
export const useSubmittedSymptomCaseListQuery = () => {
  const query = useSymptomCaseListQuery();
  return {
    ...query,
    data: query.data?.filter((c) => c.status === 'SUBMITTED').map(normalizeSymptomCaseForSelect),
  };
};

// ------------------------------------------------------------
// 여기서부터는 아직 남은 hook들 - 아직 mock 유지
// ------------------------------------------------------------

// 2-2 협진요청함 / 2-3 환자조회에서 사용
export const useConsultPatientsQuery = () =>
  useQuery({ queryKey: ['consultPatients'], queryFn: () => wait(MOCK_CONSULT_PATIENTS) });

// 시술 이력 목록 / 상세
export const useProcedureHistoryQuery = () =>
  useQuery({ queryKey: ['procedureHistory'], queryFn: () => wait(MOCK_PROCEDURE_HISTORY) });

// 협진 인계서
export const useHandoverDocumentQuery = () =>
  useQuery({ queryKey: ['handoverDocument'], queryFn: () => wait(MOCK_HANDOVER_DOCUMENT) });

// 케이스 조회 리스트에서 환자 한 명을 선택했을 때 쓰는 상세 조회
// (협진 요청 상세 / 환자 정보 상세 보기 화면에서 공통으로 사용)
export const useConsultPatientDetailQuery = (id) =>
  useQuery({
    queryKey: ['consultPatientDetail', id],
    enabled: !!id, // id가 아직 없을 때(라우팅 진입 초기 등)는 요청 자체를 하지 않도록 막음
    queryFn: () => wait(MOCK_CONSULT_PATIENTS.find((p) => p.id === id) ?? null),
  });

// 협진 요청 상세
export const useConsultRequestDetailQuery = () =>
  useQuery({ queryKey: ['consultRequestDetail'], queryFn: () => wait(MOCK_CONSULT_REQUEST_DETAIL) });

// 병원 신속 협진 - 메시지 목록
export const useQuickConsultQuery = () =>
  useQuery({ queryKey: ['quickConsult'], queryFn: () => wait(MOCK_QUICK_CONSULT) });

// 병원 신속 협진 - 새 메시지 전송 (mock, 캐시에 바로 append)
export const useSendQuickConsultMessage = () => {
  const queryClient = useQueryClient();
  return (text) =>
    queryClient.setQueryData(['quickConsult'], (old) => {
      if (!old) return old;
      const myName = old.messages.find((m) => m.mine)?.from ?? old.messages[0]?.from;
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      return {
        ...old,
        messages: [...old.messages, { from: myName, text, textJa: text, time, mine: true }],
      };
    });
};

// 협진 합의 - AI 정리 초안 (useAgreementStore 초기화에 사용하는 형식)
export const useAgreementDraftQuery = () =>
  useQuery({ queryKey: ['agreementDraft'], queryFn: () => wait(MOCK_AGREEMENT) });

// 케이스 조회 상세 - '협진 시작하기' 클릭 시 케이스 상태를 '신규 요청' -> '검토중'으로 변경 (mock, 캐시에 바로 반영)
// 채팅 목록에는 이 상태가 되어야 카드가 나타남 (신규 요청 상태는 채팅방이 아직 없는 것으로 취급)
export const useStartConsultCase = () => {
  const queryClient = useQueryClient();
  return (id) => {
    queryClient.setQueryData(['consultPatients'], (old = []) =>
      old.map((p) => (p.id === id ? { ...p, status: 'reviewing' } : p))
    );
    queryClient.setQueryData(['consultPatientDetail', id], (old) =>
      old ? { ...old, status: 'reviewing' } : old
    );
  };
};

// 협진 합의 - 양측 병원이 모두 검토 완료했을 때 케이스 상태를 '완료'로 변경 (mock, 캐시에 바로 반영)
export const useCompleteConsultCase = () => {
  const queryClient = useQueryClient();
  return (id) => {
    queryClient.setQueryData(['consultPatients'], (old = []) =>
      old.map((p) => (p.id === id ? { ...p, status: 'done' } : p))
    );
    queryClient.setQueryData(['consultPatientDetail', id], (old) =>
      old ? { ...old, status: 'done' } : old
    );
  };
};