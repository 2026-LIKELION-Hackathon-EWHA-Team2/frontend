import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  MOCK_CONSULT_PATIENTS,
  MOCK_HOSPITALS, // ★ useHospitalListQuery에서 사용 (네트워크, 병원 매칭, 케이스 동기화 페이지)
  MOCK_CASES,
  MOCK_PROCEDURE_HISTORY,
  MOCK_RECENT_CASES,
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
// 여기서부터는 아직 남은 hook들 - 아직 mock 유지
// ------------------------------------------------------------

// 2-2 협진요청함 / 2-3 환자조회에서 사용
export const useConsultPatientsQuery = () =>
  useQuery({ queryKey: ['consultPatients'], queryFn: () => wait(MOCK_CONSULT_PATIENTS) });

// 케이스 목록 (AI 추천 병원 매칭 - 케이스 선택)
export const useCaseListQuery = () =>
  useQuery({ queryKey: ['caseList'], queryFn: () => wait(MOCK_CASES) });

// 시술 이력 목록 / 상세
export const useProcedureHistoryQuery = () =>
  useQuery({ queryKey: ['procedureHistory'], queryFn: () => wait(MOCK_PROCEDURE_HISTORY) });

// 케이스 등록 완료 mutation
export const useCreateCaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) =>
      wait({
        id: `case-${Date.now()}`,
        status: '저장 완료',
        tone: 'orange',
        date: new Date().toISOString().slice(0, 10).replaceAll('-', '.'),
        symptomCount: formData.checkedSymptoms.length,
        symptomArea: formData.symptomArea,
      }),
    onSuccess: (newCase) => {
      queryClient.setQueryData(['recentCases'], (old = []) => [...old, newCase]);
    },
  });
};

// 홈 - 최근 케이스 목록
export const useRecentCasesQuery = () =>
  useQuery({ queryKey: ['recentCases'], queryFn: () => wait(MOCK_RECENT_CASES) });

// 홈 - 새 케이스 등록 완료 시 '최근 케이스' 목록 캐시에 바로 추가
export const useAddRecentCase = () => {
  const queryClient = useQueryClient();
  return (newCase) => queryClient.setQueryData(['recentCases'], (old = []) => [...old, newCase]);
};

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