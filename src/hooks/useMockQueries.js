import { useQuery } from '@tanstack/react-query';
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
} from '../mock/mockData';

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

// 홈 - 최근 케이스 목록
export const useRecentCasesQuery = () =>
  useQuery({
    queryKey: ['recentCases'],
    queryFn: () => wait(MOCK_RECENT_CASES),
  });

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

// 협진 합의 - AI 정리 초안 (useAgreementStore 초기화에 사용하는 형식으로 구현 생각중...)
export const useAgreementDraftQuery = () =>
  useQuery({
    queryKey: ['agreementDraft'],
    queryFn: () => wait(MOCK_AGREEMENT),
  });
