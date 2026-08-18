import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  MOCK_CONSULT_PATIENTS,
  MOCK_HOSPITALS, // ★ useHospitalListQuery는 계속 mock 사용 일단!
  MOCK_CASES,
  MOCK_PROCEDURE_HISTORY,
  MOCK_RECENT_CASES,
  MOCK_HANDOVER_DOCUMENT,
  MOCK_HOSPITAL_HOME, // ★ 다른 곳에서 안 쓰면 나중에 지워도 됨
  MOCK_CONSULT_REQUEST_DETAIL,
  MOCK_QUICK_CONSULT,
  MOCK_AGREEMENT,
} from '../mock/mockdata';

// ★ 나중에 list 가져오는 것도 추가해야
import {
  loginApi,
  signupPatientApi,
  signupHospitalApi,
  getPatientProfileApi,
  getHospitalProfileApi,
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

// ★ 백엔드 확인 후 추후 수정 -> 병원 리스트 조회 쿼리
export const useHospitalListQuery = () =>
  useQuery({
    queryKey: ['hospitalList'],
    queryFn: () => wait(MOCK_HOSPITALS),
  });

// ------------------------------------------------------------
// 여기서부터는 accounts와 무관 - 이번 요청 범위 아님, 그대로 mock 유지
// ------------------------------------------------------------

export const useConsultPatientsQuery = () =>
  useQuery({ queryKey: ['consultPatients'], queryFn: () => wait(MOCK_CONSULT_PATIENTS) });

export const useCaseListQuery = () =>
  useQuery({ queryKey: ['caseList'], queryFn: () => wait(MOCK_CASES) });

export const useProcedureHistoryQuery = () =>
  useQuery({ queryKey: ['procedureHistory'], queryFn: () => wait(MOCK_PROCEDURE_HISTORY) });

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

export const useRecentCasesQuery = () =>
  useQuery({ queryKey: ['recentCases'], queryFn: () => wait(MOCK_RECENT_CASES) });

export const useAddRecentCase = () => {
  const queryClient = useQueryClient();
  return (newCase) => queryClient.setQueryData(['recentCases'], (old = []) => [...old, newCase]);
};

export const useHandoverDocumentQuery = () =>
  useQuery({ queryKey: ['handoverDocument'], queryFn: () => wait(MOCK_HANDOVER_DOCUMENT) });

export const useConsultPatientDetailQuery = (id) =>
  useQuery({
    queryKey: ['consultPatientDetail', id],
    enabled: !!id,
    queryFn: () => wait(MOCK_CONSULT_PATIENTS.find((p) => p.id === id) ?? null),
  });

export const useConsultRequestDetailQuery = () =>
  useQuery({ queryKey: ['consultRequestDetail'], queryFn: () => wait(MOCK_CONSULT_REQUEST_DETAIL) });

export const useQuickConsultQuery = () =>
  useQuery({ queryKey: ['quickConsult'], queryFn: () => wait(MOCK_QUICK_CONSULT) });

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

export const useAgreementDraftQuery = () =>
  useQuery({ queryKey: ['agreementDraft'], queryFn: () => wait(MOCK_AGREEMENT) });