import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  MOCK_CONSULT_PATIENTS,
  MOCK_HOSPITALS, // ★ useHospitalListQuery에서 사용 (네트워크, 병원 매칭, 케이스 동기화 페이지)
  MOCK_CASES,
  MOCK_RECENT_CASES,
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

import {
  createCaseTransferApi,
  reviewCaseTransferApi,
  sendCaseTransferApi,
  getUnsentCaseTransfersApi,
  getCaseTransferDetailApi,
  getProcedureHistoryListApi,
  getProcedureHistoryDetailApi,
} from '../apis/caseApi'
import { getCountryName } from '../utils/country'
import { formatDateOnly } from '../utils/format'

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

//cases api

// Case 전송 건 생성 - 성공 시 REVIEW_REQUIRED 상태의 CaseTransfer 반환 (병원에 바로 전송되는 건 아님)
// 아직 페이지에서 호출하지 않음: symptom_case_id/recommendation_id를 넘겨줄 AI 매칭 플로우
// (병원 추천 리스트/매칭 동의)가 전부 mock이라, 실제 값 없이 연결하면 잘못된 요청만 나감
export const useCreateCaseTransferMutation = () =>
  useMutation({
    mutationFn: (body) => createCaseTransferApi(body),
  });

// Case 전송 검토 및 필수 동의 - CaseSyncPage '전송하기' 클릭 시 send와 순서대로 호출됨
// 성공하면 캐시된 상세(useCaseTransferDetailQuery)도 최신 상태로 갱신
export const useReviewCaseTransferMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transferId, agreements }) => reviewCaseTransferApi(transferId, agreements),
    onSuccess: (data) => {
      queryClient.setQueryData(['caseTransferDetail', data.id], data);
    },
  });
};

// Case 최종 전송 - review로 READY_TO_TRANSFER 확인된 뒤에만 호출해야 함 (CaseSyncPage 참고)
export const useSendCaseTransferMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transferId) => sendCaseTransferApi(transferId),
    onSuccess: (data) => {
      queryClient.setQueryData(['caseTransferDetail', data.id], data);
    },
  });
};

// 미전송 Case 목록 (아직 연결된 화면 없음 - 화면 나오면 훅 이름/쿼리키 조정 예정)
export const useUnsentCaseTransfersQuery = () =>
  useQuery({
    queryKey: ['unsentCaseTransfers'],
    queryFn: () => getUnsentCaseTransfersApi(),
  });

// 환자 전송 Case 상세 - CaseSyncPage의 AI 검토/전송 동의/전송 완료 화면 재진입 시 사용 예정
// (transferId는 '전송 건 생성' API 응답에서 받아 store에 저장해야 하는데, 그 API 연동 전이라 아직 실제 값이 없음.
// useConsultPatientDetailQuery와 동일하게 id 없으면 요청 자체를 막아둠)
export const useCaseTransferDetailQuery = (transferId) =>
  useQuery({
    queryKey: ['caseTransferDetail', transferId],
    enabled: !!transferId,
    queryFn: () => getCaseTransferDetailApi(transferId),
  });

// 백엔드 응답 -> MedicalPassportPage/ProcedureHistoryCard/ProcedureDetailPage가 쓰는 필드 형태로 변환
// (단순 이름만 다른 게 아니라 location 조합, date 구분자, id 문자열화처럼 값 자체를 가공해야 해서 매핑 필요)
const mapProcedureHistory = (item) => ({
  id: String(item.medical_case_id),
  name: item.procedure_name,
  tag: item.procedure_area,
  hospital: item.procedure_hospital_name,
  location: [item.procedure_hospital_city, getCountryName(item.procedure_hospital_country)]
    .filter(Boolean)
    .join(', '),
  date: item.procedure_date.replaceAll('-', '.'),
  relatedCaseId: item.case_number,
  status: item.status,
  finalizedAt: item.finalized_at,
});

// 시술 이력 목록 (여권 페이지) - status COMPLETED만 반환됨
export const useProcedureHistoryQuery = () =>
  useQuery({
    queryKey: ['procedureHistory'],
    queryFn: () => getProcedureHistoryListApi().then((list) => list.map(mapProcedureHistory)),
  });

// 백엔드 응답 -> ProcedureDetailPage/ConsultCard/ConsultHistoryPage가 쓰는 필드 형태로 변환
// case_number는 'CASE-2026-000015'처럼 접두어가 붙어있어서, ConsultCard가 자체적으로
// 'Case #'를 붙이는 것과 겹치지 않도록 접두어를 떼어서 consult.caseId에 넣어둠
// (evidence_items의 content -> reasons[].label도 화면 컴포넌트가 기대하는 이름으로 변환)
const mapProcedureHistoryDetail = (data) => ({
  id: String(data.medical_case_id),
  name: data.procedure.name,
  tag: data.procedure.area,
  hospital: data.procedure.hospital_name,
  location: [data.procedure.hospital_city, getCountryName(data.procedure.hospital_country)]
    .filter(Boolean)
    .join(', '),
  date: data.procedure.date.replaceAll('-', '.'),
  relatedCaseId: data.case_number,
  consult: {
    caseId: data.case_number.replace(/^CASE-/, ''),
    hospitalName: data.collaboration.partner_hospital_name,
    date: formatDateOnly(data.collaboration.finalized_at),
  },
  agreement: {
    participants: data.final_agreement.reviews.map((r) => ({ name: r.hospital_name })),
    finalJudgement: data.final_agreement.judgment_draft,
    reasons: data.final_agreement.evidence_items.map((item) => ({ id: item.id, label: item.content })),
    opinion: data.final_agreement.additional_opinion ?? '',
  },
});

// 시술 이력 상세 + 최종 협진 합의안 (상세 화면, 인계서 화면 공통)
// COMPLETED + FINAL 조건을 만족하는 Case만 조회 가능, 그 외엔 404
export const useProcedureHistoryDetailQuery = (medicalCaseId) =>
  useQuery({
    queryKey: ['procedureHistoryDetail', medicalCaseId],
    enabled: !!medicalCaseId,
    queryFn: () => getProcedureHistoryDetailApi(medicalCaseId).then(mapProcedureHistoryDetail),
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