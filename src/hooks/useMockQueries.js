import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  MOCK_CONSULT_PATIENTS,
  MOCK_HOSPITALS,
  MOCK_CASES,
  MOCK_PATIENT,
  MOCK_PROCEDURE_HISTORY,
  MOCK_RECENT_CASES,
  MOCK_HANDOVER_DOCUMENT,
  MOCK_HOSPITAL_HOME,
  MOCK_CONSULT_REQUEST_DETAIL,
  MOCK_QUICK_CONSULT,
  MOCK_AGREEMENT,
} from '../mock/mockdata';

// ============================================================
// 백엔드 연동 시에는 이 파일의 각 queryFn 안쪽만 실제 fetch로 교체!! 
// ============================================================

// mock 네트워크 지연 흉내
const wait = (data, ms = 400) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

// 2-2 협진요청함 / 2-3 환자조회에서 사용
export const useConsultPatientsQuery = () =>
  useQuery({
    queryKey: ['consultPatients'],
    queryFn: () => wait(MOCK_CONSULT_PATIENTS),
  });

// AI 추천 병원 리스트 / 네트워크 병원 목록에서 사용
export const useHospitalListQuery = () =>
  useQuery({
    queryKey: ['hospitalList'],
    queryFn: () => wait(MOCK_HOSPITALS),
  });

// 케이스 목록 (AI 추천 병원 매칭 - 케이스 선택)
export const useCaseListQuery = () =>
  useQuery({
    queryKey: ['caseList'],
    queryFn: () => wait(MOCK_CASES),
  });

// 환자 프로필 (마이페이지 / 홈)
export const usePatientProfileQuery = () =>
  useQuery({
    queryKey: ['patientProfile'],
    queryFn: () => wait(MOCK_PATIENT),
  });

// 시술 이력 목록 / 상세
export const useProcedureHistoryQuery = () =>
  useQuery({
    queryKey: ['procedureHistory'],
    queryFn: () => wait(MOCK_PROCEDURE_HISTORY),
  });

// 케이스 등록 완료 mutation
// 지금은 API가 없어서 mutationFn 안에서 응답을 mock으로 만들어 바로 반환하지만,,,
// 백엔드 연동 시에는 이 mutationFn 하나만 실제 fetch로 바꾸면 될 거 같아요!
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
  useQuery({
    queryKey: ['recentCases'],
    queryFn: () => wait(MOCK_RECENT_CASES),
  });

// 홈 - 새 케이스 등록 완료 시 '최근 케이스' 목록 캐시에 바로 추가
export const useAddRecentCase = () => {
  const queryClient = useQueryClient();
  return (newCase) =>
    queryClient.setQueryData(['recentCases'], (old = []) => [...old, newCase]);
};

// 협진 인계서
export const useHandoverDocumentQuery = () =>
  useQuery({
    queryKey: ['handoverDocument'],
    queryFn: () => wait(MOCK_HANDOVER_DOCUMENT),
  });

// 병원 홈 피드
export const useHospitalHomeQuery = () =>
  useQuery({
    queryKey: ['hospitalHome'],
    queryFn: () => wait(MOCK_HOSPITAL_HOME),
  });

// 협진 요청 상세
export const useConsultRequestDetailQuery = () =>
  useQuery({
    queryKey: ['consultRequestDetail'],
    queryFn: () => wait(MOCK_CONSULT_REQUEST_DETAIL),
  });

// 병원 신속 협진 - 메시지 목록
export const useQuickConsultQuery = () =>
  useQuery({
    queryKey: ['quickConsult'],
    queryFn: () => wait(MOCK_QUICK_CONSULT),
  });

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

// 협진 합의 - AI 정리 초안 (useAgreementStore 초기화에 사용하는 형식으로 구현 생각중...)
export const useAgreementDraftQuery = () =>
  useQuery({
    queryKey: ['agreementDraft'],
    queryFn: () => wait(MOCK_AGREEMENT),
  });

// 1-1 로그인 페이지에서 role을 로그인 응답에서 받기 위한 mutation 추가!!
// 백엔드 연동 시에는 서버에서 응답 같이 받음...~
// 지금은 흐름 확인용으로 아이디에 'hosp'가 들어가면 병원 계정으로 판단하는 mockdata에 따른 임시 상태
// -> mockdata에 role 부여하셨다면 코드 변경해서 사용하시면 됩니다!! 나중에 이 코드도 변경 예정
export const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ userId }) =>
      wait({ userId: userId || 'aftor123', role: userId?.includes('hosp') ? 'hospital' : 'patient' }),

    // 나중에 아래처럼 연동해서 쓰면 될 것 같습니다!! 혹시 몰라서 이해를 위해 덧붙입니당!! ~.~
    // mutationFn: async ({ userId, password }) => {
    //   const res = await fetch(`${API_BASE_URL}/login`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ userId, password }),
    //   });
    //   if (!res.ok) throw new Error('login failed');
    //   return res.json(); // { userId, role }
    // },
  });
 
